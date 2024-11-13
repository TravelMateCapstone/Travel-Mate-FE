import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Modal, Form } from "react-bootstrap";
import ConfirmModal from "../../components/Shared/ConfirmModal";

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
      sender: { name: "John Doe" },
      receiver: { name: "Jane Smith" },
      status: "Đã hoàn thành",
      transactionTime: "2023-10-12 14:30",
      amount: "$1000",
    },
    {
      id: 2,
      sender: { name: "Alice Johnson" },
      receiver: { name: "Robert Brown" },
      status: "Đang giao dịch",
      transactionTime: "2023-10-13 11:00",
      amount: "$500",
    },
  ]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRow, setUpdateRow] = useState(null);

  const columnDefs = [
    {
      headerName: "Người gửi",
      field: "sender",
      valueGetter: (params) => params.data.sender.name,
      cellRenderer: (params) => <div>{params.value}</div>,
      editable: false,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: "Người nhận",
      field: "receiver",
      valueGetter: (params) => params.data.receiver.name,
      cellRenderer: (params) => <div>{params.value}</div>,
      editable: false,
      filter: 'agTextColumnFilter',
    },
    {
      headerName: "Tình trạng",
      field: "status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Đã hoàn thành", "Đang giao dịch"],
      },
    },
    {
      headerName: "Thời gian giao dịch",
      field: "transactionTime",
      editable: false,
      filter: "agDateColumnFilter", // Sử dụng bộ lọc thời gian
      filterParams: {
        comparator: (filterDate, cellValue) => {
          const cellDate = new Date(cellValue);
          if (cellDate < filterDate) return -1;
          if (cellDate > filterDate) return 1;
          return 0;
        },
        browserDatePicker: true, // Sử dụng date picker của trình duyệt
      },
    },
    {
      headerName: "Số tiền",
      field: "amount",
      editable: false,
    },
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
  
  

  const onCellValueChanged = (params) => {
    if (params.column.getColId() === "status") {
      // Cập nhật trạng thái rowData khi giá trị status thay đổi
      setRowData((prevData) =>
        prevData.map((row) =>
          row.id === params.data.id ? { ...row, status: params.value } : row
        )
      );
      console.log("Updated status:", params.data);
    }
  };

  const resetFilters = useCallback(() => {
    gridRef.current.api.setFilterModel(null);
  }, []);

  const onExportClick = () => {
    const worksheet = XLSX.utils.json_to_sheet(rowData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction");
    XLSX.writeFile(workbook, "Transaction.xlsx");
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
              Export to Excel
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
            onCellValueChanged={onCellValueChanged} // Cập nhật giá trị trực tiếp sau khi thay đổi
          />
        </div>
      </div>

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
    </div>
  );
};

export default Transaction;
