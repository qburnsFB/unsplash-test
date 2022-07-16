import { useState } from "react";
export const useModal = () => {
  const [visible, setVisible] = useState(false);
  const handleToggleModal = () => setVisible(!visible);
  return {
    visible,
    handleToggleModal,
  };
};
