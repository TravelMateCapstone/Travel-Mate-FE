import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Button, Modal } from 'react-bootstrap';

function Transaction() {
  const [rowData, setRowData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const data = [
    { id: 1, sender: 'Nguyễn Văn A', receiver: 'Trần Thị B', status: 'Completed', transactionDate: '2024-11-01 14:00', amount: '1,000,000 VND' },
    { id: 2, sender: 'Lê Văn C', receiver: 'Phạm Thị D', status: 'Pending', transactionDate: '2024-11-02 10:30', amount: '2,500,000 VND' }
  ];

  useEffect(() => {
    setRowData(data);
  }, []);

  const columnDefs = [
    { headerName: 'Người gửi', field: 'sender', sortable: true, filter: true },
    { headerName: 'Người nhận', field: 'receiver', sortable: true, filter: true },
    { headerName: 'Tình trạng', field: 'status', sortable: true, filter: true },
    { headerName: 'Thời gian giao dịch', field: 'transactionDate', sortable: true, filter: true },
    { headerName: 'Số tiền', field: 'amount', sortable: true, filter: true },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: (params) => (
        <Button variant="" onClick={() => handleView(params.data)}>
          <ion-icon name="eye-outline"></ion-icon> 
        </Button>
      ),
    }
  ];

  const handleView = (data) => {
    setSelectedTransaction(data);
    setShowModal(true);
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết giao dịch</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction ? (
            <div>
              <p><strong>Người gửi:</strong> {selectedTransaction.sender}</p>
              <p><strong>Người nhận:</strong> {selectedTransaction.receiver}</p>
              <p><strong>Tình trạng:</strong> {selectedTransaction.status}</p>
              <p><strong>Thời gian giao dịch:</strong> {selectedTransaction.transactionDate}</p>
              <p><strong>Số tiền:</strong> {selectedTransaction.amount}</p>
            </div>
          ) : (
            <p>Không có dữ liệu giao dịch</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Transaction;
