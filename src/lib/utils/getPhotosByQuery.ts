import { PhotoType, unsplash } from "@lib";
import { PHOTOS_PER_PAGE } from "@/lib/constants";
import { Errors } from "unsplash-js/dist/helpers/errors";

export type PhotosByQueryResultsType = {
  photos: PhotoType[];
  total: number;
  error?: Errors;
  isLikedPhotos?: boolean;
};

type GetPhotosByQueryType = {
  query?: string;
  page?: number;
  perPage?: number;
  random?: boolean;
  total?: number;
  single?: boolean;
};

export const getPhotosByQuery = async ({
  query = "",
  page = 1,
  perPage = PHOTOS_PER_PAGE,
  random,
  single,
}: GetPhotosByQueryType) => {
  try {
    const photos = random
      ? await unsplash.photos.getRandom({
          count: single ? perPage : page * perPage,
        })
      : await unsplash.search.getPhotos({
          page: page,
          perPage: single ? perPage : page * perPage,
          query,
        });

    if (photos?.response) {
      return {
        // @ts-ignore
        photos: random ? photos.response : photos.response.results,
        // @ts-ignore
        total: random ? perPage * 10 : photos.response.total,
      };
    } else if (photos?.errors) {
      console.log(
        "Unsplash server reached, but errors occcured:",
        photos.errors
      );
      return {
        photos: [],
        error: photos.errors,
      };
    }
  } catch (e) {
    // In a more production ready app, we'd be handling these errors better
    // likely with some reporting and some sort of notification popup to the user
    console.log("Error attempting to fetch photos from unsplash:", e);
  }
};
