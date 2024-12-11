import React, { useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { AgGridReact } from "@ag-grid-community/react";
import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import ReactModal from "react-modal";
import { Button, FormControl, Row, Col } from "react-bootstrap";
import { utils, writeFile } from "xlsx";
import { AgCharts } from "ag-charts-react";

// Đăng ký module
ModuleRegistry.registerModules([ClientSideRowModelModule]);

ReactModal.setAppElement("#root"); // Đặt phần tử gốc của ứng dụng

const fetchUserData = async () => {
  const response = await fetch("https://travelmateapp.azurewebsites.net/odata/ApplicationUsers");
  if (!response.ok) {
    throw new Error("Error fetching data");
  }
  return response.json();
};

const AccountList = () => {
  const gridRef = useRef();
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");

  const { data, isLoading, isError, error } = useQuery("users", fetchUserData, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 20 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const handleExportToExcel = () => {
    if (!data || !data.value) return;

    // Chuẩn bị dữ liệu cho Excel
    const formattedData = data.value.map((row) => ({
      ID: row.UserId || "Chưa cập nhật",
      "Tên người dùng": row.FullName || "Chưa cập nhật",
      Email: row.Email || "Chưa cập nhật",
      "Địa chỉ": row.Profile?.Address || "Chưa cập nhật",
      "Số sao": row.Star !== undefined ? row.Star : "Chưa cập nhật",
      "Số kết nối": row.CountConnect !== undefined ? row.CountConnect : "Chưa cập nhật",
      "Vai trò": row.Roles?.join(", ") || "Chưa cập nhật",
      "Ngày sinh": row.CCCD?.Dob || "Chưa cập nhật",
      "Giới tính": row.CCCD?.Sex || "Chưa cập nhật",
      "Tuổi": row.CCCD?.Age !== undefined ? row.CCCD.Age : "Chưa cập nhật",
      "Ảnh đại diện": row.Profile?.ImageUser || "Chưa cập nhật",
    }));

    // Tạo workbook và worksheet
    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Danh sách người dùng");

    // Xuất file Excel
    writeFile(workbook, "Danh_sach_nguoi_dung.xlsx");
  };

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const renderCell = (value) => {
    return value ? (
      value
    ) : (
      <span style={{ color: "red" }}>Chưa cập nhật</span>
    );
  };

  const columnDefs = [
    {
      headerName: "ID",
      field: "UserId",
      cellRenderer: (params) => renderCell(params.value),
      filter: true,
      sortable: true,
    },
    {
      headerName: "Tên người dùng",
      field: "FullName",
      cellRenderer: (params) => renderCell(params.value),
      filter: true,
      sortable: true,
    },
    {
      headerName: "Email",
      field: "Email",
      cellRenderer: (params) => renderCell(params.value),
      filter: true,
      sortable: true,
    },
    {
      headerName: "Địa chỉ",
      field: "Profile.Address",
      cellRenderer: (params) => renderCell(params.value),
      filter: true,
      sortable: true,
    },
    {
      headerName: "Số sao",
      field: "Star",
      cellRenderer: (params) => renderCell(params.value !== undefined ? params.value : null),
      filter: true,
      sortable: true,
    },
    {
      headerName: "Số kết nối",
      field: "CountConnect",
      cellRenderer: (params) => renderCell(params.value !== undefined ? params.value : null),
      filter: true,
      sortable: true,
    },
    {
      headerName: "Vai trò",
      field: "Roles",
      cellRenderer: (params) => renderCell(params.value?.join(", ") || null),
      filter: true,
      sortable: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div className="d-flex gap-2 align-items-center">
          <Button variant="primary" size="sm" onClick={() => handleView(params.data)}>
            <ion-icon name="information-circle-outline"></ion-icon>
          </Button>
          <Button variant="danger" size="sm" >
            Ban
          </Button>
        </div>
      ),
    },
  ];

  const getLocationCounts = (data) => {
    const counts = {};
    data.value.forEach((user) => {
      const address = user.Profile?.Address || "Chưa cập nhật";
      // Trích xuất thành phố (phần cuối cùng của địa chỉ sau dấu phẩy cuối cùng)
      const city = address.split(",").pop().trim() || "Chưa cập nhật";
      counts[city] = (counts[city] || 0) + 1;
    });
    return Object.entries(counts).map(([label, count]) => ({ label, count }));
  };


  const chartData = useMemo(() => {
    if (data && data.value) {
      return getLocationCounts(data);
    }
    return [];
  }, [data]);

  const options = {
    data: chartData,
    series: [
      {
        type: "pie",
        angleKey: "count",
        labelKey: "label",
        innerRadiusRatio: 0.5,
        calloutLabelKey: "label",
        calloutLabel: {
          enabled: true,
        },
        sectorLabelKey: "count",
        sectorLabel: {
          enabled: true,
          formatter: ({ datum }) => `${datum.count}`,
        },
      },
    ],
    title: {
      text: "Số lượng người dùng theo địa điểm",
    },
  };

  const getRoleCounts = (data) => {
    const counts = {};
    data.value.forEach((user) => {
      const roles = user.Roles || ["Chưa cập nhật"];
      roles.forEach((role) => {
        if (role.toLowerCase() !== "admin") {
          counts[role] = (counts[role] || 0) + 1;
        }
      });
    });
    return Object.entries(counts).map(([label, count]) => ({ label, count }));
  };

  const chartDataRoles = useMemo(() => {
    if (data && data.value) {
      return getRoleCounts(data);
    }
    return [];
  }, [data]);

  const optionsRoles = {
    data: chartDataRoles,
    series: [
      {
        type: "bar",
        xKey: "label",
        yKey: "count",
      },
    ],
    title: {
      text: "Số lượng người dùng theo vai trò",
    },
  };

  const handleView = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRow(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div style={containerStyle}>
       <Row className="mb-2">
          <Col lg={8}>
            <div style={{ width: "100%", }}>
              <AgCharts options={options} />
            </div>
          </Col>
  
          <Col lg={4}>
            <div style={{ width: "100%",}}>
              <AgCharts options={optionsRoles} />
            </div>
          </Col>
       </Row>
      <div className="example-wrapper">
        <div className="d-flex justify-content-between mb-2">
          <FormControl
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="w-25"
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
          />
          <div className="d-flex gap-2">
            <Button variant="success" className="text-nowrap">Thêm mới +</Button>
            <Button variant="warning" className="text-nowrap" onClick={handleExportToExcel}>
              Xuất file excel
            </Button>
          </div>
        </div>
        <div style={gridStyle} className={"ag-theme-alpine"}>
          <AgGridReact
            ref={gridRef}
            rowData={data.value}
            columnDefs={columnDefs}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            quickFilterText={quickFilter}
            pagination={true}
            paginationPageSize={10}
            rowSelection="multiple"
            suppressRowClickSelection={true}
            domLayout="autoHeight"
            animateRows={true}
            enableCellTextSelection={true}
          />
        </div>

      
      </div>

      {/* Modal chi tiết */}
      <ReactModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chi tiết người dùng"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "500px",
            padding: "20px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
        }}
      >
        <h4 className="mb-4">Chi tiết người dùng</h4>
        {selectedRow && (
          <Row>
            <Col xs={6} className="mb-2">
              <strong>ID:</strong> {selectedRow.UserId || <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Tên:</strong> {selectedRow.FullName || <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Email:</strong> {selectedRow.Email || <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Số sao:</strong> {selectedRow.Star ?? <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Số kết nối:</strong> {selectedRow.CountConnect ?? <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Địa chỉ:</strong> {selectedRow.Profile?.Address || <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Vai trò:</strong> {selectedRow.Roles?.join(", ") || <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Ngày sinh:</strong> {selectedRow.CCCD?.Dob || <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Giới tính:</strong> {selectedRow.CCCD?.Sex || <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            <Col xs={6} className="mb-2">
              <strong>Tuổi:</strong> {selectedRow.CCCD?.Age ?? <span style={{ color: "red" }}>Chưa cập nhật</span>}
            </Col>
            {selectedRow.Profile?.ImageUser && (
              <Col xs={12} className="mt-3">
                <strong>Ảnh đại diện:</strong>
                <div className="mt-2">
                  <img
                    src={selectedRow.Profile.ImageUser}
                    alt="User Avatar"
                    style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "5px" }}
                  />
                </div>
              </Col>
            )}
          </Row>
        )}

        <Button variant="danger" onClick={closeModal} className="mt-4">
          Đóng
        </Button>
      </ReactModal>
    </div>
  );
};

export default AccountList;
