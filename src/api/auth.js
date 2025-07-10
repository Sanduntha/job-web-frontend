import axiosInstance from "./axiosInstance";

export const loginUser = (data) => axiosInstance.post("/users/login", data);
export const registerUser = (data) => axiosInstance.post("/users/register", data);
