import '../../assets/css/Tour/TourCard.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchTour } from '../../redux/actions/tourActions';
import { useNavigate } from 'react-router-dom';
import RoutePath from '../../routes/RoutePath';
import PropTypes from 'prop-types';

function TourCard({ tour }) {
    const disPatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const navigate = useNavigate();

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                stars.push(<ion-icon key={i} name="star" style={{ color: 'yellow' }}></ion-icon>);
            } else {
                stars.push(<ion-icon key={i} name="star-outline" style={{ color: 'black' }}></ion-icon>);
            }
        }
        return stars;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const formatDaysNights = (days, nights) => {
        if (days === 0 && nights === -1) {
            return '1 ngày, 0 đêm';
        }
        return `${days + 1} ngày, ${nights + 1} đêm`;
    };

    const handleTourClick = () => {
        disPatch(fetchTour(tour.TourId, token));
        navigate(RoutePath.TOUR_DETAIL);
    };

    const formatDateToVietnamese = (date) => {
        const parsedDate = new Date(date); // Chuyển chuỗi date về dạng Date object
        const day = String(parsedDate.getUTCDate()).padStart(2, '0'); // Lấy ngày theo UTC
        const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0'); // Lấy tháng theo UTC (cộng thêm 1)
        return `${day}/${month}`;
    };

    return (
        <div className='tour_card_component d-flex justify-content-between gap-3' onClick={handleTourClick} style={{ transition: 'background-color 0.3s, box-shadow 0.3s', marginBottom: '30px' }}>
            <img src={tour.TourImage} alt={tour.TourName} width={322} height={210} className='rounded-3' />
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '10px',
            }}>
                <div className='d-flex justify-content-between w-100 pe-3' style={{}}>
                    <div style={{
                        height: '70%',
                    }}>
                        <h5 className='mb-3' style={{
                            fontWeight: '550'
                        }}>{tour.TourName}</h5>
                        <p className='mb-1 fw-medium'><ion-icon name="location-outline"></ion-icon> {tour.Location}</p>
                        <p className='mb-1 fw-medium'><ion-icon name="time-outline"></ion-icon> {formatDaysNights(tour.NumberOfDays, tour.NumberOfNights)}</p>
                        <div className='fw-medium d-flex align-items-center' style={{
                            marginBottom: '12px',
                            gap: '10px'
                        }}>
                            <ion-icon name="calendar-outline"></ion-icon>
                            <p className='m-0'>Ngày khởi hành:</p>
                            <div className='d-flex flex-wrap gap-2'>
                                {tour.StartDates.map((date, index) => (
                                    <p key={index} style={{
                                        border: '1px solid green',
                                        borderRadius: '5px',
                                        padding: '5px 10px',
                                        textAlign: 'center',
                                        margin: '0'
                                    }}>
                                        {formatDateToVietnamese(date)}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <p className='mb-4' style={{ display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, overflow: 'hidden' }}>{tour.TourDescription}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-end'>
                        <div className='fw-medium text-success'>
                            <h5 className='mb-3 fw-bold'>{formatPrice(tour.Price)}</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className='d-flex flex-column justify-content-center'>
                <div style={{
                    width: '322px',
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: '2px',
                    borderLeft: '1px solid #e0e0e0',
                }}>
                    <img src={tour.User.Profile.ImageUser || 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} className='rounded-5 mb-2' alt="" width={50} height={50} />

                    <div className='d-flex flex-column align-items-center mb-2'>
                        <h5 className='m-0'>{tour.User.FullName}</h5>
                        <small>{tour.User.LocationIds[0]}</small>
                    </div>

                    <div className='d-flex align-items-center flex-column'>
                        <div>{renderStars(tour.User.Star)}</div>
                        <p className='m-0'>{tour.User.CountConnect} chuyến đi</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
TourCard.propTypes = {
    tour: PropTypes.shape({
        TourId: PropTypes.string.isRequired,
        TourImage: PropTypes.string.isRequired,
        TourName: PropTypes.string.isRequired,
        Location: PropTypes.string.isRequired,
        NumberOfDays: PropTypes.number.isRequired,
        NumberOfNights: PropTypes.number.isRequired,
        StartDates: PropTypes.arrayOf(PropTypes.string).isRequired,
        TourDescription: PropTypes.string.isRequired,
        Price: PropTypes.number.isRequired,
        User: PropTypes.shape({
            Profile: PropTypes.shape({
                ImageUser: PropTypes.string,
            }),
            FullName: PropTypes.string.isRequired,
            LocationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
            Star: PropTypes.number.isRequired,
            CountConnect: PropTypes.number.isRequired,
        }).isRequired,
    }).isRequired,
};

export default TourCard;
