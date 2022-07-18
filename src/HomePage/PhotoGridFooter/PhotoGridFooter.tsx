import { css } from "@emotion/react";
import { Loader } from "@lib";
import * as React from "react";
import { Button } from "@/lib/shared/Button";

type PhotoGridFooterType = {
  showOutOfPhotos: boolean;
  showLoader: boolean;
  handleFetchPhotos: (single: boolean) => void;
};

export const PhotoGridFooter = ({
  showOutOfPhotos,
  showLoader,
  handleFetchPhotos,
}: PhotoGridFooterType) => {
  return (
    <>
      {showLoader && (
        <div
          css={{
            width: "100%",
            textAlign: "center",
            margin: "2rem 0 5rem",
          }}
        >
          <Loader />
        </div>
      )}
      <footer
        css={{
          marginBottom: "5rem",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {showOutOfPhotos ? (
          <Button
            disabled
            css={css`
              width: 250px;
              height: auto;
              padding: 1.5rem;
              font-size: 1.5rem;
            `}
          >
            OUT OF PHOTOS
          </Button>
        ) : (
          <Button
            onClick={() => handleFetchPhotos(true)}
            css={css`
              width: 200px;
              height: auto;
              padding: 1rem;
              font-size: 1.5rem;

              &:hover {
                color: #b43737;
              }
            `}
          >
            GRAB MORE
          </Button>
        )}
      </footer>
    </>
  );
};
