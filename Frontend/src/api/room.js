import axios from "axios";

export const createRoom = async (roomData, token) => {
  const res = await axios.post(
    "https://realtime-draw-koya.onrender.com/api/drawroom/create",
    roomData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  // console.log("API RESPONSE:", res.data);
  return res.data;
};

export const getMyRooms = async (token) => {
  const res = await axios.get("https://realtime-draw-koya.onrender.com/api/drawroom/myrooms", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getRoomById = async (roomId, token) => {
  const res = await axios.get(`https://realtime-draw-koya.onrender.com/api/drawroom/${roomId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const deleteRoom = async (roomId, token) => {
  return axios.delete(
    `https://realtime-draw-koya.onrender.com/api/drawroom/${roomId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

