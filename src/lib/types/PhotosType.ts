export type UrlsType = {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
  small_s3: string;
};

export type LinksType = {
  self: string;
  html: string;
  download: string;
  download_location: string;
};

export type PhotoType = {
  id: string;
  user: {
    username: string;
    name: string;
  };
  created_at: Date;
  updated_at: Date;
  promoted_at?: any;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description?: any;
  alt_description?: any;
  likes: number;
  urls: UrlsType;
  links: LinksType;
};
