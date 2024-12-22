import React, { useEffect, useState, useMemo } from 'react';
import { AgCharts } from 'ag-charts-react';

function MonthlySpendingChart({ transactions, selectedYear }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const calculateData = useMemo(() => {
    const filteredTransactions = transactions.filter(transaction =>
      new Date(transaction.transactionTime).getFullYear() === selectedYear
    );

    const monthlySpending = filteredTransactions.reduce((acc, transaction) => {
      const month = new Date(transaction.transactionTime).getMonth() + 1;
      acc[month] = (acc[month] || 0) + transaction.amount; 
      return acc;
    }, {});

    for (let i = 1; i <= 12; i++) {
      if (!monthlySpending[i]) {
        monthlySpending[i] = 0;
      }
    }

    return Object.keys(monthlySpending).map(month => ({
      month: `Tháng ${month}`,
      spending: monthlySpending[month],
    }));
  }, [transactions, selectedYear]);

  useEffect(() => {
    setChartData(calculateData);
    setLoading(false);
  }, [calculateData]);

  const options = {
    data: chartData,
    series: [{
      type: 'bar',
      xKey: 'month',
      yKey: 'spending',
      yName: 'Spending',
    }],
    title: { text: 'Tổng chi hàng háng' },
  };

  if (loading) {
    return <div>Đang tải</div>;
  }

  return <AgCharts options={options} />;
}

export default MonthlySpendingChart;
