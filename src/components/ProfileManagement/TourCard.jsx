/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/Tour/TourCard.css";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { deleteTour } from "../../apis/local_trip_history";
import Modal from "react-modal"; // Import react-modal
import UpdateTour from "./UpdateTour";
import { Spinner } from "react-bootstrap";
import ParticipantTour from "./ParticipantTour";

Modal.setAppElement('#root'); // Set the app element for accessibility

function TourCard({ tour }) {
    const [showModal, setShowModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showManageModal, setShowManageModal] = useState(false); // New state for manage modal

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

    const handleManage = () => {
        setShowManageModal(true);
    };

    const handleManageClose = () => {
        setShowManageModal(false);
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
                                <Dropdown.Item onClick={handleManage}>Quản lý</Dropdown.Item>
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
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                }}
            >
                <h2 style={{
                    height: "50px",
                }}>Chỉnh sửa tour</h2>
                <div style={{
                    height: "calc(100% - 100px)",
                    overflowY: "auto",
                }}>
                    <UpdateTour tour={tour} onClose={handleClose} isCreating={isCreating} setIsCreating={setIsCreating} />
                </div>
                <div style={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="success" onClick={() => document.getElementById('updateTourButton').click()} disabled={isCreating}>
                        {isCreating && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
                        {isCreating ? ' Đang cập nhật...' : 'Cập nhật tour'}
                    </Button>
                </div>
            </Modal>
            <Modal
                isOpen={showManageModal}
                onRequestClose={handleManageClose}
                contentLabel="Quản lý tour"
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: '85%',
                        height: '800px',
                        overflowY: 'auto',
                        backgroundColor: 'white',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                }}
            >
                <h2 style={{
                    height: "50px",
                }}>Quản lý tour</h2>
                <div style={{
                    height: "calc(100% - 100px)",
                    overflowY: "auto",
                }}>
                    <ParticipantTour />
                </div>
                <div style={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "end",
                    alignItems: "center",
                    gap: "10px",
                }}>
                    <Button variant="secondary" onClick={handleManageClose}>
                        Đóng
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default TourCard;
