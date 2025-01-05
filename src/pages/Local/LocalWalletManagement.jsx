import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useSelector } from 'react-redux';
import MonthlySpendingChart from '../../components/Local/MonthlySpendingChart';
import { fetchTransactions } from '../../utils/UserDashBoard/statistical';
import { Col, Form, Row } from 'react-bootstrap';
import axios from 'axios';

function WalletManagement() {
  const [rowData, setRowData] = useState([]);
  const [quickFilterText, setQuickFilterText] = useState('');
  const user = useSelector(state => state.auth.user);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  // eslint-disable-next-line no-unused-vars
  const [transactions, setTransactions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactions = await fetchTransactions(user.id);
        setRowData(transactions);
        setTransactions(transactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    const fetchBanks = async () => {
      try {
        const response = await axios.get('https://api.vietqr.io/v2/banks');
        setBanks(response.data.data);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };

    getTransactions();
    fetchBanks();
  }, [user.id]);

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
      valueFormatter: (params) => `${params.value.toLocaleString('vi-VN')} VND`
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
              <p className='m-0'>123345678910</p>
            </div>
            <div className='d-flex gap-2'>
              <ion-icon name="settings-outline" style={{ fontSize: '20px', color: 'green' }} onClick={() => setShowSettings(!showSettings)}></ion-icon>
              <ion-icon name="trash-outline" style={{ fontSize: '20px', color: 'red' }}></ion-icon>
            </div>
          </div>
        </div>

        {showSettings && (
          <div className='col-7 setting_bank_card'>
            <table>
              <tbody>
                <tr>
                  <td>Ngân hàng</td>
                  <td>
                    <Form.Select aria-label="Default select example">
                      {banks.map(bank => (
                        <option key={bank.id} value={bank.code}>{bank.name}</option>
                      ))}
                    </Form.Select>
                  </td>
                </tr>
                <tr>
                  <td>Số tài khoản</td>
                  <td><input type="text" className='w-100' style={{ border: '1px solid #ccc' }} /></td>
                </tr>
                <tr>
                  <td>Tên tài khoản</td>
                  <td><input type="text" className='w-100' style={{ border: '1px solid #ccc' }} /></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Row>
        <Col lg={12}>
          <Form.Select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} style={{ width: 'fit-content' }}>
            {[2021, 2022, 2023, 2024, 2025].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </Form.Select>
          <MonthlySpendingChart transactions={transactions} selectedYear={selectedYear} />
        </Col>
      </Row>

      <div>
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
      </div>
    </div>
  );
}

export default WalletManagement;
