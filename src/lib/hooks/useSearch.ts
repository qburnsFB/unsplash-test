import { useState, useEffect } from "react";
import { getPhotosByQuery, PhotoType, useDebounce } from "@lib";
import { SearchType } from "@/HomePage/SearchInput";

export type UseSearchType = {
  handleSearch: ({ queryToSearch }: SearchType) => Promise<void>;
  searchResults: [
    {
      photos: PhotoType[];
    }
  ];
  isSearching: boolean;
  searchTerm: string;
};

export const useSearch = (): UseSearchType => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleSearch = async ({ queryToSearch }: SearchType) => {
    setSearchTerm(queryToSearch);
    setIsSearching(true);
  };

  const handleSearchPhotos = async () => {
    if (debouncedSearchTerm) {
      const photos = await getPhotosByQuery({
        query: debouncedSearchTerm,
      });
      setIsSearching(false);
      setSearchResults(photos);
    } else {
      setSearchResults([]);
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
