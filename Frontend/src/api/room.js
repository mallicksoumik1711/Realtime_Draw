import axios from "axios";

export const createRoom = async (roomData, token) => {
  const res = await axios.post(
    "http://localhost:5000/api/drawroom/create",
    roomData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log("API RESPONSE:", res.data);
  return res.data;
};
