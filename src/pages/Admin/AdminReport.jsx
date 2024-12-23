import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Button, Modal, Form, Card, Row, Col } from "react-bootstrap";

// Đăng ký mô-đun của Community
ModuleRegistry.registerModules([ClientSideRowModelModule]);

const AdminReport = () => {
  const gridRef = useRef();

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [rowData, setRowData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Lấy token từ Redux
  const token = useSelector((state) => state.auth.token);

  const columnDefs = [
    { headerName: "ID", field: "userReportId", filter: true, sortable: true },
    { headerName: "Người dùng ID", field: "userId", filter: true, sortable: true },
    { headerName: "Chi tiết", field: "detail", filter: true, sortable: true },
    {
      headerName: "Hình ảnh",
      field: "imageReport",
      cellRenderer: (params) => (
        params.value ? <img src={params.value} alt="report" style={{ width: "100px", height: "auto" }} /> : "Không có hình ảnh"
      ),
      filter: false,
      sortable: false,
    },
    { headerName: "Loại báo cáo", field: "reportType", filter: true, sortable: true },
    { headerName: "Ngày tạo", field: "createdAt", filter: true, sortable: true },
    { headerName: "Trạng thái", field: "status", filter: true, sortable: true },
    {
      headerName: "Hành động",
      field: "actions",
      cellRenderer: (params) => (
        <div className="d-flex gap-2">
          <Button variant="info" size="sm" onClick={() => handleView(params.data)}>
            Xem
          </Button>{" "}
          <Button variant="warning" size="sm" onClick={() => handleUpdateStatus(params.data)}>
            Trạng thái
          </Button>
        </div>
      ),
      editable: false,
      filter: false,
      sortable: false,
    },
  ];

  const fetchData = async () => {
    try {
      const response = await fetch("https://travelmateapp.azurewebsites.net/api/UserReport", {
        method: "GET",
        headers: {
          Authorization: token, // Gắn token trực tiếp
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setRowData(data.$values || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleView = (row) => {
    setSelectedReport(row);
    setShowUpdateModal(false);
  };

  const handleUpdateStatus = (row) => {
    setSelectedReport(row);
    setNewStatus(row.status); // Đặt trạng thái hiện tại làm mặc định
    setShowUpdateModal(true);
  };

  const confirmUpdateStatus = async () => {
    if (!selectedReport || !newStatus) {
      alert("Vui lòng chọn trạng thái hợp lệ.");
      return;
    }

    try {
      const response = await fetch(
        `https://travelmateapp.azurewebsites.net/api/UserReport/updateStatus/${selectedReport.userReportId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token, // Gắn token trực tiếp
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newStatus),
        }
      );

      if (response.ok) {
        // Cập nhật trạng thái trong rowData
        setRowData((prevData) =>
          prevData.map((row) =>
            row.userReportId === selectedReport.userReportId
              ? { ...row, status: newStatus }
              : row
          )
        );
        setShowUpdateModal(false);
        alert("Cập nhật trạng thái thành công!");
      } else {
        console.error("Cập nhật trạng thái thất bại.");
        alert("Cập nhật trạng thái thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Đã xảy ra lỗi khi cập nhật trạng thái.");
    }
  };

  // Tính toán số liệu báo cáo
  const totalReports = rowData.length;
  const resolvedReports = rowData.filter((report) => report.status === "Đã giải quyết").length;
  const unresolvedReports = rowData.filter((report) => report.status === "Đang xử lý").length;
  const newReports = rowData.filter((report) => report.status === "Mới tạo").length;

  return (
    <div style={containerStyle}>
      {/* Card hiển thị số liệu */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Tổng số báo cáo</Card.Title>
              <Card.Text>{totalReports}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Báo cáo đã giải quyết</Card.Title>
              <Card.Text>{resolvedReports}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Báo cáo chưa giải quyết</Card.Title>
              <Card.Text>{unresolvedReports}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Báo cáo mới tạo</Card.Title>
              <Card.Text>{newReports}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="example-wrapper">
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
      </div>

      {/* Modal cập nhật trạng thái */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cập nhật trạng thái báo cáo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport ? (
            <>
              <p><strong>ID báo cáo:</strong> {selectedReport.userReportId}</p>
              <p><strong>Trạng thái hiện tại:</strong> {selectedReport.status}</p>
              <Form.Group controlId="statusSelect">
                <Form.Label>Chọn trạng thái mới</Form.Label>
                <Form.Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giải quyết">Đã giải quyết</option>
                  <option value="Mới tạo">Mới tạo</option>
                </Form.Select>
              </Form.Group>
            </>
          ) : (
            <p>Không có báo cáo nào được chọn.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={confirmUpdateStatus}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminReport;
