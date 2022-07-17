import { useState } from "react";
export const useModal = () => {
  // set visible to a photo id
  const [visible, setVisible] = useState("FBDtFnQZSNM");
  const handleToggleModal = (id: string) => setVisible(visible ? "" : id);
  return {
    visible,
    handleToggleModal,
  };
};
