import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../../assets/css/ProfileManagement/CreateTour.css';
import { createTour } from '../../apis/local_trip_history';
import { Tabs, Tab, Accordion, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TextareaAutosize from 'react-textarea-autosize';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';

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
  const [isCreating, setIsCreating] = useState(false);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTourData({ ...tourData, tourImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleActivityFileChange = (e, dayIndex, activityIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItinerary = [...tourData.itinerary];
        newItinerary[dayIndex].activities[activityIndex].activityImage = reader.result;
        setTourData({ ...tourData, itinerary: newItinerary });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTour = async () => {
    setIsCreating(true);
    const uploadImage = async (imageData, path) => {
      const storageRef = ref(storage, path);
      await uploadString(storageRef, imageData, 'data_url');
      return await getDownloadURL(storageRef);
    };

    const tourImageUrl = await uploadImage(tourData.tourImage, `tours/${tourData.tourName}/tourImage`);
    const itinerary = await Promise.all(tourData.itinerary.map(async (day, dayIndex) => {
      const activities = await Promise.all(day.activities.map(async (activity, activityIndex) => {
        if (activity.activityImage) {
          const activityImageUrl = await uploadImage(activity.activityImage, `tours/${tourData.tourName}/day${dayIndex + 1}/activity${activityIndex + 1}`);
          return { ...activity, activityImage: activityImageUrl };
        }
        return activity;
      }));
      return { ...day, activities };
    }));

    const updatedTourData = { ...tourData, tourImage: tourImageUrl, itinerary };
    await createTour(updatedTourData);
    setIsCreating(false);
  };

  const handleDeleteItinerary = (dayIndex) => {
    const newItinerary = tourData.itinerary.filter((_, index) => index !== dayIndex);
    setTourData({ ...tourData, itinerary: newItinerary });
  };

  const handleDeleteActivity = (dayIndex, activityIndex) => {
    const newItinerary = [...tourData.itinerary];
    newItinerary[dayIndex].activities = newItinerary[dayIndex].activities.filter((_, index) => index !== activityIndex);
    setTourData({ ...tourData, itinerary: newItinerary });
  };

  const handleDeleteCostDetail = (costIndex) => {
    const newCostDetails = tourData.costDetails.filter((_, index) => index !== costIndex);
    setTourData({ ...tourData, costDetails: newCostDetails });
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
              <TextareaAutosize minRows={3} name="tourDescription" placeholder="Mô tả tour" value={tourData.tourDescription} onChange={handleInputChange} />
            </div>
            <div className='col col-6 d-flex flex-column flex-grow-1 img'>
              <label>Hình ảnh tour</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <img src={tourData.tourImage} alt="ảnh tour" className='w-100' />
              <div>
                Giá: {tourData.price.toLocaleString()} ₫
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
                <button onClick={handleAddItinerary}>Thêm lịch trình cụ thể</button>
                <Accordion defaultActiveKey="0">
                  {tourData.itinerary.map((day, dayIndex) => (
                    <Accordion.Item eventKey={dayIndex.toString()} key={dayIndex}>
                      <Accordion.Header>
                        Ngày {dayIndex + 1}
                        <button style={{ marginLeft: '10px' }} onClick={() => handleDeleteItinerary(dayIndex)}>Xóa lịch trình cụ thể</button>
                      </Accordion.Header>
                      <Accordion.Body>
                        <button onClick={() => handleAddActivity(dayIndex)}>Thêm hoạt động</button>
                        {day.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className='row'>
                            <div className='col col-6 d-flex flex-column gap-2'>
                              <label>Tiêu đề hoạt động</label>
                              <input type="text" placeholder="Tiêu đề hoạt động" value={activity.title} onChange={(e) => {
                                const newItinerary = [...tourData.itinerary];
                                newItinerary[dayIndex].activities[activityIndex].title = e.target.value;
                                setTourData({ ...tourData, itinerary: newItinerary });
                              }} />

                              <label>Địa chỉ hoạt động</label>
                              <input type="text" placeholder="Địa chỉ hoạt động" value={activity.activityAddress} onChange={(e) => {
                                const newItinerary = [...tourData.itinerary];
                                newItinerary[dayIndex].activities[activityIndex].activityAddress = e.target.value;
                                setTourData({ ...tourData, itinerary: newItinerary });
                              }} />
                              <div className='d-flex gap-2'>
                                <div className='d-flex flex-column gap-2'>
                                  <label>Thời gian bắt đầu</label>
                                  <input type="time" placeholder="Thời gian bắt đầu" value={activity.startTime} onChange={(e) => {
                                    const newItinerary = [...tourData.itinerary];
                                    newItinerary[dayIndex].activities[activityIndex].startTime = e.target.value + ":00";
                                    setTourData({ ...tourData, itinerary: newItinerary });
                                  }} />
                                </div>
                                <div className='d-flex flex-column gap-2'>
                                  <label>Thời gian kết thúc</label>
                                  <input type="time" placeholder="Thời gian kết thúc" value={activity.endTime} onChange={(e) => {
                                    const newItinerary = [...tourData.itinerary];
                                    newItinerary[dayIndex].activities[activityIndex].endTime = e.target.value + ":00";
                                    setTourData({ ...tourData, itinerary: newItinerary });
                                  }} />
                                </div>
                                <div className='d-flex flex-column gap-2'>
                                  <label>Chi phí hoạt động</label>
                                  <input type="number" placeholder="Chi phí hoạt động" value={activity.activityAmount} onChange={(e) => {
                                    const newItinerary = [...tourData.itinerary];
                                    newItinerary[dayIndex].activities[activityIndex].activityAmount = parseInt(e.target.value);
                                    setTourData({ ...tourData, itinerary: newItinerary });
                                  }} />
                                </div>
                              </div>
                              <label>Mô tả hoạt động</label>
                              <TextareaAutosize minRows={2} placeholder="Mô tả hoạt động" value={activity.description} onChange={(e) => {
                                const newItinerary = [...tourData.itinerary];
                                newItinerary[dayIndex].activities[activityIndex].description = e.target.value;
                                setTourData({ ...tourData, itinerary: newItinerary });
                              }} />
                            </div>
                            <div className='col col-6 d-flex flex-column gap-2'>
                              <label>Hình ảnh hoạt động</label>
                              <input type="file" accept="image/*" onChange={(e) => handleActivityFileChange(e, dayIndex, activityIndex)} />
                              {activity.activityImage && <img src={activity.activityImage} alt="ảnh hoạt động" className='w-100' />}
                            </div>
                            <div className='my-3'>
                              <button style={{
                                width: 'fit-content',
                              }} onClick={() => handleDeleteActivity(dayIndex, activityIndex)}>Xóa hoạt động</button>

                            </div>
                            <hr />
                          </div>
                        ))}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </div>
            </Tab>
            <Tab eventKey="cost" title="Chi phí">
              <div>
                <button className='mb-3' onClick={handleAddCostDetail}>Thêm chi phí</button>
                {tourData.costDetails.map((cost, costIndex) => (
                  <div key={costIndex} className='mb-3 d-flex gap-2'>
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
                    <button onClick={() => handleDeleteCostDetail(costIndex)}>Xóa chi phí</button>
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
          <button className='btn btn-success' onClick={handleCreateTour} disabled={isCreating}>
            {isCreating && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
            {isCreating ? ' Đang tạo...' : 'Tạo tour'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default CreateTour;