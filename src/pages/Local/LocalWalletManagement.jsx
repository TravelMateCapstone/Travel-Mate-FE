import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function WalletManagement() {
  const [rowData, setRowData] = useState([
    { name: 'Tesco Market', status: 'Success', date: '13 Dec 2020', amount: 75.67 },
    { name: 'ElectroMen Market', status: 'Pending', date: '14 Dec 2020', amount: 250.0 },
    { name: 'Fiorgio Restaurant', status: 'Fail', date: '07 Dec 2020', amount: 19.5 },
    { name: 'John Mathew Kayne', status: 'Success', date: '06 Dec 2020', amount: 350.0 },
    { name: 'Ann Marlin', status: 'Success', date: '31 Nov 2020', amount: 430.0 },
  ]);

  const [quickFilterText, setQuickFilterText] = useState('');

  const columnDefs = [
    { headerName: 'Khách Du Lịch', field: 'name', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Trạng Thái', field: 'status', filter: 'agSetColumnFilter', sortable: true },
    { headerName: 'Thời Gian Giao Dịch', field: 'date', filter: 'agDateColumnFilter', sortable: true },
    { 
      headerName: 'Số Tiền', 
      field: 'amount', 
      filter: 'agNumberColumnFilter', 
      sortable: true, 
      valueFormatter: (params) => `$${params.value.toFixed(2)}` 
    },
  ];

  const defaultColDef = {
    flex: 1,
    filter: true,
    resizable: true,
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div style={{ display: 'flex', flexDirection: 'column',marginBottom: '20px',shadow : '0 0 10px rgba(0,0,0,0.1)',padding: '20px',borderRadius: '5px',backgroundColor: '#34A853', width: 'fit-content' }}>
        <div>
          <h5 style={{ margin: 0, color: 'white' }}>Số dư của bạn</h5>
          <div className='d-flex align-items-end gap-2'><h3 style={{ color: 'white', margin: 0 }}>3,250,000</h3> <p style={{ color: 'green', margin: 0 }} className='m-0'>VNĐ</p></div>
        </div>
        <div>
          <button style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}>Nạp tiền</button>
          <button style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>Rút tiền</button>
        </div>
      </div>

      {/* Transaction History Table */}
      <div>
        <h3 style={{ marginBottom: '10px' }}>Lịch sử giao dịch</h3>
        <input
          type="text"
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
