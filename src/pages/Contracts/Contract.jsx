import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import CountdownTimer from '../../components/Contracts/CountdownTimer';
import RoutePath from '../../routes/RoutePath';
import '../../assets/css/Contracts/Contract.css';

function Contract() {
  const [contracts, setContracts] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);

  useEffect(() => {
    axios
      .get(`https://travelmateapp.azurewebsites.net/api/BlockContract/contracts-by-traveler/${user.id}`)
      .then((response) => {
        if (response.data.success) {
          const mappedContracts = response.data.data.$values.map((contract) => ({
            ...contract,
            tourName: JSON.parse(contract.details).tourName, // Extract tourName directly
          }));
          const sortedContracts = mappedContracts.sort((a, b) => {
            if (a.status === 'Created' && b.status !== 'Created') return -1;
            if (a.status !== 'Created' && b.status === 'Created') return 1;
            return 0;
          });
          setContracts(sortedContracts);

          console.log('Contracts:', sortedContracts);
          
        }
      })
      .catch((error) => {
        console.error('Error fetching contracts:', error);
      });
  }, [user.id]);
  
  const creactPayment = (tourInfo) => {
    const infoPayment = {
      tourName: 'Tour du lịch',
      tourId: tourInfo.tourId,
      localId: tourInfo.creator.id,
      travelerId: user.id,
      amount: 2000,
    };

    const form = document.createElement('form');
    form.action = 'https://travelmateapp.azurewebsites.net/api/order';
    form.method = 'GET';

    Object.keys(infoPayment).forEach((key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = infoPayment[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const viewContract = (contract) => {
    const createdAt = new Date(contract.createdAt);
    const now = new Date();
    const timeDifference = (now - createdAt) / 1000 / 60;
    const endDate = new Date(JSON.parse(contract.details).endDate);

    if (contract.status === 'Created' && timeDifference <= 3) {
      creactPayment(JSON.parse(contract.details));
    } else if (contract.status === 'Completed') {
      localStorage.setItem('contract_selected', JSON.stringify(contract));
      navigate(endDate <= now ? RoutePath.FINISH_CONTRACT_TRAVELLER : RoutePath.ONGOING_CONTRACT);
    }
  };

  const verifyContract = async (contract) => {
    try {
      const response = await axios.get(
        `https://travelmateapp.azurewebsites.net/api/BlockContract/verify-contract?travelerId=${user.id}&localId=${contract.localId}&tourId=${contract.tourId}&scheduleId=${contract.scheduleId}`
      );
      if (response.data.isValid) {
        toast.success('Hợp đồng đã được xác nhận');
      }
    } catch (error) {
      toast.error(error.response?.data.error || 'Error verifying contract');
    }
  };

  const columns = [
    {
      accessorKey: 'tourName', // Simplified accessorKey
      header: 'Tên tour',
      cell: (info) => {
        const tourName = info.getValue();
        return tourName.length > 50 ? `${tourName.substring(0, 50)}...` : tourName;
      },
      meta: {
        filterVariant: 'text', // Ensure it's a text filter
      },
    },
    {
      accessorKey: 'location',
      header: 'Địa điểm',
    },
    // {
    //   accessorKey: 'details.startDate',
    //   header: 'Ngày bắt đầu',
    //   cell: (info) => new Date(JSON.parse(info.row.original.details).startDate).toLocaleDateString(),
    //   meta: {
    //     filterVariant: 'date',
    //   },
    // },
    // {
    //   accessorKey: 'details.endDate',
    //   header: 'Ngày kết thúc',
    //   cell: (info) => new Date(JSON.parse(info.row.original.details).endDate).toLocaleDateString(),
    //   meta: {
    //     filterVariant: 'date',
    //   },
    // },
    {
      accessorKey: 'status',
      header: 'Trạng thái',
      cell: (info) => (
        <span
          className={`text-nowrap ${info.getValue() === 'Created'
            ? 'text-warning'
            : info.getValue() === 'Completed'
              ? 'text-success'
              : 'text-secondary'
            }`}
        >
          {info.getValue() === 'Created'
            ? 'Chưa thanh toán'
            : info.getValue() === 'Completed'
              ? 'Đã thanh toán'
              : info.getValue()}
        </span>
      ),
      meta: {
        filterVariant: 'select',
      },
    },
    {
      accessorKey: 'createdAt',
      header: 'Thời gian còn lại',
      cell: (info) =>
        info.row.original.status !== 'Completed' ? (
          <CountdownTimer createdAt={info.getValue()} />
        ) : null,
      meta: {
        filterVariant: null, // Disable filter input
      },
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => {
        const contract = row.original;
        return (
          <div className="d-flex gap-2">
            {contract.status === 'Created' &&
              (new Date() - new Date(contract.createdAt)) / 1000 / 60 <= 3 && (
                <Button variant="primary" onClick={() => viewContract(contract)}>
                  Thanh toán
                </Button>
              )}
            {contract.status !== 'Created' && (
              <Button
                variant="primary"
                onClick={() => viewContract(contract)}
                className="d-flex justify-content-center align-items-center"
              >
                <ion-icon name="alert-circle-outline" style={{ fontSize: '24px' }}></ion-icon>
              </Button>
            )}
            <Button
              variant="success"
              onClick={() => verifyContract(contract)}
              className="d-flex justify-content-center align-items-center"
            >
              <ion-icon name="shield-checkmark-outline" style={{ fontSize: '24px' }}></ion-icon>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: contracts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: setPagination,
    state: { pagination, globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className='table_contract_list'>
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ whiteSpace: 'nowrap' }}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  <div>
                    {header.column.getCanFilter() && header.column.columnDef.meta?.filterVariant !== null ? (
                      header.column.columnDef.meta?.filterVariant === 'date' ? (
                        <input
                          type="date"
                          value={header.column.getFilterValue() ?? ''}
                          onChange={e => header.column.setFilterValue(e.target.value)}
                        />
                      ) : header.column.columnDef.meta?.filterVariant === 'select' ? (
                        <select
                          value={header.column.getFilterValue() ?? ''}
                          onChange={e => header.column.setFilterValue(e.target.value)}
                        >
                          <option value="">All</option>
                          <option value="Created">Chưa thanh toán</option>
                          <option value="Completed">Đã thanh toán</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={header.column.getFilterValue() ?? ''}
                          onChange={e => header.column.setFilterValue(e.target.value)}
                          placeholder={`Tìm ${header.column.columnDef.header}...`}
                        />
                      )
                    ) : null}
                  </div>
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
        <ion-icon name="arrow-back-outline" style={{
          fontSize: '20px'
        }}></ion-icon>
        </button>
        <button className='btn btn-success d-flex justify-content-center align-items-center' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
        <ion-icon name="arrow-forward-outline" style={{
          fontSize: '20px'
        }}></ion-icon>
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

export default Contract;
