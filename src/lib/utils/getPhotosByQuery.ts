import { unsplash } from "@lib";

type GetPhotosByQueryType = {
  query?: string;
  page?: number;
  perPage?: number;
  random?: boolean;
};

export const getPhotosByQuery = async ({ query = "", page = 1, perPage = 10, random }: GetPhotosByQueryType) => {
  try {
    const photos = random
      ? await unsplash.photos.getRandom({
          count: 10,
        })
      : await unsplash.search.getPhotos({
          page,
          perPage,
          query,
        });

    console.log(photos);
    if (photos?.response) {
      return {
        // @ts-ignore
        photos: random ? photos.response : photos.response.results,
      };
    } else if (photos?.errors) {
      console.log("Unsplash server reached, but errors occcured:", photos.errors);
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
