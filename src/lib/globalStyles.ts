import { css } from "@emotion/react";
import {
  BREAKPOINT_LARGE,
  BREAKPOINT_MAX_WIDTH,
  BREAKPOINT_MEDIUM,
  BREAKPOINT_MINIMUM_WIDTH,
  BREAKPOINT_XL,
  BREAKPOINT_XXL,
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
    font-family: "Helvetica", "Tahoma", "Arial", sans-serif;
  }

  #root,
  #AppEntry {
    width: 100%;
    min-height: 100%;
  }

  #root {
    align-content: center;
    justify-content: center;
    display: flex;
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
    max-width: 80vw;
    border: 1px solid #ccc;
    background: #fff;
    -webkit-overflow-scrolling: touch;
    border-radius: 10px;
    outline: none;
    padding: 1rem;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      max-height: 80vh;
      object-fit: cover;
    }

    .close {
      position: absolute;
      right: 0;
      top: -3rem;
      width: 24px;
      height: 24px;
      opacity: 0.75;
      z-index: 9999;
      cursor: pointer;

      @media (min-width: ${BREAKPOINT_MEDIUM}px) {
        top: -2.5rem;
      }

      @media (min-width: ${BREAKPOINT_LARGE}px) {
        right: -3rem;
        top: 0;
      }
    }
    .close:hover {
      opacity: 1;
    }
    .close:before,
    .close:after {
      position: absolute;
      left: 15px;
      content: " ";
      height: 33px;
      z-index: 500;
      width: 2px;
      background-color: #fff;
    }
    .close:before {
      transform: rotate(45deg);
    }
    .close:after {
      transform: rotate(-45deg);
    }
  }

  .modalOverlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 85%);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .ReactModal__Overlay {
    opacity: 0;
    transition: opacity 250ms ease-in-out;
  }

  .ReactModal__Overlay--after-open {
    opacity: 1;
  }

  .ReactModal__Overlay--before-close {
    opacity: 0;
  }
`;
