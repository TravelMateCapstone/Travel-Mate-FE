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
// ...existing code...

export { formatDate_Day_Month };
