import axios from "axios";

export const getData = async (url, token) => {
  const res = await axios.get(`/api/${url}`, {
    headers: { Authorization: token },
  });
  return res;
};

export const postData = async (url, body, token) => {
  const res = await axios.post(`/api/${url}`, body, {
    headers: { Authorization: token },
  });
  return res;
};

export const putData = async (url, body, token) => {
  const res = await axios.put(`/api/${url}`, body, {
    headers: { Authorization: token },
  });
  return res;
};

export const patchData = async (url, body, token) => {
  const res = await axios.patch(`/api/${url}`, body, {
    headers: { Authorization: token },
  });
  return res;
};

export const deleteData = async (url, token) => {
  const res = await axios.delete(`/api/${url}`, {
    headers: { Authorization: token },
  });
  return res;
};
