import { ModuleRegistry } from "@ag-grid-community/core";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { Card, Row, Col, Tabs, Tab, Button, Badge, Modal, InputGroup, FormControl } from "react-bootstrap";
import { useEffect, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import { fetchTransactionData, confirmTransaction, refundTransaction } from "../../apis/transaction_admin";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from "react-toastify";
import * as XLSX from 'xlsx';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const formatDate = (date) => {
	return format(new Date(date), 'dd/MM/yyyy', { locale: vi });
};

const formatCurrency = (amount) => {
	return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getStatusBadge = (status) => {
	switch (status) {
		case 0:
			return <Badge bg="danger">Chưa trả tiền</Badge>;
		case 1:
			return <Badge bg="success">Đã trả tiền</Badge>;
		case 2:
			return <Badge bg="warning">Đang hoàn tiền</Badge>;
		case 3:
			return <Badge bg="info">Đã hoàn tiền</Badge>;
		default:
			return <Badge bg="dark">Không xác định</Badge>;
	}
};

const Transaction = () => {
	const [key, setKey] = useState('transactions');
	const [rowData, setRowData] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [modalData, setModalData] = useState(null);
	const [quickFilter, setQuickFilter] = useState("");

	const onQuickFilterChange = (event) => {
		setQuickFilter(event.target.value);
	};

	useEffect(() => {
		const getTransactionData = async () => {
			try {
				const data = await fetchTransactionData();
				setRowData(data.$values);
			} catch (error) {
				console.error("Lỗi khi lấy dữ liệu giao dịch:", error);
			}
		};
		getTransactionData();
	}, []);

	const columnDefs = [
		{ headerName: "Tên Tour", field: "tourName" },
		{ headerName: "Ngày Bắt Đầu", field: "startDate", valueFormatter: (params) => formatDate(params.value), flex: 0.75 },
		{ headerName: "Ngày Kết Thúc", field: "endDate", valueFormatter: (params) => formatDate(params.value), flex: 0.75 },
		{
			headerName: "Trạng Thái Giao Dịch",
			field: "transactionStatus",
			cellRenderer: (params) => getStatusBadge(params.value)
		},
		{ headerName: "Tên Địa Người Phương", field: "localName" },
		{ headerName: "Tên Khách Du Lịch", field: "travelerName" },
		{ headerName: "Số Tiền", field: "amount", valueFormatter: (params) => formatCurrency(params.value) },
		{ headerName: "Số Tiền Còn Lại", field: "lastAmount", valueFormatter: (params) => formatCurrency(params.value) },
		{
			headerName: "Hành Động",
			field: "actions",
			cellRenderer: (params) => (
				<div className="d-flex gap-1">
					<Button variant="" size="sm" onClick={() => handleViewBankInfo(params.data)}><ion-icon name="ellipsis-vertical-outline"></ion-icon></Button>
					{params.data.transactionStatus !== 1 && (
						<Button variant="success" size="sm" onClick={() => handleConfirm(params.data)}>Xác Nhận</Button>
					)}
				</div>
			),
		},
	];

	const columnDefsRefund = [
		{ headerName: "Tên Tour", field: "tourName" },
		{ headerName: "Ngày Bắt Đầu", field: "startDate", valueFormatter: (params) => formatDate(params.value), flex: 0.75 },
		{ headerName: "Ngày Kết Thúc", field: "endDate", valueFormatter: (params) => formatDate(params.value), flex: 0.75 },
		{
			headerName: "Tình Trạng Hoàn tiền",
			field: "transactionStatus",
			cellRenderer: (params) => getStatusBadge(params.value)
		},
		{ headerName: "Tên Địa Người Phương", field: "localName" },
		{ headerName: "Tên Khách Du Lịch", field: "travelerName" },
		{ headerName: "Số Tiền", field: "amount", valueFormatter: (params) => formatCurrency(params.value), flex: 0.75 },
		{ headerName: "Số Tiền Còn Lại", field: "lastAmount", valueFormatter: (params) => formatCurrency(params.value), flex: 0.75 },
		{
			headerName: "Hành Động",
			field: "actions",
			cellRenderer: (params) => (
				<div className="d-flex gap-1">
					<Button variant="" size="sm" onClick={() => handleViewBankInfo(params.data)}><ion-icon name="ellipsis-vertical-outline"></ion-icon></Button>
					{params.data.transactionStatus !== 3 && (
						<Button variant="success" size="sm" onClick={() => handleConfirmRefund(params.data)}>Xác Nhận</Button>
					)}
				</div>
			),
		},
	];



	const handleViewBankInfo = (data) => {
		setModalData(data);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setModalData(null);
	};

	const handleConfirm = async (data) => {
		try {
			await confirmTransaction(data.id);
			toast.success("Xác nhận giao dịch cho: " + data.travelerName);
			setRowData((prevData) =>
				prevData.map((item) =>
					item.id === data.id ? { ...item, transactionStatus: 1 } : item
				)
			);
		} catch (error) {
			if (error.response.data === "Access Denied! Tour does not finish!") {
				toast.error("Tour chưa kết thúc, không thể xác nhận giao dịch");
			}
			else {
				toast.error("Lỗi khi xác nhận giao dịch: " + error.message);
			}
		}
	};

	const handleConfirmRefund = async (data) => {
		try {
			await refundTransaction(data.id);
			toast.success("Xác nhận hoàn tiền cho: " + data.travelerName);
			setRowData((prevData) =>
				prevData.map((item) =>
					item.id === data.id ? { ...item, transactionStatus: 3 } : item
				)
			);
		} catch (error) {
			if (error.response.data === "Access Denied! Tour does not finish!") {
				toast.error("Tour chưa kết thúc, không thể xác nhận hoàn tiền");
			} else {
				toast.error("Lỗi khi xác nhận hoàn tiền: " + error.message);
			}
		}
	};
		


	const exportToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(rowData);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
		XLSX.writeFile(workbook, "transactions.xlsx");
	};

	const exportRefundsToExcel = () => {
		const worksheet = XLSX.utils.json_to_sheet(filteredRefunds);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Refunds");
		XLSX.writeFile(workbook, "refunds.xlsx");
	};

	const filteredTransactions = rowData.filter(item => item.transactionStatus === 0 || item.transactionStatus === 1);
	const filteredRefunds = rowData.filter(item => item.transactionStatus === 2 || item.transactionStatus === 3);

	return (
		<div >
			<div className="mb-4">
				<Row>
					<Col md={4}>
						<Card>
							<Card.Body>
								<Card.Title>Tổng Số Giao Dịch</Card.Title>
								<h3>{rowData.length}</h3>
							</Card.Body>
						</Card>
					</Col>
					<Col md={4}>
						<Card>
							<Card.Body>
								<Card.Title>Tổng Số Tiền Giao Dịch</Card.Title>
								<h3>{formatCurrency(rowData.reduce((acc, curr) => acc + curr.amount, 0))}</h3>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</div>

			

			<Tabs
				id="controlled-tab-example"
				activeKey={key}
				onSelect={(k) => setKey(k)}
				className="mb-3 no-border-radius"
			>
				<Tab eventKey="transactions" title={<span>Danh Sách Giao Dịch <Badge bg="primary">{filteredTransactions.length}</Badge></span>}>
				<div className="d-flex justify-content-between align-items-center">
				<InputGroup className="mb-3 w-25">
					<FormControl
						placeholder="Tìm kiếm nhanh..."
						aria-label="Tìm kiếm nhanh"
						aria-describedby="basic-addon2"
						value={quickFilter}
						onChange={onQuickFilterChange}
					/>
				</InputGroup>
				<Button variant="success" onClick={exportToExcel}>Xuất file excel</Button>
			</div>
					<div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
						<AgGridReact
							rowData={filteredTransactions} // Use filtered transactions
							columnDefs={columnDefs}
							quickFilterText={quickFilter} // Add quick filter text
						/>
					</div>
				</Tab>
				<Tab eventKey="refunds" title={<span>Danh Sách Hoàn Tiền <Badge bg="danger">{filteredRefunds.length}</Badge></span>}>
				<div className="d-flex justify-content-between align-items-center">
				<InputGroup className="mb-3 w-25">
					<FormControl
						placeholder="Tìm kiếm nhanh..."
						aria-label="Tìm kiếm nhanh"
						aria-describedby="basic-addon2"
						value={quickFilter}
						onChange={onQuickFilterChange}
					/>
				</InputGroup>
				<Button variant="success" onClick={exportRefundsToExcel}>Xuất file excel</Button>
			</div>
				<div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
						<AgGridReact
							rowData={filteredRefunds} // Use filtered refunds
							columnDefs={columnDefsRefund}
							quickFilterText={quickFilter} // Add quick filter text
						/>
					</div>
				</Tab>
			</Tabs>

			<Modal show={showModal} onHide={handleCloseModal} centered>
				<Modal.Header closeButton>
					<Modal.Title>Thông Tin Ngân Hàng</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{modalData && (
						<div>
							<p>Tên Khách Du Lịch: {modalData.travelerName}</p>
							<p>Số Tài Khoản: {modalData.bankAccount}</p>
							<p>Ngân Hàng: {modalData.bankName}</p>
							{/* Add more bank information fields as needed */}
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Đóng
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Transaction;
