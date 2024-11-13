import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button } from 'react-bootstrap';

function AdminReport() {
  const [rowData, setRowData] = useState([]);

  // Giả sử dữ liệu JSON có dạng như sau:
   const data = [
     { id: 1, name: 'Nguyễn Văn A', address: 'Hà Nội', type: 'Spam', reportDate: '2024-11-01', status: 'Pending' },
     { id: 2, name: 'Trần Thị B', address: 'Hồ Chí Minh', type: 'Abuse', reportDate: '2024-11-02', status: 'Resolved' }
   ];

  useEffect(() => {
    setRowData(data)
  }, []);

  const columnDefs = [
    { headerName: 'Người dùng', field: 'name', sortable: true, filter: true },
    { headerName: 'Địa chỉ', field: 'address', sortable: true, filter: true },
    { headerName: 'Loại', field: 'type', sortable: true, filter: true },
    { headerName: 'Ngày tố cáo', field: 'reportDate', sortable: true, filter: true },
    { headerName: 'Trạng thái', field: 'status', sortable: true, filter: true },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: (params) => (
        <div>
          <Button variant='' onClick={() => handleBan(params.data)}><ion-icon name="ban-outline"></ion-icon></Button>
          <Button variant='' onClick={() => handleDelete(params.data)}><ion-icon name="trash-outline"></ion-icon></Button>
          <Button variant= '' onClick={() => handleEdit(params.data)}><ion-icon name="settings-outline"></ion-icon></Button>
        </div>
      ),
    }
  ];

  const handleBan = (data) => {
    console.log('Ban user:', data);
    // Thực hiện hành động "Ban" tại đây
  };

  const handleDelete = (data) => {
    console.log('Delete report:', data);
    // Thực hiện hành động "Delete" tại đây
  };

  const handleEdit = (data) => {
    console.log('Edit report:', data);
    // Thực hiện hành động "Edit" tại đây
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <div className='row'>
           {/* Earnings (Monthly) Card Example */}
           <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-uppercase mb-1">Earnings (Monthly)</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                                                <div className="mt-2 mb-0 text-muted text-xs">
                                                    <span className="text-success mr-2"><i className="fa fa-arrow-up" /> 3.48%</span>
                                                    <span>Since last month</span>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-calendar fa-2x text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Earnings (Annual) Card Example */}
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-uppercase mb-1">Sales</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">650</div>
                                                <div className="mt-2 mb-0 text-muted text-xs">
                                                    <span className="text-success mr-2"><i className="fas fa-arrow-up" /> 12%</span>
                                                    <span>Since last years</span>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-shopping-cart fa-2x text-success" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* New User Card Example */}
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-uppercase mb-1">New User</div>
                                                <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">366</div>
                                                <div className="mt-2 mb-0 text-muted text-xs">
                                                    <span className="text-success mr-2"><i className="fas fa-arrow-up" /> 20.4%</span>
                                                    <span>Since last month</span>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-users fa-2x text-info" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-uppercase mb-1">Pending Requests</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">18</div>
                                                <div className="mt-2 mb-0 text-muted text-xs">
                                                    <span className="text-danger mr-2"><i className="fas fa-arrow-down" /> 1.10%</span>
                                                    <span>Since yesterday</span>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-comments fa-2x text-warning" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
      </div>
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

export default AdminReport;
