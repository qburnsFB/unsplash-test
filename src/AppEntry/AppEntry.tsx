import { globalStyles } from "@lib";
import { HomePage } from "@/HomePage/HomePage";
import { Global } from "@emotion/react";
import { RecoilRoot } from "recoil";

export const AppEntry = () => {
  // Likely would implement some sort of user switcher/login here and swap out the homepage component
  // with that while the user is logging in.
  return (
    <>
      <Global styles={globalStyles} />
      <RecoilRoot>
        <div id="AppEntry">
          <HomePage />
        </div>
      </RecoilRoot>
    </>
  );
};
