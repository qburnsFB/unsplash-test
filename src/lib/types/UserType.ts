import { PhotoType } from "@/lib";

export type UserType = {
  id: number;
  fullName: string;
  username: string;
  profile_image: string;
  likedPhotos: any[];
};
