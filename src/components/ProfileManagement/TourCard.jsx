/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/Tour/TourCard.css";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { deleteTour } from "../../apis/local_trip_history";
import Modal from "react-modal"; // Import react-modal

Modal.setAppElement('#root'); // Set the app element for accessibility

function TourCard({ tour }) {
    const [showModal, setShowModal] = useState(false);

    const handleDelete = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tour này không?")) {
            await deleteTour(tour.tourId);
        }
    };

    const handleEdit = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <div className="card mb-3 tour-card">
            <div className="row g-0">
                <div className="col-md-2">
                    <img
                        src={tour.tourImage}
                        alt={tour.tourName}
                        className="img-fluid rounded-start"
                        style={{
                            maxHeight: "200px",
                        }}
                    />
                </div>
                <div className="col-md-10 d-flex align-items-center">
                    <div className="card-body flex-grow-1">
                        <h5 className="card-title">{tour.tourName}</h5>
                        <p className="card-text">{tour.tourDescription}</p>
                        <div className="card-text">
                            <small className="text-muted">
                                Địa điểm: {tour.location} | Giá: {tour.price.toLocaleString()}₫
                            </small>
                        </div>
                    </div>
                    <div className="d-flex align-items-center border-1 h-100 px-2" style={{
                        border: "1px solid #ddd",
                    }}>
                        <Dropdown>
                            <Dropdown.Toggle
                                variant=""
                            >
                                <ion-icon
                                    name="settings-outline"
                                    style={{ fontSize: "24px", color: "black" }}
                                ></ion-icon>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item >Xem chi tiết</Dropdown.Item>
                                <Dropdown.Item onClick={handleEdit}>Chỉnh sửa</Dropdown.Item>
                                <Dropdown.Item >Quản lý</Dropdown.Item>
                                <Dropdown.Item onClick={handleDelete}>Xóa</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onRequestClose={handleClose}
                contentLabel="Chỉnh sửa tour"
            >
                <h2 style={{
                    height: "50px",
                }}>Chỉnh sửa tour</h2>
                <div style={{
                    height: "calc(100% - 100px)",
                    overflowY: "auto",
                }}>
                    {/* Form chỉnh sửa tour */}
                    
                </div>
                <div style={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                }}>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary">
                        Lưu thay đổi
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default TourCard;
