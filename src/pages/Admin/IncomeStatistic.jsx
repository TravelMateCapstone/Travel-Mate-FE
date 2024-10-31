import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import '../../assets/css/Admin/IncomeStatistic.css';

// Register components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard = () => {
    // Data for the chart
    const chartData = {
        labels: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
        datasets: [
            {
                label: 'Tổng quan doanh thu',
                data: [20, 30, 40, 25, 50, 60, 55, 70, 65, 75, 55, 80],
                borderColor: 'rgba(75,192,192,1)',
                fill: false,
                tension: 0.3,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value + 'tr';
                    },
                },
            },
        },
    };
    return (
        <div className="admin-dashboard">
            <h1 className='dashboard-title'>Doanh thu</h1>
            <div className="dashboard-overview">
                <div className="overview-card">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h3 className='overview-card-title'>Tổng doanh thu</h3>
                        <i className='bi bi-currency-dollar fs-3'></i>
                    </div>
                    <p className="value">105.000.000 ₫</p>
                    <p className="comparison">+20.1% so với tháng trước</p>
                </div>
                <div className="overview-card">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h3 className='overview-card-title'>Giao dịch</h3>
                        <i className='bi bi-people-fill fs-3'></i>
                    </div>
                    <p className="value">50.000.000 ₫</p>
                    <p className="comparison">+10% so với tháng trước</p>
                </div>
                <div className="overview-card">
                    <div className='d-flex justify-content-between align-items-center'>
                        <h3 className='overview-card-title'>Thành viên cao cấp</h3>
                        <i className='bi bi-patch-check fs-3'></i>
                    </div>
                    <p className="value">50.000.000 ₫</p>
                    <p className="comparison">+5.2% so với tháng trước</p>
                </div>
            </div>

            <div className="dashboard-chart">
                <h3>Tổng quan doanh thu</h3>
                <Line data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default AdminDashboard;
