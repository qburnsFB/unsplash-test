import { useEffect, useState } from "react";
import { fakeData } from "../../fakeData.json";
import { PhotoType, UserType, useSearch, UseSearchType } from "@lib";
import { PhotoGrid } from "@/HomePage/PhotoGrid";
import { SearchInput } from "@/HomePage/SearchInput";
import { css } from "@emotion/react";
import { UnsplashHeader } from "@/HomePage/UnsplashHeader";

type HomePageType = {
  loggedInUser: UserType;
};

export const HomePage = ({ loggedInUser }: HomePageType) => {
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const handleSetPhotos = (newPhotos: PhotoType[]) => setPhotos(newPhotos);

  // Restore liked photos in state here instead of just using it so we can optimistically update the list w/o
  // hitting the db before we show "loved"
  const [likedPhotos, setLikedPhotos] = useState(loggedInUser?.likedPhotos || []);
  const handleSetLikedPhotos = (lP: PhotoType[]) => setLikedPhotos(lP);

  const { handleSearch, searchResults, isSearching, searchTerm }: UseSearchType = useSearch();
  const photosToUse = searchResults?.photos?.length ? searchResults.photos : photos;

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
      <UnsplashHeader handleSearch={handleSearch} isSearching={isSearching} loggedInUser={loggedInUser} />
      <PhotoGrid
        loggedInUser={loggedInUser}
        handleSetLikedPhotos={handleSetLikedPhotos}
        isSearching={isSearching}
        searchTerm={searchTerm}
        photos={photosToUse}
        handleSetPhotos={handleSetPhotos}
      />
    </div>
  );
};
