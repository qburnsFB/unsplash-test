import { css } from "@emotion/react";
import { BREAKPOINT_MEDIUM, BREAKPOINT_MINIMUM_WIDTH } from "@/lib/constants";
import { PhotoType, useUserLikedPhotos } from "@lib";
import { useRef } from "react";
import * as React from "react";
import { useRecoilValue } from "recoil";
import { loggedInUserState } from "@/AppEntry/GlobalStore/loggedInUserState";

type PhotoItemType = {
  photo: PhotoType;
  shouldGiveFocusRef: boolean;
  handleToggleModal: (id: string) => void;
};

export const PhotoItem = ({
  photo,
  shouldGiveFocusRef,
  handleToggleModal,
}: PhotoItemType) => {
  const focusRef = useRef(null);
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [likedPhotos] = useUserLikedPhotos(loggedInUser.id);
  const isLiked = likedPhotos?.ids.find((id: string) => id === photo.id);
  const photoStyle = css`
    width: calc(${BREAKPOINT_MINIMUM_WIDTH}px - 2rem);
    height: 320px;
    padding: 1rem;
    cursor: pointer;
    position: relative;

    aside {
      content: " ";
      background: rgba(0, 0, 0, 0.75);
      position: absolute;
      top: 1rem;
      left: 1rem;
      width: calc(100% - 2rem);
      height: calc(100% - 2rem);
      opacity: 0;
      transition: opacity 250ms ease-in-out;
    }

    &:hover {
      aside {
        opacity: 1;
      }
    }

    @media (min-width: ${BREAKPOINT_MEDIUM}) {
      padding: 1rem 0.5rem;
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  `;

  const overlayStyle = css`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    > div {
      width: 30px;
      height: 36px;
      position: absolute;
      display: inline-block;
      transform-origin: 50% 50%;
      transform: rotate(45deg) scale(1) translateX(-50%);
      left: calc(50% - 0.5rem);
      top: 0;

      &:before {
        content: "";
        position: absolute;
        display: block;
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
        background-color: ${isLiked ? "#b43737" : `#ccc`};
        width: inherit;
        height: 24px;
        top: 12px;
        left: 0;
      }

      &:after {
        content: "";
        position: absolute;
        display: block;
        background-color: ${isLiked ? "#b43737" : `#ccc`};
        width: 24px;
        top: 0;
        left: 12px;
        height: inherit;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
      }

      + p {
        display: inline-block;
        font-size: 2.5rem;
        margin-top: 3.25rem;
        text-align: center;
        color: #fff;
      }
    }
  `;

  const amountOfLikes = isLiked ? photo["likes"] + 1 : photo["likes"];
  return (
    <li
      key={photo.id}
      css={photoStyle}
      ref={shouldGiveFocusRef ? focusRef : undefined}
      onClick={() => handleToggleModal(photo.id)}
    >
      <img src={photo.urls.small_s3} alt={photo.description} />
      <aside>
        <div css={overlayStyle}>
          <div />
          <p>{amountOfLikes}</p>
        </div>
      </aside>
    </li>
  );
};
