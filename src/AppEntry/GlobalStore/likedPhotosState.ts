import { atomFamily, SerializableParam } from "recoil";
import likedPhotosByUserId from "../../../likedPhotosByUserId.json";
import fs from "vite-plugin-fs/browser";
import currentDb from "../../../likedPhotosByUserId.json";

// @ts-ignore
const getDataByUser = (id: SerializableParam) => likedPhotosByUserId[id];

export const likedPhotosState = atomFamily({
  key: "likedPhotosState",
  default: (id) => getDataByUser(id),
  effects: [
    ({ onSet }) => {
      onSet(async (newVal) => {
        await fs.writeFile(
          "../../likedPhotosByUserId.json",
          JSON.stringify({
            ...currentDb,
            [newVal.userId]: {
              userId: newVal.userId,
              username: newVal.username,
              ids: newVal.ids,
              photos: newVal.photos,
            },
          })
        );
      });
    },
  ],
});
