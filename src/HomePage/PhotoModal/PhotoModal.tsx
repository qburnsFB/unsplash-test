import { PhotoType, useKeyPress, UserType } from "@lib";
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
import Modal from "react-modal";
import { useEffect } from "react";

type PhotoModalType = {
  handleClose: () => void;
  photo: PhotoType;
};

export const PhotoModal = ({ photo, handleClose, isLiked, handleLovePress }: PhotoModalType) => {
  const escapePressed: boolean = useKeyPress("Escape");

  useEffect(() => {
    if (escapePressed) {
      handleClose();
    }
  }, [escapePressed]);

  return (
    <Modal className="modalContent" overlayClassName="modalOverlay" isOpen={false} onRequestClose={handleClose}>
      <main>
        <img src={photo.urls.thumb} />
      </main>
      <aside>
        <p>{photo.description}</p>
        <button onClick={() => handleLovePress(photo.id)}>{isLiked ? "Unlove" : "Love This"}</button>
      </aside>
    </Modal>
  );
};
