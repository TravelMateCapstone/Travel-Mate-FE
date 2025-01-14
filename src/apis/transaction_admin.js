import axios from 'axios';
import store from '../redux/store';

const token = store.getState().auth.token; // Lấy token từ Redux store
const url = import.meta.env.VITE_BASE_API_URL; // Đọc base URL từ biến môi trường

const fetchTransactionData = async () => {
    try {
        const response = await axios.get(`${url}/api/Transaction`, {
            headers: {
                Authorization: `${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        throw error;
    }
};

const confirmTransaction = async (transactionId) => {
    try {
        await axios.post('https://travelmateapp.azurewebsites.net/api/Transaction/completePayment', null, {
            params: {
                transactionId: transactionId
            },
            headers: {
                Authorization: `${token}`
            }
        });
    } catch (error) {
        console.error('Error confirming transaction:', error);
        throw error;
    }
};

const refundTransaction = async (transactionId) => {
    console.log('Refunding transaction:', transactionId);
    
    try {
        await axios.post('https://travelmateapp.azurewebsites.net/api/Transaction/completeRefund', null, {
            params: {
                transactionId: transactionId
            },
            headers: {
                Authorization: `${token}`
            }
        });
    } catch (error) {
        console.error('Error refunding transaction:', error);
        throw error;
    }
};

const fetchUserBankData = async (userId) => {
    try {
        const response = await axios.get(`https://travelmateapp.azurewebsites.net/api/UserBank/${userId}`, {
            headers: {
                Authorization: `${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user bank data:', error);
        throw error;
    }
};

export { fetchTransactionData, confirmTransaction, refundTransaction, fetchUserBankData };
