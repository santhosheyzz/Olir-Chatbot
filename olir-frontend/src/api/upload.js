import axios from "axios";

const BASE_URL = "http://localhost:8000"; // Change to your backend URL in production

export const uploadDocument = async (data) => {
  if (data.youtube_url) {
    // Send JSON to /upload-youtube
    const res = await axios.post(
      `${BASE_URL}/upload-youtube`,
      { youtube_url: data.youtube_url },
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } else {
    // File upload as before
    const formData = new FormData();
    formData.append('file', data);
    const res = await axios.post(`${BASE_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }
};
