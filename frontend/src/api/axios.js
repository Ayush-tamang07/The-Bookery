import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://nwvcgf67-5175.inc1.devtunnels.ms/api",
});

export default apiClient;


