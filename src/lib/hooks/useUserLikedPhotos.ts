import { useRecoilState } from "recoil";
import { likedPhotosState } from "@/AppEntry";

export const useUserLikedPhotos = (id: number) => {
  const [likedPhotos, setLikedPhotos] = useRecoilState(
    likedPhotosState(id.toString())
  );

  return [likedPhotos, setLikedPhotos];
};
