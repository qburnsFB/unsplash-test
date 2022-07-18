import { UserType } from "@lib";
import { css } from "@emotion/react";
import {
  BREAKPOINT_LARGE,
  BREAKPOINT_MAX_WIDTH,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_XL,
  BREAKPOINT_XXL,
} from "@/lib/constants";
import { SearchInput, SearchInputType } from "@/HomePage/SearchInput";
import { useRef } from "react";

interface UnsplashHeaderType extends SearchInputType {
  loggedInUser: UserType;
  isSearching: boolean;
}

export const UnsplashHeader = ({
  handleSearch,
  loggedInUser,
}: UnsplashHeaderType) => {
  const unsplashHeaderStyles = css`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    background: #fff;
    display: flex;
    z-index: 500;
    justify-content: center;

    > ul {
      width: 100%;
      list-style-type: none;
      display: grid;
      margin: 0;
      padding: 0;
      justify-content: space-evenly;
      grid-template-columns: 25% 1fr 25%;
      @media (min-width: ${BREAKPOINT_MEDIUM}px) {
        max-width: ${BREAKPOINT_LARGE}px;
      }

      @media (min-width: ${BREAKPOINT_LARGE}px) {
        padding: 0 2rem;
        max-width: ${BREAKPOINT_XL}px;
      }

      @media (min-width: ${BREAKPOINT_XL}px) {
        max-width: ${BREAKPOINT_XXL}px;
      }

      @media (min-width: ${BREAKPOINT_XXL}px) {
        max-width: ${BREAKPOINT_MAX_WIDTH}px;
      }
    }

    h2 {
      padding: 0.75rem 0.75rem;
      margin: 0;
    }

    p {
      text-align: right;
      padding-right: 0.75rem;
      text-overflow-ellipsis: ellipsis;
    }

    @media (min-width: ${BREAKPOINT_MEDIUM}px) {
      h2 {
        padding: 0.75rem 1rem 0.75rem 2rem;
      }

      p {
        padding-right: 2rem;
      }
    }
  `;

  const handleGoToTop = () => {
    if (searchRef?.current) {
      const searchRefCurrent = searchRef.current as any;
      searchRefCurrent.value = "";
      searchRefCurrent.focus();
      window.history.replaceState("", "", "/");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const searchRef = useRef(null);

  return (
    <header css={unsplashHeaderStyles}>
      <ul>
        <li>
          <button
            onClick={handleGoToTop}
            css={{
              background: "transparent",
              border: 0,
              cursor: "pointer",
              height: "100%",
              margin: 0,
              padding: 0,
            }}
          >
            <h2>VSA</h2>
          </button>
        </li>
        <li>
          <SearchInput searchRef={searchRef} handleSearch={handleSearch} />
        </li>
        <li>
          <p>@{loggedInUser.username}</p>
        </li>
      </ul>
    </header>
  );
};
