import '../../assets/css/ProfileManagement/ParticipantTour.css'
import { useState, useEffect } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import TableParticipant from './TableParticipant';
import { fetchParticipants as fetchTourParticipants } from '../../apis/tourApi';

function formatCurrency(amount) {
    return amount.toLocaleString('vi-VN');
}

// eslint-disable-next-line react/prop-types
function ParticipantTour( {tourId, schedules, totalIncome} ) {
    const [isToggled, setIsToggled] = useState(true);
    const [participants, setParticipants] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(schedules.length > 0 ? schedules[0].scheduleId : null);
    const [totalIncomeTransferred, setTotalIncomeTransferred] = useState(0);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

    const getButtonClass = (schedule) => {
        const currentDate = new Date();
        const endDate = new Date(schedule.endDate);

        if (endDate < currentDate) {
            return 'btn btn-outline-danger';
        } else if (schedule.activeStatus) {
            return 'btn btn-outline-success';
        } else {
            return 'btn btn-outline-warning';
        }
    };

    const fetchParticipants = async (scheduleId) => {
        try {
            const data = await fetchTourParticipants(scheduleId, tourId);
            setParticipants(data.$values);
            console.log('participants', data.$values);

            // Calculate total income transferred
            const totalIncome = data.$values
                .filter(p => p.paymentStatus === 1)
                .reduce((sum, participant) => sum + participant.totalAmount, 0);
            setTotalIncomeTransferred(totalIncome);
            
        } catch (error) {
            console.error('Error fetching participants:', error);
        }
    };

    const handleScheduleClick = (scheduleId) => {
        setSelectedSchedule(scheduleId);
        fetchParticipants(scheduleId);
    };

    useEffect(() => {
        if (schedules.length > 0) {
            fetchParticipants(schedules[0].scheduleId); // Fetch participants for the first schedule by default
        }
    }, [schedules]);

    console.log('selectedSchedule', selectedSchedule);
    
    

    return (
        <div>
            <div className="row">
                <div className="col-md-6">
                    <h4>Tour du lịch tình nguyện Lô Lô Chải</h4>
                    <div>
                        <ion-icon name="location-outline"></ion-icon> Địa điểm: Hà Giang
                    </div>
                    <div>
                        <ion-icon name="time-outline"></ion-icon> 2N1Đ
                    </div>
                    <div>
                        <ion-icon name="people-outline"></ion-icon> 10
                    </div>
                </div>
                <div className="col-md-6 d-flex gap-4">
                    <div className="card_tourManage">
                        <p>Tổng thu nhập Tour</p>
                        <h3>{formatCurrency(totalIncome)} <sub>VNĐ</sub></h3>
                    </div>

                    <div className="card_tourManage">
                        <p>Tổng thu nhập chuyển</p>
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
                            {new Date(schedule.startDate).toLocaleDateString()} <ion-icon name="people-outline"></ion-icon> {schedule.participants.length}
                        </button>
                    ))}
                </div>

                <div className='mt-2 d-flex gap-2'>
                    <label className="switch">
                        <input type="checkbox" checked={isToggled} onChange={handleToggle} />
                        <span className="slider round"></span>
                    </label>
                    Hoạt động
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

export default ParticipantTour