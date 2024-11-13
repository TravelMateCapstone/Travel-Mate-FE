import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Modal, Form, Image } from "react-bootstrap";
import ConfirmModal from "../../components/Shared/ConfirmModal";

// Register the modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  SetFilterModule,
]);

const Transaction = () => {
  const gridRef = useRef();

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState([
    {
      id: 1,
      sender: { name: "John Doe", avatar: "path/to/avatar1.jpg" },
      receiver: { name: "Jane Smith", avatar: "path/to/avatar2.jpg" },
      status: "Completed",
      transactionTime: "2023-10-12 14:30",
      amount: "$1000",
    },
    {
      id: 2,
      sender: { name: "Alice Johnson", avatar: "path/to/avatar3.jpg" },
      receiver: { name: "Robert Brown", avatar: "path/to/avatar4.jpg" },
      status: "Pending",
      transactionTime: "2023-10-13 11:00",
      amount: "$500",
    },
    // Thêm các giao dịch khác nếu cần
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editedRow, setEditedRow] = useState(null);
  const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
  const [updateRow, setUpdateRow] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const columnDefs = [
    {
      headerName: "Người gửi",
      field: "sender",
      cellRenderer: (params) => (
        <div className="d-flex align-items-center">
          <Image src={params.value.avatar} roundedCircle width="30" height="30" className="me-2" />
          {params.value.name}
        </div>
      ),
      editable: false,
    },
    {
      headerName: "Người nhận",
      field: "receiver",
      cellRenderer: (params) => (
        <div className="d-flex align-items-center">
          <Image src={params.value.avatar} roundedCircle width="30" height="30" className="me-2" />
          {params.value.name}
        </div>
      ),
      editable: false,
    },
    { headerName: "Tình trạng", field: "status", editable: true },
    { headerName: "Thời gian giao dịch", field: "transactionTime", editable: true },
    { headerName: "Số tiền", field: "amount", editable: true },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div>
          <Button variant="info" size="sm" onClick={() => handleView(params.data)}>
            View
          </Button>{" "}
          <Button variant="warning" size="sm" onClick={() => handleUpdate(params.data)}>
            Update
          </Button>{" "}
          <Button variant="danger" size="sm" onClick={() => handleDelete(params.data)}>
            Delete
          </Button>
        </div>
      ),
      editable: false,
      filter: false,
      sortable: false,
      width: 200,
    },
  ];

  const resetFilters = useCallback(() => {
    gridRef.current.api.setFilterModel(null);
  }, []);

  const onExportClick = () => {
    gridRef.current.api.exportDataAsCsv();
  };

  const handleView = (row) => {
    console.log("Viewing row:", row);
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setRowData((prevData) => prevData.filter((item) => item.id !== rowToDelete.id));
    console.log("Deleted row:", rowToDelete);
    setRowToDelete(null);
    setShowDeleteModal(false);
  };

  const handleUpdate = (row) => {
    setUpdateRow(row);
    setShowUpdateModal(true);
  };

  const confirmUpdate = () => {
    setRowData((prevData) =>
      prevData.map((row) => (row.id === updateRow.id ? updateRow : row))
    );
    console.log("Updated row:", updateRow);
    setShowUpdateModal(false);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateRow((prevRow) => ({ ...prevRow, [name]: value }));
  };

  const handleCellEditingStopped = (event) => {
    const updatedRow = event.data;
    setEditedRow(updatedRow);
    setShowConfirmUpdateModal(true);
  };

  const handleConfirmUpdate = () => {
    setRowData((prevData) =>
      prevData.map((row) => (row.id === editedRow.id ? editedRow : row))
    );
    console.log("Updated row:", editedRow);
    setEditedRow(null);
    setShowConfirmUpdateModal(false);
  };

  return (
    <div style={containerStyle}>
      <div className="example-wrapper">
        <div className="d-flex justify-content-between">
          <div>
            <Button variant="primary">Thêm mới +</Button>
          </div>
          <div className="d-flex gap-3">
            <Button
              variant="success"
              onClick={onExportClick}
              style={{ marginBottom: "10px", padding: "5px" }}
            >
              Export to CSV
            </Button>
            <Button
              variant="warning"
              onClick={resetFilters}
              style={{ marginBottom: "10px", padding: "5px" }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
        <div style={gridStyle} className={"ag-theme-alpine"}>
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            pagination={true}
            paginationPageSize={10}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            domLayout="autoHeight"
            groupDisplayType="singleColumn"
            animateRows={true}
            enableRangeSelection={true}
            enableRowGroup={true}
            sideBar={"filters"}
            onCellEditingStopped={handleCellEditingStopped}
          />
        </div>
      </div>

      {/* Modal cập nhật */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật dữ liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formStatus">
              <Form.Label>Tình trạng</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={updateRow?.status || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formTransactionTime" className="mt-2">
              <Form.Label>Thời gian giao dịch</Form.Label>
              <Form.Control
                type="datetime-local"
                name="transactionTime"
                value={updateRow?.transactionTime || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formAmount" className="mt-2">
              <Form.Label>Số tiền</Form.Label>
              <Form.Control
                type="text"
                name="amount"
                value={updateRow?.amount || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmUpdate}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>

      <ConfirmModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa hàng này không?"
      />

      <ConfirmModal
        show={showConfirmUpdateModal}
        onHide={() => setShowConfirmUpdateModal(false)}
        onConfirm={confirmUpdate}
        title="Xác nhận cập nhật"
        message="Bạn có muốn cập nhật hàng này không?"
      />
    </div>
  );
};

export default Transaction;
