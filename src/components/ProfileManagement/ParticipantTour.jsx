import '../../assets/css/ProfileManagement/ParticipantTour.css'
import { useState, useEffect } from 'react';
import { Tabs, Tab, Placeholder } from 'react-bootstrap'; // Import Placeholder from react-bootstrap
import TableParticipant from './TableParticipant';
import { fetchParticipants as fetchTourParticipants, changeTourStatus, fetchTourData } from '../../apis/tourApi';
import { toast } from 'react-toastify';

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN');
}
// eslint-disable-next-line react/prop-types
function ParticipantTour({ tourId }) {
    const [isToggled, setIsToggled] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [totalIncomeTransferred, setTotalIncomeTransferred] = useState(0);
    const [tour, setTour] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [loading, setLoading] = useState(true); // Add loading state

    console.log('schedule', schedules);
    
    useEffect(() => {
        const fetchTourDetails = async () => {
            try {
                setLoading(true); // Set loading to true before fetching data
                const tourData = await fetchTourData(tourId);
                setTour(tourData);
                setSchedules(tourData.schedules.$values);
                setSelectedSchedule(tourData.schedules.$values.length > 0 ? tourData.schedules.$values[0].scheduleId : null);
                setIsToggled(tourData.schedules.$values.length > 0 ? tourData.schedules.$values[0].activeStatus : true);
                setTotalIncome(tourData.schedules.$values.reduce((sum, schedule) => {
                    return sum + schedule.participants.$values.reduce((sum, participant) => {
                        return sum + (participant.paymentStatus === 1 ? participant.totalAmount : 0);
                    }, 0);
                }, 0));
            } catch (error) {
                console.error('Error fetching tour details:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchTourDetails();
    }, [tourId]);

    const handleToggle = async () => {
        try {
            await changeTourStatus(selectedSchedule, tourId, !isToggled);
            setIsToggled(!isToggled);
            if (!isToggled) {
                toast.success('Đã bật trạng thái hoạt động');
            } else {
                toast.success('Đã tắt trạng thái hoạt động');
            }
            const tourData = await fetchTourData(tourId);
            setTour(tourData);
            setSchedules(tourData.schedules.$values);
            const updatedSchedule = tourData.schedules.$values.find(schedule => schedule.scheduleId === selectedSchedule);
            setSelectedSchedule(updatedSchedule ? updatedSchedule.scheduleId : null);
            setTotalIncome(tourData.schedules.$values.reduce((sum, schedule) => {
                return sum + schedule.participants.$values.reduce((sum, participant) => {
                    return sum + (participant.paymentStatus === 1 ? participant.totalAmount : 0);
                }, 0);
            }, 0));
        } catch (error) {
            if (error.response.data == 'Access Denied! Tour has participants') {
                toast.error('Tour đã có người không thể tắt trạng thái hoạt động');
                console.error('Tour đã có người không thể tắt trạng thái hoạt động', error);
            }
        }
    };

    const getButtonClass = (schedule) => {
        const currentDate = new Date();
        const startDate = new Date(schedule.startDate);

        if (startDate < currentDate) {
            return 'btn btn-outline-danger';
        } else if (schedule.activeStatus) {
            return 'btn btn-outline-success';
        } else {
            return 'btn btn-outline-secondary';
        }
    };

    const fetchParticipants = async (scheduleId) => {
        try {
            const data = await fetchTourParticipants(scheduleId, tourId);
            setParticipants(data.$values);
            const totalIncome = data.$values
                .filter(p => p.paymentStatus === 1)
                .reduce((sum, participant) => sum + participant.totalAmount, 0);
            setTotalIncomeTransferred(totalIncome);
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const handleScheduleClick = (scheduleId) => {
        const selectedSchedule = schedules.find(schedule => schedule.scheduleId === scheduleId);
        setSelectedSchedule(scheduleId);
        setIsToggled(selectedSchedule.activeStatus);
        fetchParticipants(scheduleId);
    };

    useEffect(() => {
        if(selectedSchedule && schedules.length > 0) {
            fetchParticipants(selectedSchedule);
        } else {
            fetchParticipants(schedules[0]?.scheduleId);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [schedules]);

    const getBadgeCount = (status) => {
        return participants.filter(p => p.paymentStatus === status).length;
    };

    const getBadgeClass = (status) => {
        switch (status) {
            case 1:
                return 'badge bg-success';
            case 0:
                return 'badge bg-warning';
            case 2:
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    {loading ? (
                        <Placeholder as="div" animation="glow">
                            <Placeholder xs={6} />
                            <Placeholder xs={8} />
                            <Placeholder xs={4} />
                        </Placeholder>
                    ) : (
                        <>
                            <h4>{tour.tourName}</h4>
                            <div>
                                <ion-icon name="location-outline"></ion-icon> Địa điểm: {tour.location}
                            </div>
                            <div>
                                <ion-icon name="time-outline"></ion-icon> {tour.numberOfDays}N{tour.numberOfDays - 1 == 0 ? '' : (tour.numberOfDays - 1 + 'Đ')}
                            </div>
                            <div>
                                <ion-icon name="people-outline"></ion-icon> {tour.maxGuests}
                            </div>
                        </>
                    )}
                </div>
                <div className="col-md-6 d-flex gap-4">
                    <div className="card_tourManage">
                        <p>Tổng thu nhập Tour</p>
                        <h3>{loading ? <Placeholder xs={6} /> : formatCurrency(totalIncome)} <sub>VNĐ</sub></h3>
                    </div>

                    <div className="card_tourManage">
                        <p>Tổng thu nhập chuyến đi</p>
                        <h3>{loading ? <Placeholder xs={6} /> : formatCurrency(totalIncomeTransferred)} <sub>VNĐ</sub></h3>
                    </div>
                </div>
            </div>
            <hr />
            <div className='tour_infomation'>
                <div className='schedule_list'>
                    {loading ? (
                        <Placeholder as="div" animation="glow" className="d-flex gap-2">
                            <Placeholder xs={2} />
                            <Placeholder xs={2} />
                            <Placeholder xs={2} />
                        </Placeholder>
                    ) : (
                        schedules?.map((schedule, index) => (
                            <button
                                key={index}
                                className={`d-flex align-items-center gap-2 ${getButtonClass(schedule)} ${selectedSchedule === schedule.scheduleId ? 'active' : ''}`}
                                onClick={() => handleScheduleClick(schedule.scheduleId)}
                            >
                                {new Date(schedule.startDate).toLocaleDateString()} <ion-icon name="people-outline"></ion-icon> {schedule.participants?.$values.length}
                            </button>
                        ))
                    )}
                </div>

                <div className='my-3 d-flex gap-2'>
                    <label className="switch">
                        <input type="checkbox" checked={isToggled} onChange={handleToggle} />
                        <span className="slider round"></span>
                    </label>
                    Trạng thái hoạt động
                </div>

                <div className='participant_table'>
                    <Tabs defaultActiveKey="paid" id="participant-tabs" className='no-border-radius'>
                        <Tab eventKey="paid" title={<span className="d-flex align-items-center gap-2">Đã thanh toán <span className={`d-flex align-items-center gap-2 ${getBadgeClass(1)}`}><ion-icon name="people-outline"></ion-icon> {getBadgeCount(1)}</span></span>}>
                            {loading ? (
                                <Placeholder as="div" animation="glow">
                                    <Placeholder xs={12} />
                                    <Placeholder xs={12} />
                                    <Placeholder xs={12} />
                                </Placeholder>
                            ) : (
                                <TableParticipant participants={participants.filter(p => p.paymentStatus === 1)} tab="paid" />
                            )}
                        </Tab>
                        <Tab eventKey="unpaid" title={<span className="d-flex align-items-center gap-2">Chưa thanh toán <span className={`d-flex align-items-center gap-2 ${getBadgeClass(0)}`}><ion-icon name="people-outline"></ion-icon> {getBadgeCount(0)}</span></span>}>
                            {loading ? (
                                <Placeholder as="div" animation="glow">
                                    <Placeholder xs={12} />
                                    <Placeholder xs={12} />
                                    <Placeholder xs={12} />
                                </Placeholder>
                            ) : (
                                <TableParticipant participants={participants.filter(p => p.paymentStatus === 0)} tab="unpaid" />
                            )}
                        </Tab>
                        <Tab eventKey="refunded" title={<span className="d-flex align-items-center gap-2">Hoàn tiền <span className={`d-flex align-items-center gap-2 ${getBadgeClass(2)}`}><ion-icon name="people-outline"></ion-icon>{getBadgeCount(2)}</span></span>}>
                            {loading ? (
                                <Placeholder as="div" animation="glow">
                                    <Placeholder xs={12} />
                                    <Placeholder xs={12} />
                                    <Placeholder xs={12} />
                                </Placeholder>
                            ) : (
                                <TableParticipant participants={participants.filter(p => p.paymentStatus === 2)} tab="refunded" />
                            )}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ParticipantTour;