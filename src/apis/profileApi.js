import axios from 'axios';
import store from '../redux/store'

const url = import.meta.env.VITE_BASE_API_URL

export const checkProfileCCCD_Signature = async () => {
    const token = store.getState().auth.token;
    try{
        const response = await axios.get(`${url}/api/CCCD/verify-cccd-signature`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Kiểm tra hoàn thành hồ sơ:", response.data.value);
        return response.data.value
    } catch (error) {
        console.error("Lỗi khi kiểm tra hoàn thành hồ sơ:", error);
    }
}


export const checkProfileCompletion = async () => {
    const token = store.getState().auth.token;
    try{
        const response = await axios.get(`${url}/api/Profile/checkCompleteCurrent`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Kiểm tra hoàn thành hồ sơ 2:", response.data.value);
        return response.data.value
        
    } catch (error) {
        console.error("Lỗi khi kiểm tra hoàn thành hồ sơ:", error);
    }
}

export const checkProfileCompletionAzure = async () => {
    const token = store.getState().auth.token;
    try{
        const response = await axios.get('https://travelmateapp.azurewebsites.net/api/Profile/checkCompleteCurrent', {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Kiểm tra hoàn thành hồ sơ Azure:", response.data.value);
        return response.data.value
    } catch (error) {
        console.error("Lỗi khi kiểm tra hoàn thành hồ sơ Azure:", error);
    }
}

export const getUserLocation = async () => {
    const token = store.getState().auth.token;
    try{
        const response = await axios.get(`${url}/api/UserLocationsWOO/get-current-user`, {
            headers: {
                Authorization: `${token}`,
            },
        });
        console.log("Lấy thông tin địa chỉ:", response.data);
        return response.data
    } catch (error) {
        console.error("Lỗi khi lấy thông tin địa chỉ:", error);
    }
}