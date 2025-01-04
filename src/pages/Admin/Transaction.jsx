import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import * as XLSX from "xlsx";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Card, Row, Col, Form } from "react-bootstrap";
import { toast } from "react-toastify";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const Transaction = () => {
  const gridRef = useRef();

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://travelmateapp.azurewebsites.net/api/Transaction"
      );
      const data = response.data?.$values || [];
      const transformedData = data.map((item) => ({
        id: item.id,
        sender: item.localName,
        receiver: item.travelerName,
        status: "Đã hoàn thành",
        transactionTime: new Date(item.transactionTime).toLocaleString("vi-VN"),
        amount: item.price,
        formattedAmount: `${item.price.toLocaleString("vi-VN")} VND`,
      }));

      setRowData(transformedData);

      // Calculate summary data
      setTotalTransactions(data.length);
      setTotalAmount(data.reduce((sum, item) => sum + item.price, 0));
    } catch (error) {
      toast.error("Không thể tải dữ liệu giao dịch!");
      console.error("API error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const columnDefs = [
    {
      headerName: "Người gửi",
      field: "sender",
      editable: false,
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Người nhận",
      field: "receiver",
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
      field: "formattedAmount",
      editable: false,
      filter: "agNumberColumnFilter",
    },
  ];

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(rowData.map(({ formattedAmount, ...rest }) => rest));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      XLSX.writeFile(wb, "Transactions.xlsx");
      toast.success("Xuất file Excel thành công!");
    } catch (error) {
      toast.error("Không thể xuất file Excel!");
      console.error("Excel export error:", error);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="mb-4">
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Tổng số giao dịch</Card.Title>
                <h3>{totalTransactions}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <Card.Title>Tổng số tiền giao dịch</Card.Title>
                <h3>{totalAmount.toLocaleString("vi-VN")} VND</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <div>
        <div
          className="d-flex align-items-center justify-content-between my-3"
          style={{ height: "38px" }}
        >
          <Form.Control
            style={{ height: "38px", width: "25%" }}
            type="text"
            placeholder="Tìm kiếm"
            onInput={(e) => gridRef.current.api.setQuickFilter(e.target.value)}
          />
          <Button
            variant="success"
            className="text-nowrap"
            onClick={exportToExcel}
            style={{ height: "38px" }}
          >
            Xuất file Excel
          </Button>
        </div>

        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
