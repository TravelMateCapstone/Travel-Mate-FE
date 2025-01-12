import '../../assets/css/ProfileManagement/ParticipantTour.css'
import { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import TableParticipant from './TableParticipant';
import { fetchParticipants as fetchTourParticipants, changeTourStatus, fetchTourData } from '../../apis/tourApi';
import { toast } from 'react-toastify';

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN');
}

function ParticipantTour({ tourId }) {
    const [isToggled, setIsToggled] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [totalIncomeTransferred, setTotalIncomeTransferred] = useState(0);
    const [tour, setTour] = useState({});
    const [schedules, setSchedules] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);

    console.log('schedule', schedules);
    

    useEffect(() => {
        const fetchTourDetails = async () => {
            try {
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
    }, [schedules]);


    return (
        <div>
            <div className="row">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6 d-flex gap-4">
                    <div className="card_tourManage">
                        <p>Tổng thu nhập Tour</p>
                        <h3>{formatCurrency(totalIncome)} <sub>VNĐ</sub></h3>
                    </div>

                    <div className="card_tourManage">
                        <p>Tổng thu nhập chuyến đi</p>
                        <h3>{formatCurrency(totalIncomeTransferred)} <sub>VNĐ</sub></h3>
                    </div>
                </div>
            </div>
            <hr />
            <div className='tour_infomation'>
                <div className='schedule_list'>
                    {schedules?.map((schedule, index) => (
                        <button
                            key={index}
                            className={`d-flex align-items-center gap-2 ${getButtonClass(schedule)} ${selectedSchedule === schedule.scheduleId ? 'active' : ''}`}
                            onClick={() => handleScheduleClick(schedule.scheduleId)}
                        >
                            {new Date(schedule.startDate).toLocaleDateString()} <ion-icon name="people-outline"></ion-icon> {schedule.participants?.$values.length}
                        </button>
                    ))}
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
                        <Tab eventKey="paid" title="Đã thanh toán">
                            <TableParticipant participants={participants.filter(p => p.paymentStatus === 1)} />
                        </Tab>
                        <Tab eventKey="unpaid" title="Chưa thanh toán">
                            <TableParticipant participants={participants.filter(p => p.paymentStatus === 0)} />
                        </Tab>
                        <Tab eventKey="refunded" title="Hoàn tiền">
                            <TableParticipant participants={participants.filter(p => p.paymentStatus === 2)} />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ParticipantTour;