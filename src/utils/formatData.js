// ...existing code...

/**
 * Định dạng lại ngày chỉ hiển thị ra Ngày và tháng
 * @param {Date} date - Ngày cần định dạng
 * @returns {string} - Chuỗi định dạng ngày và tháng
 */
function formatDate_Day_Month(date) {
    return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}


/**
 * Định dạng ngày theo định dạng Việt Nam (dd/MM)
 * @param {string} date - Chuỗi ngày cần định dạng
 * @returns {string} - Chuỗi định dạng ngày và tháng theo định dạng Việt Nam
 */
const formatDateToVietnamese = (date) => {
    const parsedDate = new Date(date); // Chuyển chuỗi date về dạng Date object
    const day = String(parsedDate.getUTCDate()).padStart(2, '0'); // Lấy ngày theo UTC
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0'); // Lấy tháng theo UTC (cộng thêm 1)
    return `${day}/${month}`;
};


export { formatDate_Day_Month, formatDateToVietnamese };
