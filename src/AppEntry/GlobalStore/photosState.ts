import { atom } from "recoil";

export const photosState = atom({
  key: "photosState",
  default: {
    photos: [],
    total: 0,
  },
});
