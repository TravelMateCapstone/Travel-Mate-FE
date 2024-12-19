import React, { useEffect, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import { fetchTourData } from '../../utils/UserDashBoard/statistical';

function TourChart({ tours, token }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tourAmounts = await fetchTourData(tours, token);
      setChartData(tourAmounts);
      setLoading(false);
    };

    if (tours.length > 0) {
      fetchData();
    }
  }, [tours, token]);

  const options = {
    data: chartData,
    series: [
      {
        type: 'bar',
        xKey: 'tourName',
        yKey: 'amount',
        yName: 'Dự tính',
      },
      {
        type: 'line',
        xKey: 'tourName',
        yKey: 'totalPaid',
        yName: 'Thực tế',
      },
    ],
    title: { text: 'Doanh thu mỗi tour du lịch' },
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return <AgCharts options={options}/>;
}

export default TourChart;
