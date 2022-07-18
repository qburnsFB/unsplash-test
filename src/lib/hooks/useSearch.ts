import { useState, useEffect } from "react";
import {
  getFromUrl,
  getPhotosByQuery,
  PhotosByQueryResultsType,
  useDebounce,
} from "@lib";
import { SearchType } from "@/HomePage/SearchInput";
import { PHOTOS_PER_PAGE } from "@/lib/constants";

export type UseSearchType = {
  handleSearch: ({ queryToSearch }: SearchType) => Promise<void>;
  searchResults: PhotosByQueryResultsType;
  isSearching: boolean;
  searchTerm: string;
};

export const useSearch = (): UseSearchType => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<PhotosByQueryResultsType>({
    photos: [],
    total: 0,
    error: [""],
  });
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = async ({ queryToSearch }: SearchType) => {
    setSearchTerm(queryToSearch);
    setIsSearching(true);
  };

  const handleSearchPhotos = async () => {
    // @ts-ignore
    const { urlPage } = getFromUrl();
    if (debouncedSearchTerm) {
      const newPhotos: any = await getPhotosByQuery({
        query: debouncedSearchTerm,
        page: urlPage,
        perPage: PHOTOS_PER_PAGE,
      });

      setIsSearching(false);
      // If we're using the same search term, combine results
      setSearchResults({
        photos: [...searchResults.photos, ...newPhotos.photos],
        total: searchResults.photos.length + newPhotos.photos.length,
        error: newPhotos.errors,
      });
    } else {
      setSearchResults({ photos: [], total: 0 });
      setIsSearching(false);
    }
  };
  useEffect(() => {
    handleSearchPhotos();
  }, [debouncedSearchTerm]); //eslint-disable-line

  return {
    searchResults,
    handleSearch,
    isSearching,
    searchTerm,
  };
};
