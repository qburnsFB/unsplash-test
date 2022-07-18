import {
  getFromUrl,
  PhotosByQueryResultsType,
  scrollPageBy,
  useModal,
} from "@lib";
import { css } from "@emotion/react";
import { useRef, useState, useEffect } from "react";
import { getPhotosByQuery } from "@/lib/utils/getPhotosByQuery";
import {
  BREAKPOINT_MEDIUM,
  BREAKPOINT_MINIMUM_WIDTH,
  PHOTOS_PER_PAGE,
} from "@/lib/constants";
import { PhotoModal } from "@/HomePage/PhotoModal";
import { PhotoItem } from "@/HomePage/PhotoItem";
import * as React from "react";
import { PhotoGridFooter } from "@/HomePage/PhotoGridFooter";

const photoGridStyle = css`
  display: flex;
  width: 100%;
  margin-bottom: 2rem;

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

type PhotoGridType = {
  isSearching: boolean;
  searchTerm: string;
  photosToUse:
    | PhotosByQueryResultsType
    | { isLikedPhotos?: boolean; photos: any[]; total: number };
  setPhotos: SetterOrUpdater<{ photos: unknown[]; total: number }>;
};

export const PhotoGrid = ({
  isSearching,
  searchTerm,
  photosToUse,
  setPhotos,
}: PhotoGridType) => {
  //Modal states
  const { visible, handleToggleModal } = useModal();

  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [outOfPhotos, setOutOfPhotos] = useState(false);
  // @ts-ignore
  const { urlPage, urlTerm } = getFromUrl();

  // photos and Ref Setup
  const firstNewPhotoIndex = useRef(0);

  // If last server result returned less than requested, or if search has completed, or if no results at all,
  const showLoader = loading || isSearching;
  const showOutOfPhotos = outOfPhotos || !photosToUse.photos.length;

  // Initial fetch, and handle scrolling when length of photos changes(only scrolls when there is more than the initial limit)
  // Note, has to be length of photos since we can update the amount photos in place via search and don't want to rescroll
  useEffect(() => {
    if (!photosToUse.photos.length) {
      handleFetchPhotos();
    }

    if (urlPage && !initialLoad) {
      // height of photo block is 320, so scroll by the amount that fit on the scree
      const amountFitOnScreen = document.body.clientHeight / 320;
      scrollPageBy(320 * amountFitOnScreen - 200);
    }
  }, [photosToUse.photos.length]); //eslint-disable-line

  const handleFetchPhotos = async (single?: boolean) => {
    setError(false);
    setLoading(true);

    // Figure out which page to search for
    // if we're coming in from a reload, we need to check the page from the url and grab PAGE * PHOTOS_PER_PAGE

    const shouldBeRandomPhotos = !Boolean(urlTerm);

    let pageToUse = 1;
    let limitToUse = PHOTOS_PER_PAGE;

    if (initialLoad && urlPage > 1) {
      limitToUse = urlPage * PHOTOS_PER_PAGE;
    }
    if (!initialLoad) {
      pageToUse = urlPage === 1 ? 2 : urlPage + 1;
    }

    // Finally, fetch the data once we have that sorted
    // @ts-ignore
    const newPhotos: PhotosByQueryResultsType = await getPhotosByQuery({
      page: pageToUse,
      perPage: limitToUse,
      query: urlTerm,
      random: shouldBeRandomPhotos,
      single,
    });

    if (error) {
      setLoading(false);
      return setError(true);
    }

    if (newPhotos?.photos.length) {
      // Set ref index so we can use it after to properly focus on the latest photo to appear
      // Mostly for accessibility / keyboard navigation
      firstNewPhotoIndex.current =
        newPhotos.photos.length - PHOTOS_PER_PAGE || newPhotos.photos.length;

      // If we're using the same search term, combine results
      setPhotos({
        photos: [...photosToUse.photos, ...newPhotos.photos],
        total: photosToUse.photos.length + newPhotos.photos.length,
      });

      // If we have more photos than the total, we can't grab anymore
      if (newPhotos.photos.length > newPhotos.total) {
        setOutOfPhotos(true);
      }
    }

    // Update url so we can refresh and get back to the same spot
    if (!initialLoad) {
      window.history.replaceState(
        "",
        "",
        `/?page=${pageToUse.toString()}${
          searchTerm ? `&term=${searchTerm}` : ""
        }`
      );
    } else {
      setInitialLoad(false);
    }
    setLoading(false);
  };

  const renderPhotos = () => {
    return photosToUse.photos?.map((photo, i) => {
      const isFirstNewResult = i === firstNewPhotoIndex.current;
      // As mentioned above in fetch method, set focus on the newest result so a11y works as expected.
      // It is skipped for first page so we can maintain focus on search on load

      const giveFocusRef =
        isFirstNewResult && photosToUse.photos.length > PHOTOS_PER_PAGE;

      return (
        <PhotoItem
          key={photo.id}
          photo={photo}
          shouldGiveFocusRef={giveFocusRef}
          handleToggleModal={handleToggleModal}
        />
      );
    });
  };

  const photoForModal = photosToUse.photos.find(
    (photo) => photo.id === visible
  );
  return (
    <>
      <div id="PhotoGrid" css={photoGridStyle}>
        <ul>{renderPhotos()}</ul>
        <PhotoModal
          handleClose={handleToggleModal}
          isOpen={Boolean(visible)}
          photoForModal={photoForModal}
        />
      </div>
      {!photosToUse.isLikedPhotos && (
        <PhotoGridFooter
          showLoader={showLoader}
          showOutOfPhotos={showOutOfPhotos}
          handleFetchPhotos={handleFetchPhotos}
        />
      )}
    </>
  );
};
