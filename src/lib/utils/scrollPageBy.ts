export const scrollPageBy = (amount: number = 100): void => {
  return window.scrollTo({
    top: window.pageYOffset + amount,
    behavior: "smooth",
  });
};
