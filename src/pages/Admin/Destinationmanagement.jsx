import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import axios from "axios";
import ConfirmModal from "../../components/Shared/ConfirmModal";
import { toast } from "react-toastify";
import { Modal, Button } from "react-bootstrap";
import TextareaAutosize from 'react-textarea-autosize';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function DestinationManagement() {
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false); // State to control add location modal
  const [tempData, setTempData] = useState(null); // Lưu dữ liệu tạm thời khi chỉnh sửa
  const [changeInfo, setChangeInfo] = useState(""); // Thông tin thay đổi (giá trị cũ -> giá trị mới)
  const [quickFilterText, setQuickFilterText] = useState(""); // Lưu giá trị của quick filter
  const [newLocation, setNewLocation] = useState({
    locationName: "",
    title: "",
    description: "",
    image: "",
    mapHtml: ""
  });
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image file

  const queryClient = useQueryClient();

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

  const addLocation = async (location) => {
    const response = await axios.post("https://travelmateapp.azurewebsites.net/api/Locations", location);
    return response.data;
  };

  const mutation = useMutation(addLocation, {
    onSuccess: () => {
      queryClient.invalidateQueries("locations");
      toast.success("Thêm địa điểm thành công!");
    },
    onError: () => {
      toast.error("Thêm địa điểm thất bại. Vui lòng thử lại.");
    }
  });

  const handleAddLocation = async () => {
    if (selectedImage) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      await uploadBytes(storageRef, selectedImage);
      const imageUrl = await getDownloadURL(storageRef);
      newLocation.image = imageUrl;
    }
    mutation.mutate(newLocation);
    setNewLocation({
      locationName: "",
      title: "",
      description: "",
      image: "",
      mapHtml: ""
    });
    setSelectedImage(null); // Clear the selected image
    setShowAddModal(false); // Close the add location modal
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
      <div className="d-flex justify-content-between align-items-center">
        <input
          type="text"
          className="form-control mb-2 w-25"
          placeholder="Tìm kiếm nhanh..."
          onChange={(e) => setQuickFilterText(e.target.value)} // Cập nhật giá trị của quickFilterText
        />
        <div>
          <Button onClick={() => setShowAddModal(true)}>Thêm địa điểm</Button>
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Thêm địa điểm mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <input
                type="text"
                placeholder="Tên địa điểm"
                className="form-control mb-2"
                value={newLocation.locationName}
                onChange={(e) => setNewLocation({ ...newLocation, locationName: e.target.value })}
              />
              <input
                type="text"
                placeholder="Tiêu đề"
                className="form-control mb-2"
                value={newLocation.title}
                onChange={(e) => setNewLocation({ ...newLocation, title: e.target.value })}
              />
              <input
                type="text"
                placeholder="Bản đồ"
                className="form-control mb-2"
                value={newLocation.mapHtml}
                onChange={(e) => setNewLocation({ ...newLocation, mapHtml: e.target.value })}
              />
               <div className="mb-2">
                <button className="btn btn-outline-primary" style={{
                  marginLeft: "-213px",
                }} onClick={() => document.getElementById('admin_upload_image_destination').click()}>Nhấp vào đây để upload</button>
                <input
                  id="admin_upload_image_destination"
                  type="file"
                  className="form-control mb-2 d-none"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                />
              </div>
              <TextareaAutosize
                placeholder="Mô tả"
                className="form-control mb-2"
                minRows={5}
                value={newLocation.description}
                onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                Hủy
              </Button>
              <Button variant="primary" onClick={handleAddLocation}>
                Thêm địa điểm
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
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
