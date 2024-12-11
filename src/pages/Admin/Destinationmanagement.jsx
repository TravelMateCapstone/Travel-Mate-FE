import React, { useState } from "react";
import { useQuery } from "react-query";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import axios from "axios";
import ConfirmModal from "../../components/Shared/ConfirmModal";
import { toast } from "react-toastify";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function DestinationManagement() {
  const [showModal, setShowModal] = useState(false);
  const [tempData, setTempData] = useState(null); // Lưu dữ liệu tạm thời khi chỉnh sửa
  const [changeInfo, setChangeInfo] = useState(""); // Thông tin thay đổi (giá trị cũ -> giá trị mới)
  const [quickFilterText, setQuickFilterText] = useState(""); // Lưu giá trị của quick filter

  const fetchLocations = async () => {
    const response = await axios.get("https://travelmateapp.azurewebsites.net/api/Locations");
    return response.data.$values;
  };

  const updateLocation = async (updatedData) => {
    try {
      const response = await axios.put(
        `https://travelmateapp.azurewebsites.net/api/Locations/${updatedData.locationId}`,
        updatedData
      );
      toast.success("Cập nhật thành công!");
      console.log("Cập nhật thành công:", response.data);
    } catch (error) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
      console.error("Lỗi khi cập nhật dữ liệu:", error);
    }
  };

  const { data: rowData = [], isLoading, error } = useQuery(
    "locations",
    fetchLocations
  );

  const [columnDefs] = React.useState([
    { field: "locationId", headerName: "ID", sortable: true },
    { field: "locationName", headerName: "Tên địa điểm", sortable: true, filter: true },
    { field: "title", headerName: "Tiêu đề", sortable: true, filter: true, editable: true },
    { field: "description", headerName: "Mô tả", flex: 2, editable: true },
    {
      field: "image",
      headerName: "Hình ảnh",
      editable: true,
    },
    {
      field: "mapHtml",
      headerName: "Bản đồ",
      editable: true,
    },
  ]);

  const handleCellValueChanged = (params) => {
    const { oldValue, newValue, data, colDef } = params;

    if (oldValue !== newValue) {
      const fieldName = colDef.headerName; // Lấy tên cột
      setChangeInfo(`Cập nhật "${fieldName}" từ "${oldValue}" sang "${newValue}".`);
      setTempData(data); // Lưu dữ liệu chỉnh sửa tạm thời
      setShowModal(true); // Hiển thị modal xác nhận
    }
  };

  const handleConfirm = () => {
    if (tempData) {
      updateLocation(tempData); // Cập nhật dữ liệu khi người dùng xác nhận
    }
    setShowModal(false); // Đóng modal
    setTempData(null); // Xóa dữ liệu tạm thời
    setChangeInfo(""); // Xóa thông tin thay đổi
  };

  const handleClose = () => {
    setShowModal(false); // Đóng modal khi hủy
    setTempData(null); // Xóa dữ liệu tạm thời
    setChangeInfo(""); // Xóa thông tin thay đổi
  };

  if (isLoading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi khi lấy dữ liệu: {error.message}</div>;

  return (
    <>
      <div>
        {/* Ô tìm kiếm Quick Filter */}
        <input
          type="text"
          className="form-control mb-2 w-25"
          placeholder="Tìm kiếm nhanh..."
          onChange={(e) => setQuickFilterText(e.target.value)} // Cập nhật giá trị của quickFilterText
        />
      </div>
      <div
        className="ag-theme-alpine"
        style={{ height: '85vh', width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, resizable: true }}
          onCellValueChanged={handleCellValueChanged} // Lắng nghe sự kiện chỉnh sửa
          pagination={true}
          paginationPageSize={20}
          quickFilterText={quickFilterText} // Áp dụng quick filter
        />
      </div>

      {/* Modal xác nhận */}
      <ConfirmModal
        show={showModal}
        onHide={handleClose}
        onConfirm={handleConfirm}
        title="Xác nhận cập nhật"
        message={changeInfo} // Hiển thị thông tin thay đổi
      />
    </>
  );
}

export default DestinationManagement;
