/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/Tour/TourCard.css";
import Dropdown from "react-bootstrap/Dropdown";
import { deleteTour } from "../../apis/local_trip_history";

function TourCard({ tour }) {
    const handleDelete = async () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tour này không?")) {
            await deleteTour(tour.tourId);
        }
    };

    return (
        <div className="card mb-3 tour-card">
            <div className="row g-0">
                <div className="col-md-4">
                    <img
                        src={tour.tourImage}
                        alt={tour.tourName}
                        className="img-fluid rounded-start"
                    />
                </div>
                <div className="col-md-8 d-flex align-items-center">
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
                                <Dropdown.Item >Chỉnh sửa</Dropdown.Item>
                                <Dropdown.Item >Quản lý</Dropdown.Item>
                                <Dropdown.Item onClick={handleDelete}>Xóa</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TourCard;
