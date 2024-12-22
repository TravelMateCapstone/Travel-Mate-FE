  import React, { useMemo, useState, useEffect, useCallback } from "react";
  import { AgGridReact } from "@ag-grid-community/react";
  import "@ag-grid-community/styles/ag-theme-quartz.css";
  import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
  import { ModuleRegistry } from "@ag-grid-community/core";
  import { GridChartsModule } from "@ag-grid-enterprise/charts-enterprise";
  import { MenuModule } from "@ag-grid-enterprise/menu";
  import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
  import axios from "axios";
  import Modal from "react-modal";
  import { toast } from "react-toastify";
  import { useSelector } from "react-redux";
  import { AgCharts } from "ag-charts-react";
  import { Col, Row } from "react-bootstrap";
  import { useQuery, useMutation, useQueryClient } from "react-query";
  import * as XLSX from "xlsx";
  import { saveAs } from "file-saver";
  import { Spinner, Placeholder } from "react-bootstrap";


  ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    GridChartsModule,
    MenuModule,
    RowGroupingModule,
  ]);

  Modal.setAppElement("#root");

  const fetchTours = async (token) => {
    const { data } = await axios.get("https://travelmateapp.azurewebsites.net/api/Tour", {
      headers: { Authorization: `${token}` },
    });
    return data.$values;
  };

  const TripHistory = () => {
    const token = useSelector((state) => state.auth.token);
    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "470px", width: "100%" }), []);
    const chartStyle = useMemo(() => ({ width: "100%" }), []);
    const [quickFilterText, setQuickFilterText] = useState("");
    const queryClient = useQueryClient();

    const exportToExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(rowData); // Chuyển dữ liệu thành worksheet
      const workbook = XLSX.utils.book_new(); // Tạo workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Tour Data"); // Thêm worksheet vào workbook

      // Tạo tệp Excel
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // Lưu tệp
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(data, "TourData.xlsx");
    };


    const [columnDefs] = useState([
      {
        headerName: "Tên tour",
        field: "tourName",
        width: 200,
        chartDataType: "category",
        filter: "agSetColumnFilter",
        resizable: true,
      },
      {
        headerName: "Địa điểm",
        field: "location",
        width: 100,
        chartDataType: "category",
        filter: "agSetColumnFilter",
        resizable: true,
      },
      {
        headerName: "Ngày bắt đầu",
        field: "startDate",
        width: 100,
        chartDataType: "time",
        filter: "agDateColumnFilter",
        valueFormatter: (params) => {
          return new Date(params.value).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        },
      },
      {
        headerName: "Ngày kết thúc",
        field: "endDate",
        width: 100,
        chartDataType: "time",
        filter: "agDateColumnFilter",
        valueFormatter: (params) => {
          return new Date(params.value).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          });
        },
      },
      {
        headerName: "Giá",
        field: "price",
        width: 100,
        chartDataType: "series",
        filter: "agNumberColumnFilter",
        valueFormatter: (params) => {
          return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(params.value);
        },
      },
      {
        headerName: "Trạng thái phê duyệt",
        field: "approvalStatus",
        width: 100,
        chartDataType: "category",
        filter: "agSetColumnFilter",
        valueFormatter: (params) => {
          switch (params.value) {
            case 0: return "Đang xử lý";
            case 1: return "Đã chấp nhận";
            case 2: return "Đã từ chối";
            default: return "Không xác định";
          }
        },
        filterParams: {
          valueFormatter: (params) => {
            switch (params.value) {
              case 0: return "Đang xử lý";
              case 1: return "Đã chấp nhận";
              case 2: return "Đã từ chối";
              default: return "Không xác định";
            }
          },
          values: [0, 1, 2], // Giá trị số để lọc
        },
        cellRenderer: (params) => {
          switch (params.value) {
            case 0:
              return <span>Đang xử lý</span>;
            case 1:
              return <span>Đã chấp nhận</span>;
            case 2:
              return <span>Đã từ chối</span>;
            default:
              return <span>Không xác định</span>;
          }
        },
      },
      {
        headerName: "Hành động",
        width: 100,
        cellRenderer: (params) => (
          <div className="d-flex gap-2 align-items-center">
            <button onClick={() => openModal(params.data)} className="btn btn-primary btn-sm">
              <ion-icon name="information-circle-outline"></ion-icon>
            </button>
            {params.data.approvalStatus === 0 && (
              <>
                <button
                  onClick={() => acceptTourMutation.mutate(params.data.tourId)}
                  className="btn btn-success btn-sm"
                >
                  Chấp nhận
                </button>
                <button
                  onClick={() => denyTourMutation.mutate(params.data.tourId)}
                  className="btn btn-danger btn-sm"
                >
                  Từ chối
                </button>
              </>
            )}
          </div>
        ),
      },
    ]);

    const defaultColDef = useMemo(
      () => ({
        flex: 1,
        filter: true,
        sortable: true,
        resizable: true,
      }),
      []
    );

    const { data: rowData = [], isLoading } = useQuery(
      ["tours", token],
      () => fetchTours(token),
      {
        staleTime: 60000,
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
          updateChartData(data); // Đảm bảo hàm này chạy ngay khi lấy dữ liệu
        },
        keepPreviousData: true, // Giữ dữ liệu cũ trong khi refetch
      }
    );

    // Mutation: Chấp nhận tour
    const acceptTourMutation = useMutation(
      (tourId) =>
        axios.post(`https://travelmateapp.azurewebsites.net/api/Tour/accept/${tourId}`, {}, {
          headers: { Authorization: `${token}` },
        }),
      {
        onSuccess: () => {
          toast.success("Tour đã được chấp nhận thành công!");
          queryClient.invalidateQueries("tours"); // Refresh dữ liệu
        },
      }
    );

    // Mutation: Từ chối tour
    const denyTourMutation = useMutation(
      (tourId) =>
        axios.post(`https://travelmateapp.azurewebsites.net/api/Tour/reject/${tourId}`, {}, {
          headers: { Authorization: `${token}` },
        }),
      {
        onSuccess: () => {
          toast.success("Tour đã bị từ chối thành công!");
          queryClient.invalidateQueries("tours"); // Refresh dữ liệu
        },
      }
    );

    const popupParent = useMemo(() => document.body, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);



    const [options, setOptions] = useState({
      title: {
        text: "Số lượng tour theo địa điểm",
      },
      series: [
        {
          type: "pie",
          angleKey: "count",
          calloutLabelKey: "location", // Gắn nhãn gọi ra cho từng phần
          sectorLabelKey: "count", // Hiển thị giá trị số lượng trong từng phần
          sectorLabel: {
            color: "white",
            fontWeight: "bold", // Tùy chỉnh phong cách nhãn
          },
        },
      ],
    });

    const [barChartOptions, setBarChartOptions] = useState({
      title: {
        text: "Giá cả trung bình theo địa điểm",
      },
      series: [
        {
          type: "bar",
          xKey: "location",
          yKey: "averagePrice",
          label: {
            formatter: ({ value }) =>
              new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value),
          },
        },
      ],
      axes: [
        {
          type: "category",
          position: "bottom",
        },
        {
          type: "number",
          position: "left",
          title: {
            text: "Giá trung bình (VND)",
          },
        },
      ],
    });

    const updateChartData = useCallback((data) => {
      const locationCount = data.reduce((acc, curr) => {
        acc[curr.location] = (acc[curr.location] || 0) + 1;
        return acc;
      }, {});

      const pieChartData = Object.entries(locationCount).map(([location, count]) => ({
        location,
        count,
      }));

      const locationPriceSum = data.reduce((acc, curr) => {
        if (!acc[curr.location]) {
          acc[curr.location] = { totalPrice: 0, count: 0 };
        }
        acc[curr.location].totalPrice += curr.price;
        acc[curr.location].count += 1;
        return acc;
      }, {});

      const barChartData = Object.entries(locationPriceSum).map(([location, { totalPrice, count }]) => ({
        location,
        averagePrice: totalPrice / count,
      }));

      setOptions((prev) => ({
        ...prev,
        data: pieChartData,
      }));

      setBarChartOptions((prev) => ({
        ...prev,
        data: barChartData,
      }));
    }, []);

    useEffect(() => {
      if (rowData.length > 0) {
        updateChartData(rowData);
      }
    }, [rowData, updateChartData]);

    const openModal = useCallback((data) => {
      setModalData(data);
      setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
      setIsModalOpen(false);
      setModalData(null);
    }, []);
    return (
      <div style={containerStyle}>
      <h2>Quản lý tour</h2>

      <Row>
        <Col lg={4}>
          <div style={chartStyle}>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "28vh" }}>
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <AgCharts options={options} />
            )}
          </div>
        </Col>
        <Col lg={8}>
          <div style={chartStyle}>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center" style={{ height: "28vh" }}>
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <AgCharts options={barChartOptions} />
            )}
          </div>
        </Col>
      </Row>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-25"
          placeholder="Tìm kiếm nhanh..."
          onChange={(e) => setQuickFilterText(e.target.value)}
          style={{ height: "38px" }}
          disabled={isLoading} // Disable khi đang tải
        />
        <button
          className="btn btn-success ml-2 text-nowrap"
          onClick={exportToExcel}
          disabled={isLoading} // Disable khi đang tải
        >
          Xuất Excel
        </button>
      </div>

      <div style={gridStyle} className="ag-theme-quartz">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "100%" }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            quickFilterText={quickFilterText}
            popupParent={popupParent}
            enableCharts={true}
            cellSelection={true}
            pagination={true}
            paginationPageSize={20}
          />
        )}
      </div>
    </div>
    );
  };

  export default TripHistory;