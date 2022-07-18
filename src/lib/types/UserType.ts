import { PhotoType } from "@/lib";

export type likedPhotosType = {
  ids: string[];
  photos: keyedPhoto;
};

export type keyedPhoto = {
  [key: string]: PhotoType;
};

export type UserType = {
  id: number;
  fullName: string;
  username: string;
  profile_image: string;
};
