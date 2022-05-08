export const scrollSmoth = (dispaky) => {
  if (dispaky) {
    dispaky.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }
};
