import api from "./api";

export const loginUser = async (email, password) => {
  const res = await api.post("/login", { email, password });
  return res.data; // { user, token }
};

export const signupUser = async (formData) => {
  const res = await api.post("/signup", formData);
  return res.data; // { user, token }
};
