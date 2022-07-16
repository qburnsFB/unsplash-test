import { useEffect, useRef } from "react";
import { Loader } from "@lib";

export type SearchType = {
  queryToSearch: string;
};

export type SearchInputType = {
  handleSearch: ({ queryToSearch }: SearchType) => Promise<void>;
  isSearching: boolean;
};

export const SearchInput = ({ handleSearch, isSearching }: SearchInputType) => {
  const ref = useRef(null);
  useEffect(() => {
    const refToUse = ref?.current as any;
    refToUse.focus();
  }, []);

  return (
    <>
      <div
        id="SearchInput"
        css={{
          margin: 0,
          position: "relative",
        }}
      >
        <input
          aria-label="Search Unsplash"
          type="search"
          name="search"
          placeholder="Search..."
          ref={ref}
          css={{
              marginTop: "0.6rem",
            width: "100%",
              height: '30px',
            position: "relative",
            zIndex: 100,
          }}
          tabIndex={0}
          onChange={(e) => handleSearch({ queryToSearch: e.target.value })}
        />

        <span
          data-testid="searchInputIsSearching"
          css={{
            position: "absolute",
            right: "5rem",
            top: "1.5rem",
            opacity: isSearching ? 1 : 0,
            zIndex: 100,
          }}
        >
          <Loader size="0.5rem" color="#ccc" />
        </span>
      </div>
    </>
  );
};
