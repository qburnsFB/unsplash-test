import {css} from "@emotion/react";
import {
    BREAKPOINT_LARGE, BREAKPOINT_MAX_WIDTH,
    BREAKPOINT_MEDIUM,
    BREAKPOINT_MINIMUM_WIDTH,
    BREAKPOINT_XL,
    BREAKPOINT_XXL
} from "./constants.js";

export const globalStyles = css`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  html {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    font-size: 16px;
  }

  body {
    position: relative;
    width: 100%;
    min-width: ${BREAKPOINT_MINIMUM_WIDTH}px;
    height: 100%;
    padding: 0;
    margin: 0;
    background: #eee;
    overflow-x: hidden;
    font-family: 'Helvetica', 'Tahoma', 'Arial', sans-serif;
  }

  #root,
  #AppEntry {
    width: 100%;
    min-height: 100%;
  }

  #AppEntry {
    position: absolute;
    margin: 0 auto;
    padding: 0;
    display: flex;
    justify-content: center;
    max-width: ${BREAKPOINT_MEDIUM}px;

    @media (min-width: ${BREAKPOINT_MEDIUM}px) {
      padding: 0 1rem;
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

  .modalContent {
    max-width: 40rem;
    border: 1px solid #ccc;
    background: #fff;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    border-radius: 10px;
    outline: none;
    padding: 1rem;
    margin: 0 2rem 7rem;
  }

  .modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 75%);
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;