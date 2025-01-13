import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSelector } from 'react-redux';
import { Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchTourByStatus } from '../../apis/local_trip_history';


function WalletManagement() {

  const [showSettings, setShowSettings] = useState(false);
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [displayAccountNumber, setDisplayAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [acceptedTours, setAcceptedTours] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [banksResponse, userBankResponse, transactionsResponse] = await Promise.all([
          axios.get('https://api.banklookup.net/api/bank/list'),
          axios.get('https://travelmateapp.azurewebsites.net/api/UserBank/current-user', {
            headers: {
              Authorization: `${token}`,
            },
          }),
          axios.get('https://travelmateapp.azurewebsites.net/api/TourParticipant/transactionList', {
            headers: {
              Authorization: `${token}`,
            },
          }),
        ]);

        setBanks(banksResponse.data.data);

        if (userBankResponse.data) {
          const userBank = userBankResponse.data;
          setSelectedBank(banksResponse.data.data.find((bank) => bank.name === userBank.bankName)?.code || '');
          setAccountNumber(userBank.bankNumber);
          setDisplayAccountNumber(userBank.bankNumber);
          setAccountName(userBank.ownerName);
        }

        if (transactionsResponse.data) {
          setAcceptedTours(transactionsResponse.data.$values);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchInitialData();
  }, [token]);

  const handleAccountNumberBlur = async () => {
    if (!selectedBank || !accountNumber) {
      setAccountName('');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'https://api.banklookup.net/api/bank/id-lookup-prod',
        {
          bank: selectedBank,
          account: accountNumber,
        },
        {
          headers: {
            'x-api-key': 'da33b284-4f32-4921-8266-e33df1b46b63key',
            'x-api-secret': '4d04a0a7-0946-412f-93ee-6aa397f102a9secret',
          },
        }
      );

      if (response.data.success) {
        setAccountName(response.data.data.ownerName);
      } else {
        setAccountName('Không tìm thấy số tài khoản');
        toast.error('Số tài khoản không tồn tại!');
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
      setAccountName('Không tìm thấy số tài khoản');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBankDetails = async () => {
    if (!selectedBank || !accountNumber || !accountName) {
      toast.error('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (accountName === "Không tìm thấy số tài khoản") {
      toast.error('Số tài khoản không tồn tại!');
      return;
    }

    try {
      const response = await axios.put(
        'https://travelmateapp.azurewebsites.net/api/UserBank/current-user',
        {
          bankName: banks.find((bank) => bank.code === selectedBank)?.name || '',
          bankNumber: accountNumber,
          ownerName: accountName,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success('Lưu thành công!');
        setDisplayAccountNumber(accountNumber); 
      } else {
        toast.error('Không thể lưu thông tin.');
      }

    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error('Không thể lưu thông tin.');
    }
  };

  const handleCancelTour = async (tourId, scheduleId) => {
    try {
      const response = await axios.post(
        'https://travelmateapp.azurewebsites.net/api/TourParticipant/cancelTour',
        {
          scheduleId: scheduleId,
          tourId: tourId,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
  
      toast.success('Hủy tham gia tour thành công!');
        // Fetch the updated transaction list
        const transactionsResponse = await axios.get('https://travelmateapp.azurewebsites.net/api/TourParticipant/transactionList', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setAcceptedTours(transactionsResponse.data.$values);
    } catch (error) {
      if (error.response.data == 'Access Denied! You cannot cancel the tour within 2 days of its scheduled start.') {
        toast.error('Không thể hủy tour trong vòng 2 ngày trước ngày khởi hành.');
      } else {
        toast.error('Không thể hủy tham gia tour.');
      }
      // console.error('Error cancelling tour:', error);
      // toast.error('Không thể hủy tham gia tour.');
    }
  };

  const getTourStatus = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    if (currentDate < start) {
      return 'Chưa diễn ra';
    } else if (currentDate > end) {
      return 'Đã kết thúc';
    } else {
      return 'Đang diễn ra';
    }
  };

  const formatDateToVietnamese = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const formatDateTimeToVietnamese = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const tourColumnDefs = [
    { 
      headerName: 'Tên Tour', 
      field: 'tourName', 
      filter: 'agTextColumnFilter', 
      sortable: true,
      cellRenderer: (params) => <strong>{params.value}</strong> 
    },
    { 
      headerName: 'Ngày Bắt Đầu', 
      field: 'startDate', 
      filter: 'agDateColumnFilter', 
      sortable: true,
      valueFormatter: (params) => formatDateToVietnamese(params.value)
    },
    { 
      headerName: 'Ngày Kết Thúc', 
      field: 'endDate', 
      filter: 'agDateColumnFilter', 
      sortable: true,
      valueFormatter: (params) => formatDateToVietnamese(params.value)
    },
    { 
      headerName: 'Trạng Thái Thanh Toán', 
      field: 'paymentStatus', 
      filter: 'agTextColumnFilter', 
      sortable: true,
      cellRenderer: (params) => {
        const status = params.value;
        if (status === 1) {
          return <span className='text-success'>Đã thanh toán</span>;
        } else if (status === 2) {
          return <span className='text-warning'>Yêu cầu hoàn tiền</span>;
        } else {
          return status;
        }
      }
    },
    { 
      headerName: 'Thời Gian Giao Dịch', 
      field: 'transactionTime', 
      filter: 'agDateColumnFilter', 
      sortable: true,
      valueFormatter: (params) => formatDateTimeToVietnamese(params.value)
    },
    { headerName: 'Tổng Số Tiền (VND)', field: 'totalAmount', filter: 'agNumberColumnFilter', sortable: true, valueFormatter: (params) => `${params.value.toLocaleString('vi-VN')} VND` },
    { headerName: 'Tình trạng tour', field: 'tourStatus', valueGetter: (params) => getTourStatus(params.data.startDate, params.data.endDate), filter: 'agTextColumnFilter', sortable: true },
    { 
      headerName: 'Hành Động', 
      field: 'actions', 
      cellRenderer: (params) => {
        const tourStatus = getTourStatus(params.data.startDate, params.data.endDate);
        if (params.data.paymentStatus != 2 && tourStatus === 'Chưa diễn ra') { // Check if payment status is not "Yêu cầu hoàn tiền" and tour has not started
          return (
            <Button variant="danger" size='sm' className='rounded-5' onClick={() => handleCancelTour(params.data.tourId, params.data.scheduleId)}>
              Hủy Tham Gia
            </Button>
          );
        }
        return null;
      } 
    },
  ];

  const defaultColDef = {
    flex: 1,
    filter: true,
    resizable: true,
  };

  return (
    <div>
      <h2>Lịch sử giao dịch</h2>
      <div className='row mb-3'>
        <div className='col-2 border-1 mx-2 px-3 py-4 rounded-4' style={{ borderColor: '#ccc' }}>
          <div className='d-flex justify-content-between align-items-center mb-3'>
            <p className='m-0'>Phương thức nhận tiền</p>
            <ion-icon name="add-circle-outline" style={{ fontSize: '24px' }}></ion-icon>
          </div>
          <div className='d-flex justify-content-between align-items-center'>
            <div className='d-flex align-items-center gap-2'>
              <ion-icon name="wallet-outline" style={{ fontSize: '24px' }}></ion-icon>
              <p className='m-0'>{displayAccountNumber}</p> {/* Hiển thị trạng thái */}
            </div>
            <div className='d-flex gap-2'>
              <ion-icon name="settings-outline" style={{ fontSize: '20px', color: 'green' }} onClick={() => setShowSettings(!showSettings)}></ion-icon>
              <ion-icon name="trash-outline" style={{ fontSize: '20px', color: 'red' }}></ion-icon>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className='col-7 setting_bank_card d-flex'>
            <table style={{ marginRight: '10px' }}>
              <tbody>
                <tr>
                  <td>Ngân hàng</td>
                  <td>
                    <Form.Select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      style={{ border: '1px solid #ccc', marginLeft: '15px' }}
                    >
                      <option value="">Chọn ngân hàng</option>
                      {banks.map((bank) => (
                        <option key={bank.id} value={bank.code}>
                          {bank.short_name} - {bank.name}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
                <tr>
                  <td>Số tài khoản</td>
                  <td>
                    <input
                      type="text"
                      className='w-100'
                      style={{ border: '1px solid #ccc', marginLeft: '15px' }}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      onBlur={handleAccountNumberBlur}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Tên tài khoản</td>
                  <td>
                    {isLoading ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <span style={{ marginLeft: '15px' }}>{accountName}</span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
            <Button className='mx-3 btn btn-success' style={{ height: '35%', marginTop: '7%' }} onClick={handleSaveBankDetails}>Lưu</Button>
          </div>
        )}
      </div>

      
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={acceptedTours}
          columnDefs={tourColumnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={5}
          domLayout="autoHeight"
          animateRows={true}
        />
      </div>
      
    </div>
  );
}

export default WalletManagement;
