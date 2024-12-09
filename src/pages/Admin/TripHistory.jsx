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

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  GridChartsModule,
  MenuModule,
  RowGroupingModule,
]);

Modal.setAppElement("#root");

const TripHistory = () => {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "500px", width: "100%" }), []);
  const chartStyle = useMemo(() => ({ height: "400px", width: "100%" }), []);

  const [rowData, setRowData] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState("");

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: "Tên tour",
      field: "tourName",
      width: 200,
      chartDataType: "category",
      filter: "agSetColumnFilter",
      resizable: true, // Cho phép thay đổi kích thước
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
      headerName: "Địa điểm",
      field: "location",
      width: 100,
      chartDataType: "category",
      filter: "agSetColumnFilter",
      resizable: true,
    },
    {
      headerName: "Trạng thái phê duyệt",
      field: "approvalStatus",
      width: 100,
      chartDataType: "category",
      filter: "agSetColumnFilter",
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
              <button onClick={() => acceptTour(params.data.tourId)} className="btn btn-success btn-sm">
                Chấp nhận
              </button>
              <button onClick={() => denyTour(params.data.tourId)} className="btn btn-danger btn-sm">
                Từ chối
              </button>
            </>
          )}
        </div>
      ),
    },
  ]);
  
  const defaultColDef = useMemo(() => ({
    flex: 1,
    filter: true,
    sortable: true,
    resizable: true, // Cho phép thay đổi kích thước
  }), []);
  
  const popupParent = useMemo(() => document.body, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalData(null);
  };

  const token = useSelector((state) => state.auth.token);

  const fetchTourData = () => {
    axios.get("https://travelmateapp.azurewebsites.net/api/Tour", {
      headers: { Authorization: `${token}` },
    })
      .then((response) => {
        setRowData(response.data.$values);
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu:", error);
      });
  };

  const acceptTour = (tourId) => {
    axios.post(`https://travelmateapp.azurewebsites.net/api/Tour/accept/${tourId}`, {}, {
      headers: { Authorization: `${token}` },
    })
      .then(() => {
        toast.success("Tour đã được chấp nhận thành công !");
        fetchTourData();
      })
      .catch((error) => {
        console.error("Lỗi khi chấp nhận tour:", error);
        alert("Có lỗi khi chấp nhận tour. Vui lòng thử lại.");
      });
  };

  const denyTour = (tourId) => {
    axios.post(`https://travelmateapp.azurewebsites.net/api/Tour/reject/${tourId}`, {}, {
      headers: { Authorization: `${token}` },
    })
      .then(() => {
        toast.success("Tour đã bị từ chối thành công!");
        fetchTourData();
      })
      .catch((error) => {
        console.error("Lỗi khi từ chối tour:", error);
        alert("Có lỗi khi từ chối tour. Vui lòng thử lại.");
      });
  };

  const autoSizeStrategy = useMemo(() => {
    return {
      type: "fitCellContents",
    };
  }, []);

  React.useEffect(() => {
    fetchTourData();
  }, []);

  return (
    <div style={containerStyle}>
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tìm kiếm nhanh..."
          onChange={(e) => setQuickFilterText(e.target.value)}
        />
      </div>

      <div style={gridStyle} className="ag-theme-quartz">
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
      </div>

      

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Chi tiết tour"
        style={{
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
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <h2>{modalData?.tourName}</h2>
        <p><strong>Mã tour:</strong> {modalData?.tourId}</p>
        <p><strong>Giá:</strong> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(modalData?.price)}</p>
        <p><strong>Địa điểm:</strong> {modalData?.location}</p>
        <p><strong>Ngày bắt đầu:</strong> {new Date(modalData?.startDate).toLocaleDateString()}</p>
        <p><strong>Ngày kết thúc:</strong> {new Date(modalData?.endDate).toLocaleDateString()}</p>

        <button onClick={closeModal} className="btn btn-primary mt-3">Đóng</button>
      </Modal>
    </div>
  );
};

export default TripHistory;