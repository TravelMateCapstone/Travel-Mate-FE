import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from 'react-bootstrap';

function TripHistory() {
  const [rowData, setRowData] = useState([]);

  // Giả sử dữ liệu JSON có dạng như sau:
  const data = [
    { id: 1, user: 'Nguyễn Văn A', destination: 'Đà Nẵng', phone: '0123456789', email: 'a@example.com' },
    { id: 2, user: 'Trần Thị B', destination: 'Nha Trang', phone: '0987654321', email: 'b@example.com' }
  ];

  useEffect(() => {
    setRowData(data);
  }, []);

  const columnDefs = [
    { headerName: 'Người dùng', field: 'user', sortable: true, filter: true },
    { headerName: 'Nơi đến', field: 'destination', sortable: true, filter: true },
    { headerName: 'SĐT', field: 'phone', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    {
      headerName: 'Action',
      field: 'action',
      cellRendererFramework: (params) => (
        <Button variant="primary" onClick={() => handleView(params.data)}>
          Xem
        </Button>
      ),
    }
  ];

  const handleView = (data) => {
    console.log('View trip:', data);
    // Thực hiện hành động "Xem", ví dụ: mở modal hoặc điều hướng tới trang chi tiết
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1, minWidth: 100, resizable: true }}
        pagination={true}
        paginationPageSize={10}
      />
    </div>
  );
}

export default TripHistory;
