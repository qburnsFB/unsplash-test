import { getFromUrl, Loader, PhotoType, scrollPageBy, useModal } from "@lib";
import { css } from "@emotion/react";
import { useRef, useState, useEffect } from "react";
import { getPhotosByQuery } from "@/lib/utils/getPhotosByQuery";
import { BREAKPOINT_MEDIUM, BREAKPOINT_MINIMUM_WIDTH } from "@/lib/constants";
import { PhotoModal } from "@/HomePage/PhotoModal";
import { SetterOrUpdater } from "recoil";

type PhotoGridType = {
  isSearching: boolean;
  searchTerm: string;
  photos: PhotoType[];
  setPhotos: SetterOrUpdater<never[]>;
};

const photoLimit = 10;
export const PhotoGrid = ({
  isSearching,
  searchTerm,
  photos,
  setPhotos,
}: PhotoGridType) => {
  //Modal states
  const { visible, handleToggleModal } = useModal();

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
      firstNewPhotoIndex.current =
        newPhotos.length - photoLimit || newPhotos.length;

      // TODO: fix this to work
      // If we're using the same search term, combine results
      //handleSetPhotos(!searchTerm ? newPhotos : [...photos, newPhotos]);
      setPhotos(newPhotos);

      // If we have less photos than we expect now, we're out of photos and can't grab anymore
      const lessThanExpected = initialLoad ? urlPage * photoLimit : photoLimit;
      if (photos.length < lessThanExpected) {
        setOutOfPhotos(true);
      }
    }

    // Update url so we can refresh and get back to the same spot
    if (!initialLoad) {
      window.history.replaceState(
        "",
        "",
        `/?page=${pageToUse.toString()}&term=${searchTerm}`
      );
    } else {
      setInitialLoad(false);
    }

    setLoading(false);
  };

  const renderPhotos = () => {
    return photos?.map((photo, i) => {
      const isFirstNewResult = i === firstNewPhotoIndex.current;
      // As mentioned above in fetch method, set focus on the newest result so a11y works as expected.
      // It is skipped for first page so we can maintain focus on search on load

      const giveFocusRef =
        isFirstNewResult && photos.length > photoLimit ? focusRef : undefined;

      return (
        <li css={photoStyle} key={photo.id} ref={giveFocusRef}>
          <img src={photo.urls.thumb} alt={photo.description} />
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
      grid-template-columns: repeat(
        auto-fill,
        calc(${BREAKPOINT_MINIMUM_WIDTH}px - 2rem)
      );

      @media (min-width: ${BREAKPOINT_MEDIUM}) {
        grid-template-columns: repeat(
          auto-fill,
          calc(${BREAKPOINT_MEDIUM}px - 2rem)
        );
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

  const photoForModal = photos.find((photo) => photo.id === visible);
  console.log({ photoForModal });
  return (
    <>
      <div id="PhotoGrid" css={photoGridStyle}>
        <ul>{renderPhotos()}</ul>
        {showOutOfPhotos && <p>Out of Photos!</p>}
      </div>

      {photoForModal && (
        <PhotoModal
          handleClose={handleToggleModal}
          isOpen={Boolean(visible)}
          photoForModal={photoForModal}
        />
      )}
    </>
  );
};
