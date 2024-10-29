import React, { useState } from 'react';
import '../../assets/css/Admin/AdminReport.css'; // Assuming you have CSS for styling
import { Table, InputGroup, FormControl, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';

const reportData = [
  {
    id: 1,
    name: 'Trần Duy Nguyên Nhơn',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Lạm dụng',
    date: '24-09-2024',
    status: 'Đã giải quyết',
    processed: 'Có',
    action: 'View',
  },
  {
    id: 2,
    name: 'Tesco Market',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Hành vi sai trái',
    date: '24-09-2024',
    status: 'Đang chờ',
    processed: 'Chưa',
    action: 'View',
  },
  {
    id: 3,
    name: 'Tesco Market',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Hồ sơ',
    date: '24-09-2024',
    status: 'Đã bác bỏ',
    processed: 'Có',
    action: 'View',
  },
  {
    id: 4,
    name: 'Trần Duy Nguyên Nhơn',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Lạm dụng',
    date: '24-09-2024',
    status: 'Đã giải quyết',
    processed: 'Có',
    action: 'View',
  },
  {
    id: 5,
    name: 'Tesco Market',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Hành vi sai trái',
    date: '24-09-2024',
    status: 'Đang chờ',
    processed: 'Chưa',
    action: 'View',
  },
  {
    id: 6,
    name: 'Tesco Market',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Hồ sơ',
    date: '24-09-2024',
    status: 'Đã bác bỏ',
    processed: 'Có',
    action: 'View',
  },
  {
    id: 7,
    name: 'Trần Duy Nguyên Nhơn',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Lạm dụng',
    date: '24-09-2024',
    status: 'Đã giải quyết',
    processed: 'Có',
    action: 'View',
  },
  {
    id: 8,
    name: 'Tesco Market',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Hành vi sai trái',
    date: '24-09-2024',
    status: 'Đang chờ',
    processed: 'Chưa',
    action: 'View',
  },
  {
    id: 9,
    name: 'Tesco Market',
    description: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    type: 'Hồ sơ',
    date: '24-09-2024',
    status: 'Đã bác bỏ',
    processed: 'Có',
    action: 'View',
  },
  // Add more reports as needed
];

function AdminReport() {
  const [currentPage, setCurrentPage] = useState(0);
  const reportsPerPage = 6; // Number of reports per page

  // Filtered reports based on pagination
  const indexOfLastReport = (currentPage + 1) * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reportData.slice(indexOfFirstReport, indexOfLastReport);

  // Handle page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="admin-report">
      <h2>Báo cáo</h2>

      <div className='body-dashboard'>
        {/* Overview Cards */}
        <div className="report-overview">
          <div className="overview-card">
            <div className='d-flex justify-content-between align-items-center'>
              <h3>Tổng số báo cáo</h3>
              <i className='bi bi-layout-text-window-reverse fs-3'></i>
            </div>
            <p className="value">120</p>
          </div>
          <div className="overview-card active">
            <div className='d-flex justify-content-between align-items-center'> <h3>Đang xử lí</h3>
              <i className='bi bi-layout-text-window-reverse fs-3 text-warning'></i></div>
            <p className="value">20</p>
          </div>
          <div className="overview-card">
            <div className='d-flex justify-content-between align-items-center'><h3>Đã giải quyết</h3>
              <i className='bi bi-layout-text-window-reverse fs-3 text-success'></i>
            </div>
            <p className="value">80</p>
          </div>
          <div className="overview-card">
            <div className='d-flex justify-content-between align-items-center'><h3>Đã bác bỏ</h3>
              <i className='bi bi-x fs-3'></i>
            </div>
            <p className="value">20</p>
          </div>
        </div>




        {/* Report Table */}
        <div className="table-container">
          <div className='d-flex flex-row-reverse'>
            <InputGroup className="mb-3" style={{ width: '400px' }}>
              <FormControl
                placeholder="Tìm kiếm"
                aria-label="Search"
                aria-describedby="basic-addon2"
                id='search-input'
                className='rounded-5'
              />
              <Button variant="" id="button-addon2">
                <i className="bi bi-funnel fs-3"></i> {/* Bootstrap icon for filter */}
              </Button>
            </InputGroup>
          </div>
          <Table borderless hover responsive>
            <thead>
              <tr>
                <th>Traveller</th>
                <th>Mô tả</th>
                <th>Loại</th>
                <th>Ngày</th>
                <th>Trạng thái</th>
                <th>Đã xử lí</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentReports.length > 0 ? (
                currentReports.map((report) => (
                  <tr key={report.id}>
                    <td className="traveller">
                      <img src="https://via.placeholder.com/40" alt="avatar" className="avatar" />
                      <span>{report.name}</span>
                    </td>
                    <td>{report.description}</td>
                    <td>{report.type}</td>
                    <td>{report.date}</td>
                    <td>
                      <span className={`status ${report.status === 'Đã giải quyết' ? 'resolved' : report.status === 'Đang chờ' ? 'pending' : 'rejected'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>{report.processed}</td>
                    <td className="actions">
                      <Button variant="" className="action-btn block-btn">
                        <i className="bi bi-slash-circle"></i>
                      </Button>
                      <Button variant="" className="action-btn delete-btn text-black">
                        <i className="bi bi-trash"></i>
                      </Button>
                      <Button variant="" className="action-btn info-btn">
                        <i className="bi bi-info-circle"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Không tìm thấy kết quả nào
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* React Paginate Component */}
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={'‹'}
            nextLabel={'›'}
            breakLabel={'...'}
            pageCount={Math.ceil(reportData.length / reportsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            pageClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousClassName={'page-item'}
            previousLinkClassName={'page-link'}
            nextClassName={'page-item'}
            nextLinkClassName={'page-link'}
            breakClassName={'page-item'}
            breakLinkClassName={'page-link'}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminReport;
