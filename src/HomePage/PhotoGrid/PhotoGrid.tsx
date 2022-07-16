import { getFromUrl, Loader, PhotoType, scrollPageBy, useModal, UserType } from "@lib";
import { css } from "@emotion/react";
import { useRef, useState, useEffect, SetStateAction, Dispatch } from "react";
import { getPhotosByQuery } from "@/lib/utils/getPhotosByQuery";
import { BREAKPOINT_MEDIUM, BREAKPOINT_MINIMUM_WIDTH } from "@/lib/constants";
import { PhotoModal } from "@/HomePage/PhotoModal";
import currentDb from "../../../likedPhotos.json";
import fs from "vite-plugin-fs/browser";

type PhotoGridType = {
  loggedInUser: UserType;
  photos: PhotoType[];
  isSearching: boolean;
  searchTerm: string;
  handleSetPhotos: (newPhotos: PhotoType[]) => void;
  handleSetLikedPhotos: (lP: { ids: string[]; photos: PhotoType[] }) => void;
};

const photoLimit = 10;
export const PhotoGrid = ({
  loggedInUser,
  photos,
  isSearching,
  searchTerm,
  handleSetPhotos,
  handleSetLikedPhotos,
}: PhotoGridType) => {
  //Modal states
  const { visible, handleToggleModal } = useModal();
  const [isOpen, setIsOpen] = useState(false);
  const { likedPhotos } = loggedInUser;

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const showLoader = loading || isSearching;
  const [outOfPhotos, setOutOfPhotos] = useState(false);

  // photos and Ref Setup
  const firstNewPhotoIndex = useRef(0);
  const focusRef = useRef(null);

  // If last server result returned less than requested, or if search has completed, or if no results at all,
  const showOutOfPhotos = outOfPhotos || (!showLoader && Boolean(searchTerm));

  // Initial fetch, and handle scrolling when length of photos changes(only scrolls when there is more than the initial limit)
  // Note, has to be length of photos since we can update the photos in place and don't want to rescroll
  useEffect(() => {
    console.log({ photos });
    if (!photos.length) {
      //handleFetchPhotos();
    }
    if (photos.length > photoLimit) {
      console.log(document.body.scrollHeight - screen.height);
      scrollPageBy(document.body.scrollHeight - screen.height);
    }
  }, [photos.length]); //eslint-disable-line

  const handleFetchPhotos = async () => {
    setError(false);
    setLoading(true);

    // Figure out which page to search for
    // if we're coming in from a reload, we need to check the page from the url and grab PAGE * CARD_LIMIT

    // @ts-ignore
    const { urlPage, urlTerm } = getFromUrl();
    const shouldBeRandomPhotos = !Boolean(urlTerm);

    let pageToUse = 1;
    let limitToUse = photoLimit;

    if (initialLoad && urlPage > 1) {
      limitToUse = urlPage * photoLimit;
    }
    if (!initialLoad) {
      pageToUse = urlPage === 1 ? 2 : urlPage + 1;
    }

    // Finally, fetch the data once we have that sorted
    // @ts-ignore
    const { photos: newPhotos, error } = await getPhotosByQuery({
      page: pageToUse,
      perPage: limitToUse,
      query: urlTerm,
      random: shouldBeRandomPhotos,
    });

    console.log({ newPhotos });

    if (error) {
      setLoading(false);
      return setError(true);
    }

    if (newPhotos?.length) {
      // Set ref index so we can use it after to properly focus on the latest photo to appear
      // Mostly for accessibility / keyboard navigation
      firstNewPhotoIndex.current = newPhotos.length - photoLimit || newPhotos.length;

      // TODO: fix this to work
      // If we're using the same search term, combine results
      //handleSetPhotos(!searchTerm ? newPhotos : [...photos, newPhotos]);
      handleSetPhotos(newPhotos);

      // If we have less photos than we expect now, we're out of photos and can't grab anymore
      const lessThanExpected = initialLoad ? urlPage * photoLimit : photoLimit;
      if (photos.length < lessThanExpected) {
        setOutOfPhotos(true);
      }
    }

    // Update url so we can refresh and get back to the same spot
    if (!initialLoad) {
      window.history.replaceState("", "", `/?page=${pageToUse.toString()}&term=${searchTerm}`);
    } else {
      setInitialLoad(false);
    }

    setLoading(false);
  };

  const handleLovePress = async (photo: PhotoType, isLiked: boolean) => {
    let newIds: string[] = [];
    let newPhotos: PhotoType[] = [];

    console.log({ likedPhotos });

    // is currently liked
    if (isLiked) {
      newIds = likedPhotos.ids.filter((a) => a !== photo.id);
      newPhotos = likedPhotos.photos.filter((p) => p.id !== photo.id);
    } else {
      newIds = [...likedPhotos.ids, photo.id];
      newPhotos = [...likedPhotos.photos];
      newPhotos[photo.id] = photo;
    }

    console.log({ newPhotos });

    handleSetLikedPhotos({
      ids: newIds,
      photos: newPhotos,
    });

    /*
    await fs.writeFile(
      "../../likedPhotos.json",
      JSON.stringify({
        ...currentDb,
        [loggedInUser.id]: {
          ids: newIds,
          photos: newPhotos,
        },
      })
    ); */

    console.log({ currentDb });
  };

  const renderPhotos = () => {
    return photos?.map((photo, i) => {
      const isFirstNewResult = i === firstNewPhotoIndex.current;
      // As mentioned above in fetch method, set focus on the newest result so a11y works as expected.
      // It is skipped for first page so we can maintain focus on search on load

      const giveFocusRef = isFirstNewResult && photos.length > photoLimit ? focusRef : undefined;

      const isLiked = photo.id === likedPhotos?.ids.length ? likedPhotos.ids.filter((a) => a === photo.id) : false;

      return (
        <li css={photoStyle} key={photo.id} ref={giveFocusRef}>
          <img src={photo.urls.thumb} alt={photo.description} />
          {i + 1 === photos.length && (
            <PhotoModal
              isLiked={isLiked}
              handleClose={() => console.log("close")}
              handleLovePress={() => handleLovePress(photo, isLiked)}
              photo={photo}
            />
          )}
        </li>
      );
    });
  };

  const photoGridStyle = css`
    display: flex;
    width: 100%;
    margin-top: 100px;

    ul {
      display: grid;
      list-style-type: none;
      width: 100%;
      padding: 0;
      justify-content: space-evenly;
      flex-wrap: wrap;
      grid-template-columns: repeat(auto-fill, calc(${BREAKPOINT_MINIMUM_WIDTH}px - 2rem));

      @media (min-width: ${BREAKPOINT_MEDIUM}) {
        grid-template-columns: repeat(auto-fill, calc(${BREAKPOINT_MEDIUM}px - 2rem));
      }
    }
  `;

  const photoStyle = css`
    width: calc(${BREAKPOINT_MINIMUM_WIDTH}px - 2rem);
    height: 320px;
    padding: 1rem;

    @media (min-width: ${BREAKPOINT_MEDIUM}) {
      padding: 1rem 0.5rem;
    }

    img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
  `;

  if (!photos.length) {
    return <Loader />;
  }

  return (
    <div id="PhotoGrid" css={photoGridStyle}>
      <ul>{renderPhotos()}</ul>
      {showOutOfPhotos && <p>Out of Photos!</p>}
    </div>
  );
};
