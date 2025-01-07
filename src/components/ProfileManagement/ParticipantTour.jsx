import '../../assets/css/ProfileManagement/ParticipantTour.css'
import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import TableParticipant from './TableParticipant';

function ParticipantTour() {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled(!isToggled);
    };

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
                        <h3>10.000.000 <sub>VNĐ</sub></h3>
                    </div>

                    <div className="card_tourManage">
                        <p>Tổng thu nhập chuyển</p>
                        <h3>10.000.000 <sub>VNĐ</sub></h3>
                    </div>
                </div>
            </div>
            <hr />
            <div className='tour_infomation'>
                <div className='schedule_list'>
                    <button className='d-flex align-items-center gap-2 btn btn-outline-danger'>
                        04/11 <ion-icon name="people-outline"></ion-icon> 5
                    </button>
                    <button className='d-flex align-items-center gap-2 btn btn-outline-success'>
                        04/11 <ion-icon name="people-outline"></ion-icon> 5
                    </button>
                    <button className='d-flex align-items-center gap-2 btn btn-outline-warning'>
                        04/11 <ion-icon name="people-outline"></ion-icon> 5
                    </button>
                    <button className='d-flex align-items-center gap-2 btn btn-outline-warning'>
                        04/11 <ion-icon name="people-outline"></ion-icon> 5
                    </button>
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
                            <TableParticipant />
                        </Tab>
                        <Tab eventKey="unpaid" title="Chưa thanh toán">
                            <TableParticipant />
                        </Tab>
                    </Tabs>
                </div>
            </div>

        </div>
    )
}

export default ParticipantTour