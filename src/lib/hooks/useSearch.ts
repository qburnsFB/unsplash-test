import { useState, useEffect } from "react";
import { getPhotosByQuery, PhotosByQueryResultsType, useDebounce } from "@lib";
import { SearchType } from "@/HomePage/SearchInput";

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
    if (debouncedSearchTerm) {
      const { photos, total, error }: any = await getPhotosByQuery({
        query: debouncedSearchTerm,
        page: 1,
      });

      setIsSearching(false);
      setSearchResults({ photos, total, error });

      window.history.replaceState(
        "",
        "",
        `/${searchTerm ? `?term=${debouncedSearchTerm}` : ""}`
      );
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
