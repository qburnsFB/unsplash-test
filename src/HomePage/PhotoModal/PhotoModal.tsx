import { keyedPhoto, PhotoType, useKeyPress, useUserLikedPhotos } from "@lib";
import Modal from "react-modal";
import { useEffect } from "react";
import { loggedInUserState } from "@/AppEntry/GlobalStore/loggedInUserState";
import { useRecoilValue } from "recoil";
import * as React from "react";

type PhotoModalType = {
  photoForModal: PhotoType;
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

  const isLiked = likedPhotos?.ids.find((a: string) => a === photoForModal.id);
  const handleLovePress = async () => {
    let newPhotos: keyedPhoto = Object.assign({}, likedPhotos.photos);
    let newIds: string[];

    // is currently loved, need to unlove
    if (isLiked) {
      newIds = likedPhotos.ids.filter((id: string) => id !== photoForModal.id);
      delete newPhotos[photoForModal.id];
    } else {
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

  return (
    <Modal
      className="modalContent"
      overlayClassName="modalOverlay"
      isOpen={isOpen}
      onRequestClose={() => handleClose}
      appElement={document.getElementById("root") || undefined}
    >
      {photoForModal && (
        <div>
          <main>
            <img
              alt={photoForModal.description}
              src={photoForModal.urls.thumb}
            />
          </main>
          <aside>
            <p>{photoForModal?.description}</p>
            <button onClick={() => handleLovePress()}>
              {isLiked ? "Unlove" : "Love This"}
            </button>
          </aside>
        </div>
      )}
    </Modal>
  );
};
