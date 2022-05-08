export const intersectionOnbs = (element, setPage) => {
  let observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        setPage((p) => p + 1);
      }
    },
    { threshold: 0.1 }
  );
  observer.observe(element);
};
