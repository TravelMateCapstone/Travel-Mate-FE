import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSelector } from 'react-redux';
import MonthlySpendingChart from '../../components/Local/MonthlySpendingChart';

function WalletManagement() {
  const [rowData, setRowData] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const user = useSelector(state => state.auth.user);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`https://travelmateapp.azurewebsites.net/api/Transaction/traveler/${user.id}`);
        const data = await response.json();
        const transactions = data.$values.map(transaction => ({
          name: transaction.travelerName,
          tourName: transaction.tourName,
          localName: transaction.localName,
          date: new Date(transaction.transactionTime).toLocaleDateString('vi-VN'),
          amount: transaction.price,
          transactionTime: transaction.transactionTime // Add this line
        }));
        setRowData(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, []);

  const columnDefs = [
    { headerName: 'Khách Du Lịch', field: 'name', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Tên Tour', field: 'tourName', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Tên Địa Phương', field: 'localName', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Thời Gian Giao Dịch', field: 'date', filter: 'agDateColumnFilter', sortable: true },
    { 
      headerName: 'Số Tiền (VND)', 
      field: 'amount', 
      filter: 'agNumberColumnFilter', 
      sortable: true, 
      valueFormatter: (params) => `${params.value.toLocaleString('vi-VN')} VND` 
    },
  ];

  const defaultColDef = {
    flex: 1,
    filter: true,
    resizable: true,
  };
  console.log(rowData);
  

  return (
    <div>
      <div>
      <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
        {[2021, 2022, 2023, 2024, 2025].map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <MonthlySpendingChart transactions={rowData} selectedYear={selectedYear} />
        <input
          type="text"
          className='form-control'
          placeholder="Tìm kiếm nhanh..."
          onChange={(e) => setQuickFilterText(e.target.value)}
          style={{ marginBottom: '10px', padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={5}
            quickFilterText={quickFilterText}
            domLayout="autoHeight"
            animateRows={true}
          />
        </div>
      </div>
    </div>
  );
}

export default WalletManagement;
