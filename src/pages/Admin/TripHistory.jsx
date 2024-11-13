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
import { Button, Modal, Form } from "react-bootstrap";
import ConfirmModal from "../../components/Shared/ConfirmModal";

// Register the modules
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  SetFilterModule,
]);

const TripHistory = () => {
  const gridRef = useRef();

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState([
    { id: 1, user: "John Doe", destination: "New York", phone: "123-456-7890", email: "john@example.com" },
    { id: 2, user: "Jane Smith", destination: "Los Angeles", phone: "234-567-8901", email: "jane@example.com" },
    { id: 3, user: "Alice Johnson", destination: "Chicago", phone: "345-678-9012", email: "alice@example.com" },
    { id: 4, user: "Robert Brown", destination: "Houston", phone: "456-789-0123", email: "robert@example.com" },
    { id: 5, user: "Michael Miller", destination: "Miami", phone: "567-890-1234", email: "michael@example.com" },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [editedRow, setEditedRow] = useState(null);
  const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
  const [updateRow, setUpdateRow] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const columnDefs = [
    { headerName: "Người dùng", field: "user", editable: true },
    { headerName: "Nơi đến", field: "destination", editable: true },
    { headerName: "Số điện thoại", field: "phone", editable: true },
    { headerName: "Email", field: "email", editable: true },
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
            <Form.Group controlId="formUser">
              <Form.Label>Người dùng</Form.Label>
              <Form.Control
                type="text"
                name="user"
                value={updateRow?.user || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formDestination" className="mt-2">
              <Form.Label>Nơi đến</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                value={updateRow?.destination || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhone" className="mt-2">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={updateRow?.phone || ""}
                onChange={handleUpdateChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail" className="mt-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={updateRow?.email || ""}
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

export default TripHistory;
