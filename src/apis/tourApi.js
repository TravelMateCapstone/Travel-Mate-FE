import axios from 'axios';
import store from '../redux/store';

const token = store.getState().auth.token; // Lấy token từ Redux store
const url = import.meta.env.VITE_BASE_API_URL; // Đọc base URL từ biến môi trường

const fetchParticipants = async (scheduleId, tourId) => {
    const body ={
        scheduleId,
        tourId
    }
    console.log('body', body);
    
    try {
        const response = await axios.post(`${url}/api/TourParticipant/tourParticipants`, body, {
            headers: {
                Authorization: `${token}`, // Thêm token để xác thực
            },
            
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching participants:', error);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
};

const changeTourStatus = async (scheduleId, tourId, isActive) => {
    const body = {
        scheduleId,
        tourId
    };
    try {
        const response = await axios.post(`${url}/api/TourParticipant/changeTourStatus?isActive=${isActive}`, body, {
            headers: {
                Authorization: `${token}`, // Thêm token để xác thực
            },
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error changing tour status:', error);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
};

const fetchTourData = async (tourId) => {
    try {
        const response = await axios.get(`${url}/api/Tour/${tourId}`, {
            headers: {
                Authorization: `${token}`, // Thêm token để xác thực
            },
        });
        return response.data; // Trả về dữ liệu từ API
    } catch (error) {
        console.error('Error fetching tour data:', error);
        throw error; // Ném lỗi để xử lý bên ngoài nếu cần
    }
};

export {
    fetchParticipants,
    changeTourStatus,
    fetchTourData
};
