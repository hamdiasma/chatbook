export const editDataSimple = (data, id, post) => {
  const newData = data.map((item) => (item._id === id ? post : item));
  return newData;
};

export const deleteDataSimple = (data, id, post) => {
  const newData = data.filter((item) => item._id !== id);
  return newData;
};
