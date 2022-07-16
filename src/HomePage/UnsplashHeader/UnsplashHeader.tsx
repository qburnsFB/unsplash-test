import { UserType } from "@lib";
import { HomePage } from "@/HomePage/HomePage";
import { css, Global } from "@emotion/react";
import {
  BREAKPOINT_LARGE,
  BREAKPOINT_MAX_WIDTH,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_MINIMUM_WIDTH,
  BREAKPOINT_XL,
  BREAKPOINT_XXL,
} from "@/lib/constants";
import { SearchInput, SearchInputType } from "@/HomePage/SearchInput";

interface UnsplashHeaderType extends SearchInputType {
    loggedInUser: UserType
}

export const UnsplashHeader = ({ handleSearch, isSearching, loggedInUser }: UnsplashHeaderType) => {
  const unsplashHeaderStyles = css`
    display: grid;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 50px;
    border-bottom: 1px solid #ccc;
    background: #fff;
    justify-content: space-evenly;
    grid-template-columns: 25% 1fr 25%;
    
    h2 {
      padding: 0.75rem 1rem;
      margin: 0;
    }
    
    p {
      text-align: right;
      padding-right: 0.5rem;
    }
  `;

  return (
    <header css={unsplashHeaderStyles}>
      <div><h2>VSU</h2></div>
      <SearchInput handleSearch={handleSearch} isSearching={isSearching} />
      <div><p>@{loggedInUser.username}</p></div>
    </header>
  );
};
