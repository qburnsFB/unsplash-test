export const getFromUrl = () => {
  if (typeof window === "undefined") {
    return 1;
  }
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const page = urlParams.get("page") || "1";
  const term = urlParams.get("term");
  return { urlPage: parseInt(page), urlTerm: term };
};
