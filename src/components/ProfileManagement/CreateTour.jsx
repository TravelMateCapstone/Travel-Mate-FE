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
import { getUserLocation } from '../../apis/profileApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateTour({ onTourCreated }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [tourData, setTourData] = useState({
    tourName: "",
    tourDescription: "",
    price: 0,
    location: "",
    maxGuests: 0,
    numberOfDays: 0,
    tourImage: "",
    itinerary: [],
    costDetails: [],
    schedules: [],
    additionalInfo: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const [locations, setLocations] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      const locationsData = await getUserLocation();
      setLocations(locationsData);
      if (locationsData?.$values.length > 0) {
        setTourData((prevData) => ({
          ...prevData,
          location: locationsData.$values[0].location.locationName,
        }));
      }
    };
    fetchLocations();
  }, [])

  useEffect(() => {
    const totalActivityCost = tourData.itinerary.reduce((total, day) => {
      return total + day.activities.reduce((dayTotal, activity) => dayTotal + parseFloat(activity.activityAmount || 0), 0);
    }, 0);

    const totalCostDetails = tourData.costDetails.reduce((total, cost) => total + parseFloat(cost.amount || 0), 0);

    setTourData({ ...tourData, price: totalActivityCost + totalCostDetails });
    console.log(tourData);

  }, [tourData.itinerary, tourData.costDetails]);

  useEffect(() => {
    const newItinerary = [];
    for (let i = 0; i < duration; i++) {
      if (tourData.itinerary[i]) {
        newItinerary.push(tourData.itinerary[i]);
      } else {
        newItinerary.push({ day: i + 1, activities: [] });
      }
    }
    setTourData({ ...tourData, itinerary: newItinerary });
  }, [duration]);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'maxNumberOfDay') {
      setDuration(parseInt(value));
      setTourData({ ...tourData, numberOfDays: parseInt(value) });
    } else {
      setTourData({ ...tourData, [name]: name === 'maxGuests' ? parseInt(value) : value });
    }
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
    if (duration > 0) {
      if (tourData.schedules.length > 0) {
        const lastSchedule = tourData.schedules[tourData.schedules.length - 1];
        const lastEndDate = new Date(lastSchedule.endDate);
        const newStartDate = new Date(lastEndDate);
        newStartDate.setDate(lastEndDate.getDate() + 1);
        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newStartDate.getDate() + parseInt(duration));
        setTourData({ ...tourData, schedules: [...tourData.schedules, { startDate: newStartDate.toISOString().slice(0, 16), endDate: newEndDate.toISOString().slice(0, 16) }] });
      } else {
        const newStartDate = new Date();
        const newEndDate = new Date(newStartDate);
        newEndDate.setDate(newStartDate.getDate() + parseInt(duration));
        setTourData({ ...tourData, schedules: [...tourData.schedules, { startDate: newStartDate.toISOString().slice(0, 16), endDate: newEndDate.toISOString().slice(0, 16) }] });
      }
    } else {
      toast.error("Vui lòng nhập số ngày đi trước khi thêm lịch trình.");
    }
  };

  const isScheduleOverlapping = (newSchedule, schedules) => {
    const newStart = new Date(newSchedule.startDate);
    const newEnd = new Date(newSchedule.endDate);

    return schedules.some(schedule => {
      const start = new Date(schedule.startDate);
      const end = new Date(schedule.endDate);
      return (newStart < end && newEnd > start);
    });
  };

  const handleScheduleChange = (e, scheduleIndex) => {
    const { name, value } = e.target;
    const newSchedules = [...tourData.schedules];
    newSchedules[scheduleIndex][name] = value;

    if (name === "startDate" && duration > 0) {
      const startDate = new Date(value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + parseInt(duration));
      newSchedules[scheduleIndex].endDate = endDate.toISOString().slice(0, 16);
    }

    if (isScheduleOverlapping(newSchedules[scheduleIndex], newSchedules.filter((_, index) => index !== scheduleIndex))) {
      toast.error("Lịch trình này bị trùng với lịch trình khác.");
      return;
    }

    setTourData({ ...tourData, schedules: newSchedules });
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

  const handleFileButtonClick = () => {
    document.getElementById('tourImageInput').click();
  };

  const handleActivityFileButtonClick = (dayIndex, activityIndex) => {
    document.getElementById(`activityImageInput-${dayIndex}-${activityIndex}`).click();
  };

  const handleCreateTour = async () => {
    let errors = [];

    if (!isChecked) {
      errors.push("Bạn phải đồng ý với các điều khoản và điều kiện trước khi tạo tour.");
    }

    if (!tourData.tourName) {
      errors.push("Vui lòng nhập tên tour.");
    }

    if (!tourData.location) {
      errors.push("Vui lòng chọn địa điểm.");
    }

    if (!tourData.maxGuests) {
      errors.push("Vui lòng nhập số khách tối đa.");
    }

    if (!tourData.tourImage) {
      errors.push("Vui lòng chọn hình ảnh tour.");
    }

    if (!duration) {
      errors.push("Vui lòng nhập số ngày đi.");
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

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
    setModalIsOpen(false);
    onTourCreated();
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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleDeleteSchedule = (scheduleIndex) => {
    const newSchedules = tourData.schedules.filter((_, index) => index !== scheduleIndex);
    setTourData({ ...tourData, schedules: newSchedules });
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
        <h2 className='' style={{
          height: '50px',
        }}>Tạo Tour</h2>
        <div className='mymodal_body d-flex flex-column gap-3' style={{
          height: 'calc(100% - 100px)',
          overflowY: 'auto'
        }}>
          <div className='row'>

            <div className='col col-6 d-flex flex-column flex-grow-1'>
              <label>Tên tour</label>
              <input type="text" name="tourName" placeholder="Tên tour" value={tourData.tourName} onChange={handleInputChange} className="form-control" />
              <label>Địa điểm</label>
              <select name="location" value={tourData.location} onChange={handleInputChange} className="form-select">
                {locations?.$values?.map((location) => (
                  <option key={location.locationId} value={location.location.locationName}>{location.location.locationName}</option>
                ))}
              </select>
              <label>Số khách tối đa</label>
              <input type="number" name="maxGuests" placeholder="Số khách tối đa" value={tourData.maxGuests} onChange={handleInputChange} className="form-control" />
              <label>Số ngày đi</label>
              <input type="number" name="maxNumberOfDay" placeholder="Số ngày đi" value={duration} onChange={handleInputChange} className="form-control" />
              <label>Mô tả tour</label>
              <TextareaAutosize minRows={3} name="tourDescription" placeholder="Mô tả tour" value={tourData.tourDescription} onChange={handleInputChange} className="form-control" />
            </div>
            <div className='col col-6 d-flex flex-column flex-grow-1 img'>
              <label>Hình ảnh tour</label>
              <button className='btn btn-primary mb-2' onClick={handleFileButtonClick}>Chọn hình ảnh tour</button>
              <input id="tourImageInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              {tourData.tourImage && <img src={tourData.tourImage} alt="ảnh tour" className='w-100' />}

            </div>
          </div>
          <div>
            <h5 className='text-uppercase fw-bold'>Lịch trình diễn ra</h5>
            <div className='d-flex gap-2 flex-column'>
              <div>
                <button onClick={handleAddSchedule} className='btn btn-primary mb-2'>Thêm lịch trình</button>
                <div className='d-flex gap-2 flex-wrap'>
                {tourData.schedules.map((schedule, scheduleIndex) => (
                  <div key={scheduleIndex} className='d-flex align-items-center gap-2'>
                    <input type="datetime-local" name="startDate" placeholder="Ngày bắt đầu" value={schedule.startDate} onChange={(e) => handleScheduleChange(e, scheduleIndex)} className="mb-2" />
                    <input type="datetime-local" name="endDate" placeholder="Ngày kết thúc" value={schedule.endDate} readOnly className="" />
                    <button onClick={() => handleDeleteSchedule(scheduleIndex)} className='btn btn-danger'>Xóa lịch trình</button>
                  </div>
                ))}
                </div>
                </div>
            </div>
          </div>

          <Tabs defaultActiveKey="itinerary" id="uncontrolled-tab-example" className="mb-3 no-border-radius">
            <Tab eventKey="itinerary" title="Lịch trình cụ thể">
              <div>
                <button onClick={handleAddItinerary} className='btn btn-primary'>Thêm lịch trình cụ thể</button>
                <Accordion defaultActiveKey="0">
                  {tourData.itinerary.map((day, dayIndex) => (
                    <Accordion.Item eventKey={dayIndex.toString()} key={dayIndex}>
                      <Accordion.Header>
                        Ngày {dayIndex + 1}
                        <button style={{ marginLeft: '10px' }} onClick={() => handleDeleteItinerary(dayIndex)} className='btn fw-bold text-danger'>Xóa lịch trình cụ thể</button>
                      </Accordion.Header>
                      <Accordion.Body>
                        <button onClick={() => handleAddActivity(dayIndex)} className='btn btn-primary'>Thêm hoạt động</button>
                        {day.activities.map((activity, activityIndex) => (
                          <div key={activityIndex} className='row'>
                            <div className='col col-6 d-flex flex-column gap-2'>
                              <label>Tiêu đề hoạt động</label>
                              <input type="text" placeholder="Tiêu đề hoạt động" value={activity.title} onChange={(e) => {
                                const newItinerary = [...tourData.itinerary];
                                newItinerary[dayIndex].activities[activityIndex].title = e.target.value;
                                setTourData({ ...tourData, itinerary: newItinerary });
                              }} className="form-control" />

                              <label>Địa chỉ hoạt động</label>
                              <input type="text" placeholder="Địa chỉ hoạt động" value={activity.activityAddress} onChange={(e) => {
                                const newItinerary = [...tourData.itinerary];
                                newItinerary[dayIndex].activities[activityIndex].activityAddress = e.target.value;
                                setTourData({ ...tourData, itinerary: newItinerary });
                              }} className="form-control" />
                              <div className='d-flex gap-2'>
                                <div className='d-flex flex-column gap-2'>
                                  <label>Thời gian bắt đầu</label>
                                  <input type="time" placeholder="Thời gian bắt đầu" value={activity.startTime} onChange={(e) => {
                                    const newItinerary = [...tourData.itinerary];
                                    newItinerary[dayIndex].activities[activityIndex].startTime = e.target.value + ":00";
                                    setTourData({ ...tourData, itinerary: newItinerary });
                                  }} className="form-control" />
                                </div>
                                <div className='d-flex flex-column gap-2'>
                                  <label>Thời gian kết thúc</label>
                                  <input type="time" placeholder="Thời gian kết thúc" value={activity.endTime} onChange={(e) => {
                                    const newItinerary = [...tourData.itinerary];
                                    newItinerary[dayIndex].activities[activityIndex].endTime = e.target.value + ":00";
                                    setTourData({ ...tourData, itinerary: newItinerary });
                                  }} className="form-control" />
                                </div>
                                <div className='d-flex flex-column gap-2'>
                                  <label>Chi phí hoạt động</label>
                                  <input type="number" placeholder="Chi phí hoạt động" value={activity.activityAmount} onChange={(e) => {
                                    const newItinerary = [...tourData.itinerary];
                                    newItinerary[dayIndex].activities[activityIndex].activityAmount = parseInt(e.target.value);
                                    setTourData({ ...tourData, itinerary: newItinerary });
                                  }} className="form-control" />
                                </div>
                              </div>
                              <label>Mô tả hoạt động</label>
                              <TextareaAutosize minRows={2} placeholder="Mô tả hoạt động" value={activity.description} onChange={(e) => {
                                const newItinerary = [...tourData.itinerary];
                                newItinerary[dayIndex].activities[activityIndex].description = e.target.value;
                                setTourData({ ...tourData, itinerary: newItinerary });
                              }} className="form-control" />
                            </div>
                            <div className='col col-6 d-flex flex-column gap-2'>
                              <label>Hình ảnh hoạt động</label>
                              <button onClick={() => handleActivityFileButtonClick(dayIndex, activityIndex)} className='btn btn-primary'>Chọn hình ảnh hoạt động</button>
                              <input id={`activityImageInput-${dayIndex}-${activityIndex}`} type="file" accept="image/*" onChange={(e) => handleActivityFileChange(e, dayIndex, activityIndex)} style={{ display: 'none' }} />
                              {activity.activityImage && <img src={activity.activityImage} alt="ảnh hoạt động" className='w-100' />}
                            </div>
                            <div className='my-3'>
                              <button style={{
                                width: 'fit-content',
                              }} onClick={() => handleDeleteActivity(dayIndex, activityIndex)} className='btn btn-danger'>Xóa hoạt động</button>

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
                <button className='btn btn-primary mb-3' onClick={handleAddCostDetail}>Thêm chi phí</button>
                {tourData.costDetails.map((cost, costIndex) => (
                  <div key={costIndex} className='mb-3'>
                    <div className='d-flex gap-2 mb-2'>
                      <input type="text" className='form-control w-100' placeholder="Tiêu đề chi phí" value={cost.title} onChange={(e) => {
                        const newCostDetails = [...tourData.costDetails];
                        newCostDetails[costIndex].title = e.target.value;
                        setTourData({ ...tourData, costDetails: newCostDetails });
                      }} />
                      <input type="number" className='form-control' placeholder="Số tiền" value={cost.amount} onChange={(e) => {
                        const newCostDetails = [...tourData.costDetails];
                        newCostDetails[costIndex].amount = parseInt(e.target.value);
                        setTourData({ ...tourData, costDetails: newCostDetails });
                      }} />
                    </div>
                    <TextareaAutosize minRows={2} className='form-control w-100' placeholder="Ghi chú" value={cost.notes} onChange={(e) => {
                      const newCostDetails = [...tourData.costDetails];
                      newCostDetails[costIndex].notes = e.target.value;
                      setTourData({ ...tourData, costDetails: newCostDetails });
                    }} />
                    <button onClick={() => handleDeleteCostDetail(costIndex)} className='btn btn-danger'>Xóa chi phí</button>
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
          height: '60px',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div className='d-flex align-items-center gap-2'>
            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
            Bằng cách tạo tour này, bạn xác nhận rằng đã đọc, hiểu và đồng ý với các <a href="https://travelmatefe.netlify.app/regulation" target="_blank" style={{
              color: 'green',
              textDecoration: 'underline',
            }}>Điều khoản và quy định</a> của chúng tôi
          </div>

          <div className='d-flex flex-column align-items-end gap-2'>
            <h5 className='m-0'>Tổng chi phí: {tourData.price.toLocaleString()} ₫</h5>
            <div className='d-flex gap-2'>
              <button className='btn btn-secondary' onClick={closeModal}>Đóng</button>
              <button className='btn btn-success' onClick={handleCreateTour} disabled={isCreating}>
                {isCreating && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
                {isCreating ? ' Đang tạo...' : 'Tạo tour'}
              </button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  );
}

export default CreateTour;