import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import Modal from 'react-modal';
import Button from 'react-bootstrap/Button';

// eslint-disable-next-line react/prop-types
function TableParticipant({ participants, tab }) {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);

    const handleShowModal = (participant) => {
        setSelectedParticipant(participant);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedParticipant(null);
    };

    const filteredParticipants = useMemo(() => 
        participants.filter(participant =>
            participant.fullName.toLowerCase().includes(search.toLowerCase()) ||
            participant.phone.includes(search) ||
            participant.address.toLowerCase().includes(search.toLowerCase()) ||
            participant.orderCode.toString().includes(search) ||
            participant.paymentStatus.toString().includes(search)
        ), [search, participants]);

    const columns = [
      
        {
            accessorKey: 'fullName',
            header: 'Tên',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'gender',
            header: 'Giới tính',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'address',
            header: 'Địa chỉ',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'phone',
            header: 'Số điện thoại',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'registeredAt',
            header: 'Ngày đăng ký',
            cell: (info) => new Date(info.getValue()).toLocaleString(),
        },
        {
            accessorKey: 'transactionTime',
            header: 'Thời gian giao dịch',
            cell: (info) => new Date(info.getValue()).toLocaleString(),
        },
        {
            accessorKey: 'totalAmount',
            header: 'Tổng số tiền',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'actions',
            header: 'Hành động',
            cell: (info) => (
                <div className="d-flex gap-2">
                    <button className="btn btn-success" onClick={() => handleShowModal(info.row.original)}>
                        <ion-icon name="eye-outline"></ion-icon>
                    </button>
                    <button className="btn btn-danger"><ion-icon name="chatbubbles-outline"></ion-icon></button>
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredParticipants,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        state: { pagination },
        onPaginationChange: setPagination,
    });

    return (
        <div className='table_participant_list'>
            <input
                type="text"
                className='my-3'
                placeholder='Tìm kiếm...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                    padding: '5px 10px',
                    borderRadius: '10px',
                    border: '1px solid #ccc',
                }}
            />
            <table className="table">
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id} style={{ whiteSpace: 'nowrap' }}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center">
                                {tab === 'paid' && 'Chưa có người đã thanh toán'}
                                {tab === 'unpaid' && 'Chưa có người chưa thanh toán'}
                                {tab === 'refunded' && 'Chưa có người hoàn tiền'}
                            </td>
                        </tr>
                    ) : (
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} style={{ whiteSpace: 'nowrap' }}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className='d-flex align-items-center gap-2'>
                <button className='btn btn-success d-flex justify-content-center align-items-center' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                    <ion-icon name="arrow-back-outline" style={{ fontSize: '20px' }}></ion-icon>
                </button>
                <button className='btn btn-success d-flex justify-content-center align-items-center' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                    <ion-icon name="arrow-forward-outline" style={{ fontSize: '20px' }}></ion-icon>
                </button>
                <span>
                    Trang {table.getState().pagination.pageIndex + 1} của {table.getPageCount()}
                </span>
                <span className="flex items-center gap-1">
                    | Chuyển đến trang:
                    <input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Hiển thị {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <Modal
                isOpen={showModal}
                onRequestClose={handleCloseModal}
                contentLabel="Thông tin người tham gia"
                ariaHideApp={false}
                style={{
                    content: {
                        width: '50%',
                        height: '50%',
                        margin: 'auto',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                }}
            >
                <h2>Thông tin người tham gia</h2>
                {selectedParticipant && (
                    <div>
                        <p><strong>Tên:</strong> {selectedParticipant.fullName}</p>
                        <p><strong>Giới tính:</strong> {selectedParticipant.gender}</p>
                        <p><strong>Địa chỉ:</strong> {selectedParticipant.address}</p>
                        <p><strong>Số điện thoại:</strong> {selectedParticipant.phone}</p>
                        <p><strong>Ngày đăng ký:</strong> {new Date(selectedParticipant.registeredAt).toLocaleString()}</p>
                        <p><strong>Mã đơn hàng:</strong> {selectedParticipant.orderCode}</p>
                        <p><strong>Trạng thái thanh toán:</strong> {selectedParticipant.paymentStatus === 1 ? 'Đã thanh toán' : selectedParticipant.paymentStatus === 2 ? 'Hoàn tiền' : 'Chưa thanh toán'}</p>
                        <p><strong>Thời gian giao dịch:</strong> {new Date(selectedParticipant.transactionTime).toLocaleString()}</p>
                        <p><strong>Tổng số tiền:</strong> {selectedParticipant.totalAmount}</p>
                    </div>
                )}
                <Button variant="secondary" onClick={handleCloseModal}>
                    Đóng
                </Button>
            </Modal>
        </div>
    );
}

export default TableParticipant;