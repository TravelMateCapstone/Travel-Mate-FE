import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSelector } from 'react-redux';
import MonthlySpendingChart from '../../components/Local/MonthlySpendingChart';
import { fetchTransactions } from '../../utils/UserDashBoard/statistical';
import { Col, Form, Row, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchTourByStatus } from '../../apis/local_trip_history';


function WalletManagement() {
  const [rowData, setRowData] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const user = useSelector((state) => state.auth.user);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
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
        const [banksResponse, userBankResponse] = await Promise.all([
          axios.get('https://api.banklookup.net/api/bank/list'),
          axios.get('https://travelmateapp.azurewebsites.net/api/UserBank/current-user', {
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
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const fetcTourAccepted = async () => {
      try {
        const data = await fetchTourByStatus(1);
        setAcceptedTours(data);
        console.log("Danh sách tour đã được chấp nhận:", data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetcTourAccepted();
    fetchInitialData();

    console.log("Danh sách tour đã được chấp nhận:", acceptedTours);
    
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

  const columnDefs = [
    { headerName: 'Khách Du Lịch', field: 'name', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Tên Tour', field: 'tourName', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Tên Người Địa Phương', field: 'localName', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Thời Gian Giao Dịch', field: 'date', filter: 'agDateColumnFilter', sortable: true },
    {
      headerName: 'Số Tiền (VND)',
      field: 'amount',
      filter: 'agNumberColumnFilter',
      sortable: true,
      valueFormatter: (params) => `${params.value.toLocaleString('vi-VN')} VND`,
    },
  ];

  const handleCancelParticipation = (tourId) => {
    // Logic to cancel participation
    console.log(`Cancel participation for tour ID: ${tourId}`);
  };

  const tourColumnDefs = [
    { headerName: 'Tên Tour', field: 'tourName', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Mô Tả', field: 'tourDescription', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Địa Điểm', field: 'location', filter: 'agTextColumnFilter', sortable: true },
    { headerName: 'Số Khách Tối Đa', field: 'maxGuests', filter: 'agNumberColumnFilter', sortable: true },
    { headerName: 'Giá (VND)', field: 'price', filter: 'agNumberColumnFilter', sortable: true, valueFormatter: (params) => `${params.value.toLocaleString('vi-VN')} VND` },
    { headerName: 'Hình Ảnh', field: 'tourImage', cellRenderer: (params) => `<img src="${params.value}" alt="Tour Image" style="width: 100px; height: auto;" />` },
    { headerName: 'Hành Động', field: 'actions', cellRenderer: (params) => (
      <Button variant="danger" onClick={() => handleCancelParticipation(params.data.tourId)}>
        Hủy Tham Gia
      </Button>
    ) },
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

      <h2>Danh sách tour đã được chấp nhận</h2>
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

      {/* <Row>
        <Col lg={12}>
          <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={{ width: 'fit-content' }}>
            {[2021, 2022, 2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>
          <MonthlySpendingChart transactions={transactions} selectedYear={selectedYear} />
        </Col>
      </Row> */}

      {/* <div>
        <input
          type="text"
          className='form-control'
          placeholder="Tìm kiếm nhanh..."
          onChange={(e) => setQuickFilterText(e.target.value)}
          style={{ marginBottom: '10px', padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '5px' }}
        />
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={5}
            quickFilterText={quickFilterText}
            domLayout="autoHeight"
            animateRows={true}
          />
        </div>
      </div> */}

      
    </div>
  );
}

export default WalletManagement;
