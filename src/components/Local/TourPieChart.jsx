import React, { useState, useEffect } from 'react';
import { AgCharts } from 'ag-charts-react';

function TourPieChart({ tours }) {
  const [loading, setLoading] = useState(true);
  const [pieChartData, setPieChartData] = useState([]);

  const calculateData = async () => {
    return tours.map(tour => ({
      label: tour.tourName,
      value: tour.price,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await calculateData();
      setPieChartData(data);
      setLoading(false);
    };
    fetchData();
  }, [tours]);

  const options = {
    data: pieChartData,
    series: [{
      type: 'pie',
      angleKey: 'value',
      labelKey: 'label',
      calloutLabelKey: 'label',
      calloutLabel: { enabled: true },
      sectorLabelKey: 'value',
      sectorLabel: {
        enabled: true,
        formatter: ({ datum }) => `${datum.value} VNĐ`,
      },
    }],
    title: { text: 'Tổng doanh thu kiếm được từ tour' },
    legend: { enabled: true, position: 'bottom' },
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return <AgCharts options={options} />;
}

export default TourPieChart;
