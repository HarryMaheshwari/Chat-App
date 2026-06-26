// import axios from "axios"


// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true
// });


import axios from "axios";

const getBaseURL = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8080";
  } else {
      return "http://10.199.144.176:8080"; // Replace with your LAN IP
  }
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});
