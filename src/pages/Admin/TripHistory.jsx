import React, { useMemo, useState } from "react";
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

// Đăng ký các module của AG Grid
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  GridChartsModule,
  MenuModule,
  RowGroupingModule,
]);

// Thiết lập Modal cho khả năng truy cập
Modal.setAppElement("#root");

const TripHistory = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []); // Đặt chiều cao cho bảng
  const chartStyle = useMemo(() => ({ height: "400px", width: "100%" }), []); // Đặt chiều cao cho biểu đồ

  const [rowData, setRowData] = useState([]);
  const [columnDefs, setColumnDefs] = useState([
    { field: "tourId", width: 100, chartDataType: "category" },
    { field: "tourName", width: 100, chartDataType: "category" },
    {
      field: "price",
      width: 100,
      chartDataType: "series", // Changed from 'number' to 'series'
      valueFormatter: (params) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(params.value);
      }
    },
    { field: "startDate", width: 100, chartDataType: "time" }, 
    { field: "endDate", width: 100, chartDataType: "time" }, 
    { field: "location", width: 100, chartDataType: "category" },
    {
      field: "approvalStatus",
      width: 100,
      chartDataType: "category",
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
          <button onClick={() => acceptTour(params.data.tourId)} className="btn btn-success btn-sm">
            Chấp nhận
          </button>
          <button onClick={() => denyTour(params.data.tourId)} className="btn btn-danger btn-sm">
            Từ chối
          </button>
        </div>
      ),
    },
  ]);

  const defaultColDef = useMemo(() => ({ flex: 1 }), []);
  const popupParent = useMemo(() => document.body, []);

  // Trạng thái modal (mở và đóng modal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data); // Đặt dữ liệu cho modal
    setIsModalOpen(true); // Mở modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng modal
    setModalData(null); // Xóa dữ liệu modal
  };

  const token = useSelector((state) => state.auth.token);

  const fetchTourData = () => {
    axios.get("https://travelmateapp.azurewebsites.net/api/Tour", {
      headers: { Authorization: `${token}` }
    })
      .then((response) => {
        console.log("Dữ liệu tour:", response.data.$values);
        
        setRowData(response.data.$values);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu:", error);
      });
  };

  // Chấp nhận tour
  const acceptTour = (tourId) => {
    axios.post(`https://travelmateapp.azurewebsites.net/api/Tour/accept/${tourId}`, {}, {
      headers: { Authorization: `${token}` }
    })
      .then((response) => {
        toast.success("Tour đã được chấp nhận thành công !")
        fetchTourData();  
      })
      .catch((error) => {
        console.error("Lỗi khi chấp nhận tour:", error);
        alert("Có lỗi khi chấp nhận tour. Vui lòng thử lại.");
      });
  };

  // Từ chối tour
  const denyTour = (tourId) => {
    axios.post(`https://travelmateapp.azurewebsites.net/api/Tour/reject/${tourId}`)
      .then((response) => {
        console.log("Tour denied:", response.data);
        toast.success("Tour đã bị từ chối thành công!")
        fetchTourData();  // Làm mới dữ liệu sau khi thao tác thành công
      })
      .catch((error) => {
        console.error("Lỗi khi từ chối tour:", error);
        alert("Có lỗi khi từ chối tour. Vui lòng thử lại.");
      });
  };

  const chartThemeOverrides = useMemo(() => ({
    common: {
      title: { enabled: true, text: "Medals by Age" },
    },
    bar: {
      axes: {
        category: {
          label: { rotation: 0 },
        },
      },
    },
  }), []);

  const onFirstDataRendered = useMemo(() => (params) => {
    params.api.createRangeChart({
      chartContainer: document.querySelector("#myChart"),
      cellRange: {
        rowStartIndex: 0,
        rowEndIndex: 79,
        columns: ["age", "gold", "silver", "bronze"],
      },
      chartType: "groupedColumn",
      aggFunc: "sum",
    });
  }, []);

  const modalStyles = {
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "30px",
      maxWidth: "900px",
      width: "100%",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      zIndex: 9999,
      height: '80%',
      overflowY: 'auto',
    },
    overlay: {
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  // Lấy dữ liệu tour ban đầu khi component mount
  React.useEffect(() => {
    fetchTourData();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="wrapper">
        {/* Container cho bảng */}
        <div style={gridStyle} className="ag-theme-quartz">
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            cellSelection={true}
            popupParent={popupParent}
            enableCharts={true}
            chartThemeOverrides={chartThemeOverrides}
            onFirstDataRendered={onFirstDataRendered}
          />
        </div>
      </div>
      {/* Modal để xem thêm chi tiết */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chi tiết tour"
        style={modalStyles}
      >
        <h2>{modalData?.tourName}</h2>
        <p><strong>Mã tour:</strong> {modalData?.tourId}</p>
        <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(modalData?.price)}</p>
        <p><strong>Địa điểm:</strong> {modalData?.location}</p>
        <p><strong>Ngày bắt đầu:</strong> {new Date(modalData?.startDate).toLocaleDateString()}</p>
        <p><strong>Ngày kết thúc:</strong> {new Date(modalData?.endDate).toLocaleDateString()}</p>

        <h3>Lịch trình:</h3>
        {modalData?.itinerary?.$values.map((day, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <strong>Ngày {day.day}:</strong> {new Date(day.date).toLocaleDateString()}
            <ul style={{ paddingLeft: "20px" }}>
              {day.activities.$values.map((activity, i) => (
                <li key={i} style={{ marginBottom: "10px" }}>
                  <strong>{activity.time}</strong>: {activity.description} <br />
                  Số tiền: {activity.activityAmount} VND
                  {activity.activityImage && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={activity.activityImage}
                        alt={activity.description}
                        style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h3>Chi tiết chi phí:</h3>
        {modalData?.costDetails?.$values.map((cost, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <strong>{cost.title}</strong>: {cost.amount} VND
            <p>{cost.notes}</p>
          </div>
        ))}

        <h3>Thông tin bổ sung:</h3>
        <div
          dangerouslySetInnerHTML={{ __html: modalData?.additionalInfo }}
          style={{ marginBottom: "20px", fontSize: "14px", lineHeight: "1.6" }}
        />

        <div className="d-flex justify-content-end">
          <button
            onClick={closeModal}
            style={{ padding: "10px 20px", borderRadius: "5px", backgroundColor: "#007BFF", color: "#fff", border: "none", cursor: "pointer" }}
          >
            Đóng
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TripHistory;
