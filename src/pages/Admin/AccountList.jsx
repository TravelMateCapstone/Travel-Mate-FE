import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from 'react-bootstrap';

function AccountList() {
  const [rowData, setRowData] = useState([]);

  // Giả sử dữ liệu JSON có dạng như sau:
   const data = [
     { id: 1, name: 'Nguyễn Văn A', address: 'Hà Nội', phone: '0123456789', email: 'a@example.com' },
     { id: 2, name: 'Trần Thị B', address: 'Hồ Chí Minh', phone: '0987654321', email: 'b@example.com' }
   ];

  useEffect(() => {
    setRowData(data)
  }, []);

  const columnDefs = [
    { headerName: 'Người dùng', field: 'name', sortable: true, filter: true },
    { headerName: 'Địa chỉ', field: 'address', sortable: true, filter: true },
    { headerName: 'SĐT', field: 'phone', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: (params) => (
        <div className='d-flex align-items-center'>
          <Button variant='' onClick={() => handleBan(params.data)}><ion-icon name="ban-outline"></ion-icon></Button>
          <Button variant='' onClick={() => handleDelete(params.data)}><ion-icon name="trash-outline"></ion-icon></Button>
          <Button variant= '' onClick={() => handleSetting(params.data)}><ion-icon name="settings-outline"></ion-icon></Button>
        </div>
      ),
    }
  ];

  const handleBan = (data) => {
    console.log('Ban user:', data);
    // Thực hiện hành động "Ban" tại đây
  };

  const handleDelete = (data) => {
    console.log('Delete user:', data);
    // Thực hiện hành động "Delete" tại đây
  };

  const handleSetting = (data) => {
    console.log('Setting user:', data);
    // Thực hiện hành động "Setting" tại đây
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

export default AccountList;
