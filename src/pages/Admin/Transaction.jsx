import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Modal, Form } from "react-bootstrap";
import ConfirmModal from "../../components/Shared/ConfirmModal";
import { toast } from "react-toastify";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

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
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Người nhận",
      field: "receiver",
      valueGetter: (params) => params.data.receiver.name,
      cellRenderer: (params) => <div>{params.value}</div>,
      editable: false,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Tình trạng",
      field: "status",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Đã hoàn thành", "Đang giao dịch"],
      },
      filter: "agSetColumnFilter",
    },
    {
      headerName: "Thời gian giao dịch",
      field: "transactionTime",
      editable: false,
      filter: "agDateColumnFilter",
    },
    {
      headerName: "Số tiền",
      field: "amount",
      editable: false,
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Hành động",
      field: "actions",
      cellRenderer: (params) => (
        <div>
          <Button variant="info" size="sm" onClick={() => handleView(params.data)}>
            Xem chi tiêt
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

  const handleRefund = (row) => {
    toast.success("Đã hoàn tiền thành công!");
    console.log("Refunding row:", row);
  };

  return (
    <div style={containerStyle}>
      <div className="">
        <div className="d-flex align-items-center justify-content-between my-3" style={{
          height: "38px",
        }}>
          <input
            style={{
              height: "38px",
            }}
            className="form-control h-100 w-25"
            type="text"
            placeholder="Tìm kiếm"
            onInput={(e) => gridRef.current.api.setQuickFilter(e.target.value)}
          />
          <Button
              variant="success"
              className="text-nowrap"
              onClick={onExportClick}
              style={{ height: "38px" }}
            >
              Xuất file excel
            </Button>
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
            onCellValueChanged={onCellValueChanged}
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
