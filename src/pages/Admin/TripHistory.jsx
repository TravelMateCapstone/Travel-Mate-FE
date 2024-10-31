import React, { useState } from 'react';
import '../../assets/css/Admin/AccountList.css'; // Assuming you have CSS for styling
import ReactPaginate from 'react-paginate';
import { Table, InputGroup, FormControl, Button } from 'react-bootstrap';

const accountsData = [
  // Your account data, same as before
  {
    id: 1,
    name: 'Tesco Market',
    address: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    phone: '0123456789',
    email: 'nhonvn2509@gmail.com',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    id: 2,
    name: 'Tesco Market',
    address: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    phone: '0123456789',
    email: 'nhonvn2509@gmail.com',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    id: 3,
    name: 'Tesco Market',
    address: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    phone: '0123456789',
    email: 'nhonvn2509@gmail.com',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    id: 4,
    name: 'Tesco Market',
    address: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    phone: '0123456789',
    email: 'nhonvn2509@gmail.com',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    id: 5,
    name: 'Tesco Market',
    address: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    phone: '0123456789',
    email: 'nhonvn2509@gmail.com',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    id: 6,
    name: 'Tesco Market',
    address: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    phone: '0123456789',
    email: 'nhonvn2509@gmail.com',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    id: 7,
    name: 'Tesco Market',
    address: 'Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng 550000',
    phone: '0123456789',
    email: 'nhonvn2509@gmail.com',
    avatar: 'https://via.placeholder.com/40',
  },
  // Add more accounts as needed
];

function TripHistory() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const accountsPerPage = 6; // Number of accounts per page

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered accounts based on the search term
  const filteredAccounts = accountsData.filter((account) =>
    account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.phone.includes(searchTerm) ||
    account.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the current displayed accounts based on the current page
  const indexOfLastAccount = (currentPage + 1) * accountsPerPage;
  const indexOfFirstAccount = indexOfLastAccount - accountsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstAccount, indexOfLastAccount);

  // Handle page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="account-list-container">
      <h2>Lịch sử chuyến đi</h2>

      <div className='table-search'>
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
              <i className="bi bi-funnel fs-3"></i>
            </Button>
          </InputGroup>
        </div>

        {/* Table */}
        <div className="table-container">
          <Table borderless hover responsive>
            <thead>
              <tr>
                <th>Traveller</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.length > 0 ? (
                currentAccounts.map((account) => (
                  <tr key={account.id}>
                    <td className="traveller">
                      <img src={account.avatar} alt="avatar" className="avatar" />
                      <span>{account.name}</span>
                    </td>
                    <td>{account.address}</td>
                    <td>{account.phone}</td>
                    <td>{account.email}</td>
                    <td className="actions">
                      {/* <Button variant="" className="action-btn block-btn">
                        <i className="bi bi-slash-circle"></i>
                      </Button>
                      <Button variant="" className="action-btn delete-btn">
                        <i className="bi bi-trash"></i>
                      </Button> */}
                      <Button variant="" className="action-btn info-btn">
                        <i className="bi bi-info-circle"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Không tìm thấy kết quả nào
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* React Paginate Component */}
      {filteredAccounts.length > accountsPerPage && (
        <div className="d-flex justify-content-center">
          <ReactPaginate
            previousLabel={'‹'}
            nextLabel={'›'}
            breakLabel={'...'}
            pageCount={Math.ceil(filteredAccounts.length / accountsPerPage)}
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
      )}
    </div>
  );
}

export default TripHistory;
