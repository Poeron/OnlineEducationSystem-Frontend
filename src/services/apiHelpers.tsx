import axios from "axios";

export const fetchUserCourses = async () => {
  try {
    const response = await axios.get("/api/user/courses");
    return response.data;
  } catch (error) {
    console.error("API isteği sırasında hata oluştu:", error);
    throw error;
  }
};
