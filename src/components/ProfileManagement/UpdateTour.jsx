/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import '../../assets/css/ProfileManagement/CreateTour.css';
import { getTourById, updateTour } from '../../apis/local_trip_history';
import { Tabs, Tab, Accordion, Spinner } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import TextareaAutosize from 'react-textarea-autosize';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../firebaseConfig';
import { getUserLocation } from '../../apis/profileApi';

function UpdateTour({ tour, onClose, isCreating, setIsCreating }) {
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
  const [locations, setLocations] = useState([]);
  const [duration, setDuration] = useState(0);
  const quillRef = useRef(null);

  console.log('tour-update', tour);
  

  useEffect(() => {
    const fetchTourUpdateData = async () => {
      const tourData = await getTourById(tour.tourId);
      setTourData({
        tourName: tourData.tourName,
        tourDescription: tourData.tourDescription,
        price: tourData.price,
        location: tourData.location,
        maxGuests: tourData.maxGuests,
        tourImage: tourData.tourImage,
        itinerary: tourData.itinerary.$values.map(day => ({
          ...day,
          activities: day.activities.$values || []
        })),
        costDetails: tourData.costDetails.$values,
        schedules: tourData.schedules.$values.map(schedule => ({
          ...schedule,
          startDate: new Date(schedule.startDate).toISOString().slice(0, 16),
          endDate: new Date(schedule.endDate).toISOString().slice(0, 16)
        })),
        additionalInfo: tourData.additionalInfo
      });
    }
    fetchTourUpdateData();
  }, [tour.tourId]);
  

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
    setDuration(tourData.itinerary.length);
  }, [tourData.itinerary, tourData.costDetails]);

  useEffect(() => {
    const updateItineraryBasedOnDays = () => {
      const newItinerary = Array.from({ length: duration }, (_, index) => ({
        day: index + 1,
        activities: tourData.itinerary[index]?.activities || []
      }));
      setTourData({ ...tourData, itinerary: newItinerary });
    };
    updateItineraryBasedOnDays();
  }, [duration]);

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

  const handleFileButtonClick = () => {
    document.getElementById('tourImageInput').click();
  };

  const handleActivityFileButtonClick = (dayIndex, activityIndex) => {
    document.getElementById(`activityImageInput-${dayIndex}-${activityIndex}`).click();
  };

  const handleUpdateTour = async () => {
    setIsCreating(true);

    const uploadImage = async (imageData, path) => {
      if (imageData.startsWith('http')) {
        return imageData; // If the imageData is already a URL, return it directly
      }
      const storageRef = ref(storage, path);
      await uploadString(storageRef, imageData, 'data_url');
      return await getDownloadURL(storageRef);
    };

    const tourImageUrl = await uploadImage(tourData.tourImage, `tours/${tourData.tourName}/tourImage`);
    const itinerary = await Promise.all(tourData.itinerary.map(async (day, dayIndex) => {
      const activities = await Promise.all(day.activities.map(async (activity, activityIndex) => {
        if (activity.activityImage && !activity.activityImage.startsWith('http')) {
          const activityImageUrl = await uploadImage(activity.activityImage, `tours/${tourData.tourName}/day${dayIndex + 1}/activity${activityIndex + 1}`);
          return { ...activity, activityImage: activityImageUrl };
        }
        return activity;
      }));
      return { ...day, activities };
    }));

    const updatedTourData = {
      ...tourData,
      tourImage: tourImageUrl,
      itinerary,
      startDate: tourData.schedules[0]?.startDate,
      endDate: tourData.schedules[0]?.endDate,
      numberOfDays: tourData.itinerary.length,
      numberOfNights: tourData.itinerary.length - 1
    };

    await updateTour(updatedTourData, tour.tourId);
    setIsCreating(false);
    onClose(); // Close the modal after updating the tour
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
  
    setTourData({ ...tourData, schedules: newSchedules });
  };

  return (
    <div>
      <h2 className='text-center' style={{ height: '50px' }}>Cập nhật Tour</h2>
      <div className='mymodal_body d-flex flex-column gap-3' style={{ height: 'calc(100% - 100px)', overflowY: 'auto' }}>
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
            <button className='mb-2 btn btn-primary' onClick={handleFileButtonClick}>Chọn hình ảnh tour</button>
            <input id="tourImageInput" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            {tourData.tourImage && <img src={tourData.tourImage} alt="ảnh tour" className='w-100' />}
            <div>
              Giá: {tourData.price.toLocaleString()} ₫
            </div>
          </div>
        </div>
        <div>
          <h5 className='text-uppercase fw-bold'>Lịch trình diễn ra</h5>
          <button className='btn btn-primary mb-2' onClick={handleAddSchedule}>Thêm lịch trình</button>
          {tourData.schedules.map((schedule, scheduleIndex) => (
            <div key={scheduleIndex}>
              <input type="datetime-local" name="startDate" placeholder="Ngày bắt đầu" value={schedule.startDate} onChange={(e) => handleScheduleChange(e, scheduleIndex)}/>
              <input type="datetime-local" name="endDate" placeholder="Ngày kết thúc" value={schedule.endDate} readOnly  />
            </div>
          ))}
        </div>

        <Tabs defaultActiveKey="itinerary" id="uncontrolled-tab-example" className="mb-3 no-border-radius">
          <Tab eventKey="itinerary" title="Lịch trình cụ thể">
            <div>
              <button className='btn btn-primary' onClick={handleAddItinerary}>Thêm lịch trình cụ thể</button>
              <Accordion defaultActiveKey="0">
                {tourData.itinerary.map((day, dayIndex) => (
                  <Accordion.Item eventKey={dayIndex.toString()} key={dayIndex}>
                    <Accordion.Header>
                      Ngày {dayIndex + 1}
                      <button style={{ marginLeft: '10px' }} className='btn btn-danger' onClick={() => handleDeleteItinerary(dayIndex)}>Xóa lịch trình cụ thể</button>
                    </Accordion.Header>
                    <Accordion.Body>
                      {/* <div>
                        <label>Ngày bắt đầu</label>
                        <input type="datetime-local" value={tourData.schedules[dayIndex]?.startDate || ''} readOnly />
                      </div>
                      <div>
                        <label>Ngày kết thúc</label>
                        <input type="datetime-local" value={tourData.schedules[dayIndex]?.endDate || ''} readOnly />
                      </div> */}
                      <button className='btn btn-primary' onClick={() => handleAddActivity(dayIndex)}>Thêm hoạt động</button>
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
                            <button className='btn btn-primary' onClick={() => handleActivityFileButtonClick(dayIndex, activityIndex)}>Chọn hình ảnh hoạt động</button>
                            <input id={`activityImageInput-${dayIndex}-${activityIndex}`} type="file" accept="image/*" onChange={(e) => handleActivityFileChange(e, dayIndex, activityIndex)} style={{ display: 'none' }} />
                            {activity.activityImage && <img src={activity.activityImage} alt="ảnh hoạt động" className='w-100' />}
                          </div>
                          <div className='my-3'>
                            <button className='btn btn-danger' style={{ width: 'fit-content' }} onClick={() => handleDeleteActivity(dayIndex, activityIndex)}>Xóa hoạt động</button>
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
                    <input type="text" className='w-100 form-control' placeholder="Tiêu đề chi phí" value={cost.title} onChange={(e) => {
                      const newCostDetails = [...tourData.costDetails];
                      newCostDetails[costIndex].title = e.target.value;
                      setTourData({ ...tourData, costDetails: newCostDetails });
                    }} />
                    <input type="number" placeholder="Số tiền" value={cost.amount} onChange={(e) => {
                      const newCostDetails = [...tourData.costDetails];
                      newCostDetails[costIndex].amount = parseInt(e.target.value);
                      setTourData({ ...tourData, costDetails: newCostDetails });
                    }} className="form-control" />
                  </div>
                  <TextareaAutosize minRows={2} placeholder="Ghi chú" className='w-100 form-control' value={cost.notes} onChange={(e) => {
                    const newCostDetails = [...tourData.costDetails];
                    newCostDetails[costIndex].notes = e.target.value;
                    setTourData({ ...tourData, costDetails: newCostDetails });
                  }} />
                  <button className='btn btn-danger' onClick={() => handleDeleteCostDetail(costIndex)}>Xóa chi phí</button>
                </div>
              ))}
            </div>
          </Tab>
          <Tab eventKey="additionalInfo" title="Thông tin thêm">
            <div>
              <ReactQuill
                ref={quillRef}
                style={{ height: '250px', backgroundColor: 'white', color: 'black' }}
                value={tourData.additionalInfo}
                onChange={handleQuillChange}
              />
            </div>
          </Tab>
        </Tabs>
      </div>
      <div className="modal-footer d-none" style={{ height: '50px' }}>
        <button id="updateTourButton" className='btn btn-success' onClick={handleUpdateTour} disabled={isCreating}>
          {isCreating && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />}
          {isCreating ? ' Đang cập nhật...' : 'Cập nhật tour'}
        </button>
      </div>
    </div>
  );
}

export default UpdateTour;