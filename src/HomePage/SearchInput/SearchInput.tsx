import { useEffect } from "react";
import { css } from "@emotion/react";
import { VERSUS_COLOR_PRIMARY } from "@/lib/constants";

export type SearchType = {
  queryToSearch: string;
};

export type SearchInputType = {
  handleSearch: ({ queryToSearch }: SearchType) => Promise<void>;
  searchRef?: any;
};

export const SearchInput = ({ handleSearch, searchRef }: SearchInputType) => {
  useEffect(() => {
    const refToUse = searchRef?.current as any;
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
          ref={searchRef}
          css={css`
            margin-top: 0.6rem;
            width: 100%;
            height: 30px;
            position: relative;
            padding-left: 0.5rem;
            z-index: 100;
            outline: 0;
            border-radius: 5px;

            &:focus,
            &:focus-within {
              border: 2px solid ${VERSUS_COLOR_PRIMARY} !important;
            }
          `}
          tabIndex={0}
          onChange={(e) => handleSearch({ queryToSearch: e.target.value })}
        />
      </div>
    </>
  );
};
