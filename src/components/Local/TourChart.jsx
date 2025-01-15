import { Bar } from 'react-chartjs-2';

const TourChart = ({ monthlyRevenues }) => {
  const data = {
    labels: monthlyRevenues.map(monthData => `Tháng ${monthData.month}`),
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: monthlyRevenues.map(monthData => monthData.revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <div  style={{
    border: '1px solid #ccc',
    flex: 1,
    borderRadius: '10px',
    padding: '10px',
    height: '500px',
  }}><Bar data={data} options={options} /></div>;
};

export default TourChart;
