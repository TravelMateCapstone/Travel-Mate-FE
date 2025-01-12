import axios from 'axios';
import store from '../redux/store'
import { toast } from 'react-toastify';

const url = import.meta.env.VITE_BASE_API_URL

const fetchTours = async () => {
    const token = store.getState().auth.token;
    try {
        const response = await axios.get(`${url}/api/tours`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Danh sách tour:", response.data);
        return response.data
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tour:", error);
    }
}

const fetchTourByStatus = async (approvalStatus) => {
    const token = store.getState().auth.token;
    try {
        const response = await axios.get(`${url}/api/Tour/toursStatus/${approvalStatus}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Danh sách tour theo trạng thái:", response.data);
        return response.data.$values
    } catch (error) {
        console.error("Lỗi khi lấy danh sách tour theo trạng thái:", error);
    }
}

const getTourById = async (id) => {
    const token = store.getState().auth.token;
    try {
        const response = await axios.get(`${url}/api/Tour/${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Thông tin tour:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin tour:", error);
    }
}

const createTour = async (tour) => {
    const token = store.getState().auth.token;
    console.log("tour data", tour);
    
    try {
        await axios.post(`${url}/api/Tour`, tour, {
            headers: {
                Authorization: `${token}`,
            },
        });
        toast.success("Tạo tour thành công");
    } catch (error) {
        toast.error("Tạo tour thất bại");
        console.error("Lỗi khi tạo tour:", error);
    }
}

const updateTour = async (tour, tourid) => {
    const token = store.getState().auth.token;
    try {
        console.log("tour data", tour);
        await axios.put(`${url}/api/Tour/${tourid}`, tour, {
            headers: {
                Authorization: `${token}`,
            },
        });
        
        toast.success("Cập nhật tour thành công");
    }
    catch (error) {
        toast.error("Cập nhật tour thất bại");
        console.log("tour data err", tour);
        
        console.error("Lỗi khi cập nhật tour:", error);
    }
}

const deleteTour = async (id) => {
    const token = store.getState().auth.token;
    try {
        await axios.delete(`${url}/api/Tour/${id}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        toast.success("Xóa tour thành công");
    } catch (error) {
        toast.error("Xóa tour thất bại");
        console.error("Lỗi khi xóa tour:", error);
    }
}

const fetchTourParticipants = async (tourId) => {
    const token = store.getState().auth.token;
    try {
        const response = await axios.get(`${url}/api/Tour/tourParticipants/${tourId}`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Danh sách participant:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách participant:", error);
    }
}

export { fetchTours, fetchTourByStatus, createTour, updateTour, deleteTour, getTourById, fetchTourParticipants };