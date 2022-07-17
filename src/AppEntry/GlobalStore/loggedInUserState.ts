import { atom } from "recoil";
import { UserType } from "@lib";

const loggedInUser: UserType = {
  id: 1,
  fullName: "John Smith",
  username: "jsmith",
  profile_image:
    "https://s3.us-west-2.amazonaws.com/Photos.unsplash.com/small/photo-1657861970480-268922fa3732",
};

export const loggedInUserState = atom({
  key: "loggedInUserState",
  default: loggedInUser,
});
