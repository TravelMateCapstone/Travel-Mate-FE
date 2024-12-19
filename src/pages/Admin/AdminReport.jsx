import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Modal, Form } from "react-bootstrap";
import ConfirmModal from "../../components/Shared/ConfirmModal";
import TextareaAutosize from 'react-textarea-autosize';
// Đăng ký chỉ các mô-đun của Community
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminReport = () => {
  const gridRef = useRef();

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState([
    { id: 1, user: "John Doe", address: "123 Main St", type: "Fraud", reportDate: "2023-10-12", status: "Đang xử lý", content: "Report content 1" },
    { id: 2, user: "Jane Smith", address: "456 Oak Ave", type: "Abuse", reportDate: "2023-09-25", status: "Đã xử lý", content: "Report content 2" },
    { id: 3, user: "Alice Johnson", address: "789 Pine Rd", type: "Spam", reportDate: "2023-11-01", status: "Đã phản hồi", content: "Report content 3" },
    { id: 4, user: "Robert Brown", address: "321 Maple Ln", type: "Harassment", reportDate: "2023-10-05", status: "Đã phản hồi", content: "Report content 4" },
    { id: 5, user: "Michael Miller", address: "654 Elm St", type: "Fraud", reportDate: "2023-08-18", status: "Đã phản hồi", content: "Report content 5" },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editedRow, setEditedRow] = useState(null);
  const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
  const [updateRow, setUpdateRow] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const columnDefs = [
    { headerName: "Người dùng", field: "user", filter: true, sortable: true },
    { headerName: "Địa chỉ", field: "address", filter: true, sortable: true },
    { headerName: "Loại", field: "type", filter: true, sortable: true },
    { headerName: "Ngày tố cáo", field: "reportDate", filter: true, sortable: true },
    { headerName: "Nội dung báo cáo", field: "content", filter: true, sortable: true },
    {
      headerName: "Trạng thái", field: "status", editable: true, filter: true, sortable: true, cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: ['Đang xử lý', 'Đã xử lý', 'Đã phản hồi',],
      }
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className="d-flex gap-2">
          <Button variant="info" size="sm" onClick={() => handleView(params.data)}>
            Xem thêm
          </Button>{" "}
          <Button variant="warning" size="sm" onClick={() => handleUpdate(params.data)}>
            Trả lời
          </Button>{" "}
          <Button variant="danger" size="sm" onClick={() => handleUpdate(params.data)}>
            Cấm
          </Button>{" "}
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
              Xuất sang exel
            </Button>
            <Button variant="warning" onClick={resetFilters} style={{ marginBottom: "10px", padding: "5px" }}>
              Làm lại bộ lọc
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
          <Modal.Title>Trả lời báo cáo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="text" className="form-control" placeholder="Tiêu đề" name="title" value={updateRow?.title || ''} onChange={handleUpdateChange} />
          <TextareaAutosize className="form-control mt-2" minRows={10} placeholder="Nội dung" name="content" value={updateRow?.content || ''} onChange={handleUpdateChange} />
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
