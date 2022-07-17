import { useEffect } from "react";
import { fakeData } from "../../fakeData.json";
import { useSearch, UseSearchType } from "@lib";
import { PhotoGrid } from "@/HomePage/PhotoGrid";
import { css } from "@emotion/react";
import { UnsplashHeader } from "@/HomePage/UnsplashHeader";
import { useRecoilState, useRecoilValue } from "recoil";
import { photosState } from "@/AppEntry";
import { loggedInUserState } from "@/AppEntry/GlobalStore/loggedInUserState";

export const HomePage = () => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [photos, setPhotos] = useRecoilState(photosState);

  const {
    handleSearch,
    searchResults,
    isSearching,
    searchTerm,
  }: UseSearchType = useSearch();
  const photosToUse = searchResults?.photos?.length
    ? searchResults.photos
    : photos;

  useEffect(() => {
    console.log(fakeData);
    // @ts-ignore
    setPhotos(fakeData);
  }, []);

  const parentStyles = css`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  `;

  return (
    <div id="HomePage" css={parentStyles}>
      <UnsplashHeader
        handleSearch={handleSearch}
        isSearching={isSearching}
        loggedInUser={loggedInUser}
      />
      <PhotoGrid
        isSearching={isSearching}
        searchTerm={searchTerm}
        photos={photosToUse}
        setPhotos={setPhotos}
      />
    </div>
  );
};
