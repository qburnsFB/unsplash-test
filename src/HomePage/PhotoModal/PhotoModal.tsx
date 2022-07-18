import { keyedPhoto, PhotoType, useKeyPress, useUserLikedPhotos } from "@lib";
import Modal from "react-modal";
import { useEffect } from "react";
import { loggedInUserState } from "@/AppEntry/GlobalStore/loggedInUserState";
import { useRecoilValue } from "recoil";
import * as React from "react";
import { Button } from "@/lib/shared/Button";
import { css } from "@emotion/react";
import { BREAKPOINT_MEDIUM } from "@/lib/constants";

type PhotoModalType = {
  photoForModal: PhotoType | undefined;
  isOpen: boolean;
  handleClose: (a: string) => void;
};

export const PhotoModal = ({
  handleClose,
  isOpen,
  photoForModal,
}: PhotoModalType) => {
  const loggedInUser = useRecoilValue(loggedInUserState);
  const [likedPhotos, setLikedPhotos] = useUserLikedPhotos(loggedInUser.id);
  const escapePressed: boolean = useKeyPress("Escape");

  useEffect(() => {
    if (escapePressed) {
      handleClose("");
    }
  }, [escapePressed]);

  const isLiked = likedPhotos?.ids.find((a: string) => a === photoForModal?.id);
  const handleLovePress = async () => {
    let newPhotos: keyedPhoto = Object.assign({}, likedPhotos.photos);
    let newIds: string[] = [];

    // toggle loved/unloved
    if (isLiked && photoForModal?.id) {
      newIds = likedPhotos.ids.filter((id: string) => id !== photoForModal.id);
      delete newPhotos[photoForModal.id];
    } else if (photoForModal?.id) {
      newIds = [...likedPhotos.ids, photoForModal.id];
      newPhotos[photoForModal.id] = photoForModal;
    }

    // Whether loving or unloving, send it optimistically update, then write to the file system
    setLikedPhotos({
      userId: loggedInUser.id,
      username: loggedInUser.username,
      ids: newIds,
      photos: newPhotos,
    });
  };

  const doHandleClose = () => handleClose("");

  const heartStyle = css`
    width: 30px;
    height: 36px;
    position: absolute;
    display: inline-block;
    transform-origin: 50% 50%;
    transform: rotate(45deg) scale(0.5);
    left: 0.4rem;
    top: 1px;
    &:before {
      content: "";
      position: absolute;
      display: block;
      border-top-left-radius: 12px;
      border-bottom-left-radius: 12px;
      background-color: ${isLiked ? "#b43737" : `#666`};
      width: inherit;
      height: 24px;
      top: 12px;
      left: 0;
    }

    &:after {
      content: "";
      position: absolute;
      display: block;
      background-color: ${isLiked ? "#b43737" : `#666`};
      width: 24px;
      top: 0;
      left: 12px;
      height: inherit;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }

    + p {
      padding-left: 46px;
      display: inline-block;
      text-transform: uppercase;
      font-weight: bold;
      vertical-align: 50%;
      color: ${isLiked ? "#b43737" : `#222`};
      &:before {
        content: " ";
        height: 100%;
        width: 1px;
        background: ${isLiked ? "#b43737" : `#666`};
        position: absolute;
        top: 0;
        left: 45px;
      }
    }
  `;

  return (
    <Modal
      className="modalContent"
      overlayClassName="modalOverlay"
      isOpen={isOpen && Boolean(photoForModal?.id)}
      onRequestClose={doHandleClose}
      shouldCloseOnOverlayClick={true}
      appElement={document.getElementById("root") || undefined}
    >
      {photoForModal?.id && (
        <div>
          <div className="close" onClick={doHandleClose} />
          <main
            css={{
              backgroundImage: `url(${photoForModal.urls.small})`, // use same pic as thumbnail as background
              backgroundSize: "cover", // this will allow slow connections to avoid flash of content loading
              width: "100%",
              height: "100%",
            }}
          >
            <img
              alt={photoForModal.description}
              src={photoForModal.urls.regular}
            />
          </main>
          <aside>
            <div
              css={css`
                display: block;
                text-align: center;
                margin: 1rem 0 2rem;
                flex-direction: row-reverse;
                justify-content: space-between;

                > p {
                  margin-top: 1rem;
                }

                + p {
                  text-align: center;
                }

                @media (min-width: ${BREAKPOINT_MEDIUM}px) {
                  display: flex;
                  > p {
                    margin-top: 0;
                  }
                }
              `}
            >
              <Button
                onClick={() => handleLovePress()}
                css={{
                  order: 2,
                  width: "150px",
                  height: "50px",
                  border: isLiked ? "1px solid #b43737" : "1px solid #666",
                }}
              >
                <>
                  <div css={heartStyle} />
                  <p>{isLiked ? "Unlove" : "Love This"}</p>
                </>
              </Button>
              <p
                css={{
                  marginTop: "0",
                  fontStyle: "italic",
                  color: "#666",
                  fontSize: "0.9rem",
                }}
              >
                Photo credit: {photoForModal.user.name}
              </p>
            </div>
            <p>{photoForModal.description}</p>
          </aside>
        </div>
      )}
    </Modal>
  );
};
