import React, { useState } from 'react';
import { Table, InputGroup, FormControl, Button } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import '../../assets/css/Admin/AdminTransactionList.css'; // Assuming you have a CSS file for styling

const transactionData = [
  {
    id: 1,
    from: 'Tesco Market',
    to: 'ElectroMen Market',
    status: 'Success',
    date: '13 Dec 2020',
    amount: '$75.67',
  },
  {
    id: 2,
    from: 'ElectroMen Market',
    to: 'Tesco Market',
    status: 'Pending',
    date: '14 Dec 2020',
    amount: '$250.00',
  },
  {
    id: 3,
    from: 'Fiorgio Restaurant',
    to: 'Tesco Market',
    status: 'Fail',
    date: '07 Dec 2020',
    amount: '$19.50',
  },
  {
    id: 4,
    from: 'John Mathew Kyme',
    to: 'Tesco Market',
    status: 'Success',
    date: '06 Dec 2020',
    amount: '$350',
  },
  {
    id: 5,
    from: 'Ann Marlin',
    to: 'Tesco Market',
    status: 'Success',
    date: '31 Nov 2020',
    amount: '$430',
  },
  {
    id: 6,
    from: 'Tesco Market',
    to: 'ElectroMen Market',
    status: 'Success',
    date: '13 Dec 2020',
    amount: '$75.67',
  },
  {
    id: 7,
    from: 'ElectroMen Market',
    to: 'Tesco Market',
    status: 'Pending',
    date: '14 Dec 2020',
    amount: '$250.00',
  },
  {
    id: 8,
    from: 'Fiorgio Restaurant',
    to: 'Tesco Market',
    status: 'Fail',
    date: '07 Dec 2020',
    amount: '$19.50',
  },
  {
    id: 9,
    from: 'John Mathew Kyme',
    to: 'Tesco Market',
    status: 'Success',
    date: '06 Dec 2020',
    amount: '$350',
  },
  
];

function WalletManagement() {
  const [currentPage, setCurrentPage] = useState(0);
  const transactionsPerPage = 5; // Number of transactions per page

  // Calculate the current displayed transactions based on the current page
  const indexOfLastTransaction = (currentPage + 1) * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactionData.slice(indexOfFirstTransaction, indexOfLastTransaction);

  // Handle page change
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  return (
    <div className="admin-transaction-list">
      <h2>Lịch sử giao dịch</h2>

      {/* Section Title */}
      <h3 className="transaction-list-title">Danh sách</h3>

    

      {/* Transactions Table */}
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

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentTransactions.length > 0 ? (
              currentTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="from">
                    <img src="https://via.placeholder.com/40" alt="avatar" className="avatar" />
                    <span>{transaction.from}</span>
                  </td>
                  <td className="to">
                    <img src="https://via.placeholder.com/40" alt="avatar" className="avatar" />
                    <span>{transaction.to}</span>
                  </td>
                  <td>
                    <span className={`status ${transaction.status.toLowerCase()}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td>{transaction.date}</td>
                  <td>{transaction.amount}</td>
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

      {/* React Paginate Component */}
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={'‹'}
          nextLabel={'›'}
          breakLabel={'...'}
          pageCount={Math.ceil(transactionData.length / transactionsPerPage)}
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
  );
}

export default WalletManagement;
