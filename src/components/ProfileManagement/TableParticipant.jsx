import { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';

function TableParticipant() {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [search, setSearch] = useState('');

    const participants = [
        { name: 'John Doe', email: 'john@example.com', phone: '1234567890', status: 'Active' },
        { name: 'Jane Smith', email: 'jane@example.com', phone: '0987654321', status: 'Inactive' },
        // Add more hardcoded participants as needed
    ];

    const filteredParticipants = useMemo(() => 
        participants.filter(participant =>
            participant.name.toLowerCase().includes(search.toLowerCase()) ||
            participant.email.toLowerCase().includes(search.toLowerCase()) ||
            participant.phone.includes(search) ||
            participant.status.toLowerCase().includes(search.toLowerCase())
        ), [search]);

    const columns = [
        {
            accessorKey: 'name',
            header: 'Tên',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'phone',
            header: 'Số điện thoại',
            cell: (info) => info.getValue(),
        },
        {
            accessorKey: 'status',
            header: 'Trạng thái',
            cell: (info) => (
                <span
                    className={`text-nowrap ${info.getValue() === 'Active'
                        ? 'text-success'
                        : 'text-secondary'
                        }`}
                >
                    {info.getValue()}
                </span>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Hành động',
            cell: (info) => (
                <div className="d-flex gap-2">
                    <button className="btn btn-success"><ion-icon name="eye-outline"></ion-icon></button>
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
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} style={{ whiteSpace: 'nowrap' }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
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
        </div>
    );
}

export default TableParticipant;