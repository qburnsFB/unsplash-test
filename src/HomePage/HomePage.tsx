import { useEffect, useState } from "react";
import { fakeData } from "../../fakeData.json";
import { getFromUrl, useSearch, UseSearchType, useUserLikedPhotos } from "@lib";
import { PhotoGrid } from "@/HomePage/PhotoGrid";
import { css } from "@emotion/react";
import { UnsplashHeader } from "@/HomePage/UnsplashHeader";
import { useRecoilState, useRecoilValue } from "recoil";
import { photosState } from "@/AppEntry";
import { loggedInUserState } from "@/AppEntry/GlobalStore/loggedInUserState";
import { Button } from "@/lib/shared/Button";
import * as React from "react";
import { BREAKPOINT_LARGE, BREAKPOINT_MEDIUM } from "@/lib/constants";

export const HomePage = () => {
  // @ts-ignore
  const { urlPage, urlTerm, viewUserLikes } = getFromUrl();
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [likedPhotos] = useUserLikedPhotos(viewUserLikes || loggedInUser.id);
  const [photos, setPhotos] = useRecoilState(photosState);
  const [shouldUseListFromUrl, setShouldUseListFromUrl] =
    useState(viewUserLikes);
  const [prevUrl, setPrevUrl] = useState("");

  // ensure we're at top on liked
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [shouldUseListFromUrl]);

  const {
    handleSearch,
    searchResults,
    isSearching,
    searchTerm,
  }: UseSearchType = useSearch();

  // Pick which photos will be used. If search results, use them, otherwise use the server results.
  // Lastly, if we are using the list of a user(found in the url param), we can search there and use that
  let photosToUse;
  if (shouldUseListFromUrl && likedPhotos) {
    const newArray = [];

    for (const [_, value] of Object.entries(likedPhotos.photos)) {
      newArray.push(value);
    }
    photosToUse = {
      isLikedPhotos: true,
      photos: newArray,
      total: newArray.length,
    };
  } else if (searchTerm) {
    photosToUse = searchResults;
  } else if (photos.photos?.length) {
    photosToUse = photos;
  } else {
    photosToUse = {
      photos: [],
      total: 0,
    };
  }

  useEffect(() => {
    // @ts-ignore
    // can use this to test app if API key has rate limit expired
    setPhotos({ photos: fakeData, total: 10 });
  }, []);

  const parentStyles = css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  `;

  // Liked click -- remember previous url params and swap between them.
  const handleLikedClick = () => {
    if (prevUrl && shouldUseListFromUrl) {
      window.history.replaceState("", "", prevUrl);
    } else {
      setPrevUrl(
        `/${urlPage !== 1 ? `?page=${urlPage.toString()}` : ""}${
          urlTerm && urlPage !== 1 ? "&" : "?"
        }${urlTerm ? `term=${urlTerm}` : ""}`
      );
    }

    // Add id to url for now viewing this user
    if (!shouldUseListFromUrl) {
      window.history.replaceState("", "", `/?viewUserLikes=${loggedInUser.id}`);
    }
    setShouldUseListFromUrl(!shouldUseListFromUrl);
  };
  return (
    <div id="HomePage" css={parentStyles}>
      <UnsplashHeader
        handleSearch={handleSearch}
        isSearching={isSearching}
        loggedInUser={loggedInUser}
      />
      <ul
        css={css`
          list-style-type: none;
          text-align: center;
          padding: 0;
          width: 100%;
          margin: 80px 0 0;

          @media (min-width: ${BREAKPOINT_MEDIUM}px) {
            margin: 100px 3rem 0 0;
          }

          @media (min-width: ${BREAKPOINT_LARGE}px) {
            margin: 100px 0 0;
          }
        `}
      >
        <Button
          onClick={handleLikedClick}
          css={css`
            width: auto;
            height: auto;
            padding: 1rem;
            font-size: 1rem;
            background: ${shouldUseListFromUrl ? "#333" : "transparent"};
            color: ${shouldUseListFromUrl ? "#fff" : "#333"};
            border-color: ${shouldUseListFromUrl ? "transparent" : "#333"};
          `}
        >
          Liked only
        </Button>
      </ul>
      <PhotoGrid
        isSearching={isSearching}
        searchTerm={searchTerm}
        setPhotos={setPhotos}
        photosToUse={photosToUse}
      />
    </div>
  );
};
