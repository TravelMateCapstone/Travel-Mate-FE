import React, { useEffect, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import axios from 'axios';

function TourChart({ tours, token }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTourData = async () => {
      const tourAmounts = await Promise.all(tours.map(async (tour) => {
        const participantsResponse = await axios.get(`https://travelmateapp.azurewebsites.net/api/Tour/tourParticipants/${tour.tourId}`, {
          headers: { Authorization: `${token}` }
        });

        const totalPaid = participantsResponse.data.$values.reduce((acc, participant) => {
          return acc + (participant.totalAmount || 0);
        }, 0);

        return {
          tourName: tour.tourName,
          amount: tour.price * tour.maxGuests,
          totalPaid,
        };
      }));

      setChartData(tourAmounts);
      setLoading(false);
    };

    if (tours.length > 0) {
      fetchTourData();
    }
  }, [tours, token]);

  const options = {
    data: chartData,
    series: [
      {
        type: 'bar',
        xKey: 'tourName',
        yKey: 'amount',
        yName: 'Amount',
      },
      {
        type: 'line',
        xKey: 'tourName',
        yKey: 'totalPaid',
        yName: 'Total Paid',
      },
    ],
    title: { text: 'Doanh thu mỗi tour du lịch' },
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return <AgCharts options={options} />;
}

export default TourChart;
