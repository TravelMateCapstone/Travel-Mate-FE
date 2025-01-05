import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../assets/css/ProfileManagement/CreateTour.css';
import { createTour } from '../../apis/local_trip_history';
import { Tabs, Tab } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreateTour() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [tourData, setTourData] = useState({
    tourName: "",
    tourDescription: "",
    price: 0,
    location: "",
    maxGuests: 0,
    tourImage: "",
    itinerary: [],
    costDetails: [],
    schedules: [],
    additionalInfo: ""
  });

  useEffect(() => {
    const totalActivityCost = tourData.itinerary.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => dayTotal + parseFloat(activity.activityAmount || 0), 0);
    }, 0);

    const totalCostDetails = tourData.costDetails.reduce((total, cost) => total + parseFloat(cost.amount || 0), 0);

    setTourData({ ...tourData, price: totalActivityCost + totalCostDetails });
  }, [tourData.itinerary, tourData.costDetails]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTourData({ ...tourData, [name]: name === 'maxGuests' ? parseInt(value) : value });
  };

  const handleQuillChange = (value) => {
    setTourData({ ...tourData, additionalInfo: value });
  };

  const handleAddItinerary = () => {
    setTourData({ ...tourData, itinerary: [...tourData.itinerary, { day: 1, activities: [] }] });
  };

  const handleAddActivity = (dayIndex) => {
    const newItinerary = [...tourData.itinerary];
    newItinerary[dayIndex].activities.push({
      startTime: "00:00:00",
      endTime: "00:00:00",
      title: "",
      description: "",
      activityAddress: "",
      activityAmount: 0,
      activityImage: ""
    });
    setTourData({ ...tourData, itinerary: newItinerary });
  };

  const handleAddCostDetail = () => {
    setTourData({ ...tourData, costDetails: [...tourData.costDetails, { title: "", amount: 0, notes: "" }] });
  };

  const handleAddSchedule = () => {
    setTourData({ ...tourData, schedules: [...tourData.schedules, { startDate: "2025-01-10T08:00:00Z", endDate: "2025-01-10T08:00:00Z" }] });
  };

  const handleCreateTour = async () => {
    await createTour(tourData);
  };

  return (
    <div>
      <button className='btn btn-success mb-2' onClick={openModal}>Tạo tour du lịch</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create Tour Modal"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '75%',
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
        <h2 className='text-center' style={{
          height: '50px',
        }}>Tạo Tour</h2>
        <div className='mymodal_body d-flex flex-column gap-3' style={{
          height: 'calc(100% - 100px)',
          overflowY: 'auto'
        }}>
          <div className='row'>

            <div className='col col-6 d-flex flex-column flex-grow-1'>
              <label>Tên tour</label>
              <input type="text" name="tourName" placeholder="Tên tour" value={tourData.tourName} onChange={handleInputChange} />
              <label>Địa điểm</label>
              <input type="text" name="location" placeholder="Địa điểm" value={tourData.location} onChange={handleInputChange} />
              <label>Số khách tối đa</label>
              <input type="number" name="maxGuests" placeholder="Số khách tối đa" value={tourData.maxGuests} onChange={handleInputChange} />
              <label>Mô tả tour</label>
              <textarea name="tourDescription" placeholder="Mô tả tour" value={tourData.tourDescription} onChange={handleInputChange}></textarea>
            </div>
            <div className='col col-6 d-flex flex-column flex-grow-1 img'>
              <label>Hình ảnh tour</label>
              <input type="text" name="tourImage" placeholder="Hình ảnh tour" value={tourData.tourImage} onChange={handleInputChange} />
              <img src={tourData.tourImage} alt="ảnh tour" className='w-100'/>
              <div>
                Giá: {tourData.price}
              </div>
            </div>
          </div>

          <div>
            <h5 className='text-uppercase fw-bold'>Lịch trình diễn ra</h5>
            <button onClick={handleAddSchedule}>Thêm lịch trình</button>
            {tourData.schedules.map((schedule, scheduleIndex) => (
              <div key={scheduleIndex}>
                <input type="datetime-local" placeholder="Ngày bắt đầu" value={schedule.startDate} onChange={(e) => {
                  const newSchedules = [...tourData.schedules];
                  newSchedules[scheduleIndex].startDate = e.target.value;
                  setTourData({ ...tourData, schedules: newSchedules });
                }} />
                <input type="datetime-local" placeholder="Ngày kết thúc" value={schedule.endDate} onChange={(e) => {
                  const newSchedules = [...tourData.schedules];
                  newSchedules[scheduleIndex].endDate = e.target.value;
                  setTourData({ ...tourData, schedules: newSchedules });
                }} />
              </div>
            ))}
          </div>

          <Tabs defaultActiveKey="itinerary" id="uncontrolled-tab-example" className="mb-3 no-border-radius">
            <Tab eventKey="itinerary" title="Lịch trình cụ thể">
              <div>
                <button onClick={handleAddItinerary}>Thêm lịch trình</button>
                {tourData.itinerary.map((day, dayIndex) => (
                  <div key={dayIndex}>
                    <h3>Ngày {dayIndex + 1}</h3>
                    <button onClick={() => handleAddActivity(dayIndex)}>Thêm hoạt động</button>
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex}>
                        <input type="text" placeholder="Tiêu đề hoạt động" value={activity.title} onChange={(e) => {
                          const newItinerary = [...tourData.itinerary];
                          newItinerary[dayIndex].activities[activityIndex].title = e.target.value;
                          setTourData({ ...tourData, itinerary: newItinerary });
                        }} />
                        <input type="text" placeholder="Mô tả hoạt động" value={activity.description} onChange={(e) => {
                          const newItinerary = [...tourData.itinerary];
                          newItinerary[dayIndex].activities[activityIndex].description = e.target.value;
                          setTourData({ ...tourData, itinerary: newItinerary });
                        }} />
                        <input type="text" placeholder="Địa chỉ hoạt động" value={activity.activityAddress} onChange={(e) => {
                          const newItinerary = [...tourData.itinerary];
                          newItinerary[dayIndex].activities[activityIndex].activityAddress = e.target.value;
                          setTourData({ ...tourData, itinerary: newItinerary });
                        }} />
                        <input type="number" placeholder="Chi phí hoạt động" value={activity.activityAmount} onChange={(e) => {
                          const newItinerary = [...tourData.itinerary];
                          newItinerary[dayIndex].activities[activityIndex].activityAmount = parseInt(e.target.value);
                          setTourData({ ...tourData, itinerary: newItinerary });
                        }} />
                        <input type="text" placeholder="Hình ảnh hoạt động" value={activity.activityImage} onChange={(e) => {
                          const newItinerary = [...tourData.itinerary];
                          newItinerary[dayIndex].activities[activityIndex].activityImage = e.target.value;
                          setTourData({ ...tourData, itinerary: newItinerary });
                        }} />
                        <input type="time" placeholder="Thời gian bắt đầu" value={activity.startTime} onChange={(e) => {
                          const newItinerary = [...tourData.itinerary];
                          newItinerary[dayIndex].activities[activityIndex].startTime = e.target.value + ":00";
                          setTourData({ ...tourData, itinerary: newItinerary });
                        }} />
                        <input type="time" placeholder="Thời gian kết thúc" value={activity.endTime} onChange={(e) => {
                          const newItinerary = [...tourData.itinerary];
                          newItinerary[dayIndex].activities[activityIndex].endTime = e.target.value + ":00";
                          setTourData({ ...tourData, itinerary: newItinerary });
                        }} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Tab>
            <Tab eventKey="cost" title="Chi phí">
              <div>
                <button onClick={handleAddCostDetail}>Thêm chi phí</button>
                {tourData.costDetails.map((cost, costIndex) => (
                  <div key={costIndex}>
                    <input type="text" placeholder="Tiêu đề chi phí" value={cost.title} onChange={(e) => {
                      const newCostDetails = [...tourData.costDetails];
                      newCostDetails[costIndex].title = e.target.value;
                      setTourData({ ...tourData, costDetails: newCostDetails });
                    }} />
                    <input type="number" placeholder="Số tiền" value={cost.amount} onChange={(e) => {
                      const newCostDetails = [...tourData.costDetails];
                      newCostDetails[costIndex].amount = parseInt(e.target.value);
                      setTourData({ ...tourData, costDetails: newCostDetails });
                    }} />
                    <input type="text" placeholder="Ghi chú" value={cost.notes} onChange={(e) => {
                      const newCostDetails = [...tourData.costDetails];
                      newCostDetails[costIndex].notes = e.target.value;
                      setTourData({ ...tourData, costDetails: newCostDetails });
                    }} />
                  </div>
                ))}
              </div>
            </Tab>
            <Tab eventKey="additionalInfo" title="Thông tin thêm">
              <div>
                <ReactQuill style={{
                  height: '250px',
                  backgroundColor: 'white',
                  color: 'black',
                }} value={tourData.additionalInfo} onChange={handleQuillChange} />
              </div>
            </Tab>
          </Tabs>
        </div>
        <div className="modal-footer" style={{
          height: '50px',
        }}>
          <button className='btn btn-secondary' onClick={closeModal}>Đóng</button>
          <button className='btn btn-success' onClick={handleCreateTour}>Tạo tour</button>
        </div>
      </Modal>
    </div>
  );
}

export default CreateTour;