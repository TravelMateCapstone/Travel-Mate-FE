import axios from "axios";

const checkProfileCompletion = async (url, token) => {
    try {
        const response = await axios.get(`${url}/api/Profile/checkCompleteCurrent`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Kiểm tra hoàn thành hồ sơ:", response);
        
        return response.data.value;
    } catch (error) {
        console.error("Lỗi khi kiểm tra hoàn thành hồ sơ:", error);
        throw error;
    }
};

export default checkProfileCompletion;
