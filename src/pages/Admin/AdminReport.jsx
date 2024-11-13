import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Modal, Form } from "react-bootstrap";
import ConfirmModal from "../../components/Shared/ConfirmModal";

// Đăng ký chỉ các mô-đun của Community
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminReport = () => {
  const gridRef = useRef();

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState([
    { id: 1, user: "John Doe", address: "123 Main St", type: "Fraud", reportDate: "2023-10-12", status: "Pending" },
    { id: 2, user: "Jane Smith", address: "456 Oak Ave", type: "Abuse", reportDate: "2023-09-25", status: "Resolved" },
    { id: 3, user: "Alice Johnson", address: "789 Pine Rd", type: "Spam", reportDate: "2023-11-01", status: "Under Review" },
    { id: 4, user: "Robert Brown", address: "321 Maple Ln", type: "Harassment", reportDate: "2023-10-05", status: "Pending" },
    { id: 5, user: "Michael Miller", address: "654 Elm St", type: "Fraud", reportDate: "2023-08-18", status: "Resolved" },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editedRow, setEditedRow] = useState(null);
  const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
  const [updateRow, setUpdateRow] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const columnDefs = [
    { headerName: "Người dùng", field: "user", editable: true, filter: true, sortable: true },
    { headerName: "Địa chỉ", field: "address", editable: true, filter: true, sortable: true },
    { headerName: "Loại", field: "type", editable: true, filter: true, sortable: true },
    { headerName: "Ngày tố cáo", field: "reportDate", editable: true, filter: true, sortable: true },
    { headerName: "Trạng thái", field: "status", editable: true, filter: true, sortable: true },
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
    const worksheet = XLSX.utils.json_to_sheet(rowData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AdminReport");
    XLSX.writeFile(workbook, "AdminReport.xlsx");
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
            <Button variant="success" onClick={onExportClick} style={{ marginBottom: "10px", padding: "5px" }}>
              Export to CSV
            </Button>
            <Button variant="warning" onClick={resetFilters} style={{ marginBottom: "10px", padding: "5px" }}>
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
            animateRows={true}
            onCellEditingStopped={handleCellEditingStopped}
          />
        </div>
      </div>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật dữ liệu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUser">
              <Form.Label>Người dùng</Form.Label>
              <Form.Control
                type="text"
                name="user"
                value={updateRow?.user || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formAddress" className="mt-2">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={updateRow?.address || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formType" className="mt-2">
              <Form.Label>Loại</Form.Label>
              <Form.Control
                type="text"
                name="type"
                value={updateRow?.type || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formReportDate" className="mt-2">
              <Form.Label>Ngày tố cáo</Form.Label>
              <Form.Control
                type="date"
                name="reportDate"
                value={updateRow?.reportDate || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formStatus" className="mt-2">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={updateRow?.status || ""}
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

export default AdminReport;
