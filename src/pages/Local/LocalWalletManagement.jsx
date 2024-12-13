import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function WalletManagement() {
  const [rowData, setRowData] = useState([
    { name: 'Chợ Tesco', status: 'Thành công', date: '13 Tháng 12 2020', amount: 756700 },
    { name: 'Chợ ElectroMen', status: 'Đang chờ', date: '14 Tháng 12 2020', amount: 2500000 },
    { name: 'Nhà hàng Fiorgio', status: 'Thất bại', date: '07 Tháng 12 2020', amount: 195000 },
    { name: 'John Mathew Kayne', status: 'Thành công', date: '06 Tháng 12 2020', amount: 3500000 },
    { name: 'Ann Marlin', status: 'Thành công', date: '31 Tháng 11 2020', amount: 4300000 },
  ]);

  const [quickFilterText, setQuickFilterText] = useState('');

  const columnDefs = [
    { headerName: 'Khách Du Lịch', field: 'name', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Trạng Thái', field: 'status', filter: 'agSetColumnFilter', sortable: true },
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

  return (
    <div>
      <div>
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
