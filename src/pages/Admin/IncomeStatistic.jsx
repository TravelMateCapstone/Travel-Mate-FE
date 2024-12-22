import React, { useEffect, useState } from 'react';
import ChartComponent from '../../components/Admin/ChartComponent';
import PieChartComponent from '../../components/Admin/PieChartComponent';
import { Card, Placeholder, Row, Col, Spinner } from 'react-bootstrap';

function IncomeStatistic() {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        fetch('https://travelmateapp.azurewebsites.net/api/AdminDashboard')
            .then(response => response.json())
            .then(data => setDashboardData(data))
            .catch(error => console.error('Error fetching dashboard data:', error));
    }, []);

    const renderPlaceholderCard = (title) => (
        <Card className="h-100">
            <Card.Body>
                <Row className="align-items-center">
                    <Col>
                        <Card.Title className="text-xs font-weight-bold text-uppercase mb-1">
                            {title}
                        </Card.Title>
                        <Placeholder as="p" animation="wave">
                            <Placeholder xs={6} />
                        </Placeholder>
                    </Col>
                    <Col className="col-auto">
                        <Spinner animation="border" variant="primary" />
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );

    const renderPlaceholderChart = () => (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
            <Spinner animation="border" variant="primary" />
        </div>
    );

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (!dashboardData) {
        return (
            <div id="wrapper">
                <div id="content-wrapper" className="d-flex flex-column">
                    <div id="content">
                        <div className="container-fluid" id="container-wrapper">
                            <div className="d-sm-flex align-items-center justify-content-between mb-4">
                                <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                            </div>
                            <Row className="mb-3">
                                <Col xl={3} md={6} className="mb-4">
                                    {renderPlaceholderCard('Doanh thu (Tổng)')}
                                </Col>
                                <Col xl={3} md={6} className="mb-4">
                                    {renderPlaceholderCard('Số lượng chuyến đi')}
                                </Col>
                                <Col xl={3} md={6} className="mb-4">
                                    {renderPlaceholderCard('Người dùng')}
                                </Col>
                                <Col xl={3} md={6} className="mb-4">
                                    {renderPlaceholderCard('Số lượng báo cáo')}
                                </Col>
                            </Row>
                            <div className="container-fluid">
                                <Row>
                                    <Col xl={8} lg={7}>{renderPlaceholderChart()}</Col>
                                    <Col xl={4} lg={5}>{renderPlaceholderChart()}</Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const { revenue, totalTrips, totalUsers, totalReports, monthlyRevenues } = dashboardData;

    return (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <div className="container-fluid" id="container-wrapper">
                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="./">Home</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                            </ol>
                        </div>
                        <Row className="mb-3">
                            <Col xl={3} md={6} className="mb-4">
                                <Card className="h-100">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col>
                                                <Card.Title className="text-xs font-weight-bold text-uppercase mb-1">
                                                    Doanh thu (Tổng)
                                                </Card.Title>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                    {formatCurrency(revenue)}
                                                </div>
                                            </Col>
                                            <Col className="col-auto">
                                                <i className="fas fa-calendar fa-2x text-primary" />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={3} md={6} className="mb-4">
                                <Card className="h-100">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col>
                                                <Card.Title className="text-xs font-weight-bold text-uppercase mb-1">
                                                    Số lượng chuyến đi
                                                </Card.Title>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{totalTrips}</div>
                                            </Col>
                                            <Col className="col-auto">
                                                <i className="fas fa-plane fa-2x text-success" />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={3} md={6} className="mb-4">
                                <Card className="h-100">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col>
                                                <Card.Title className="text-xs font-weight-bold text-uppercase mb-1">
                                                    Người dùng
                                                </Card.Title>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{totalUsers}</div>
                                            </Col>
                                            <Col className="col-auto">
                                                <i className="fas fa-users fa-2x text-info" />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={3} md={6} className="mb-4">
                                <Card className="h-100">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col>
                                                <Card.Title className="text-xs font-weight-bold text-uppercase mb-1">
                                                    Số lượng báo cáo
                                                </Card.Title>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">{totalReports}</div>
                                            </Col>
                                            <Col className="col-auto">
                                                <i className="fas fa-exclamation-circle fa-2x text-danger" />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <div className="container-fluid">
                            <Row>
                                <Col xl={8} lg={7}>
                                    <ChartComponent monthlyData={monthlyRevenues.$values} />
                                </Col>
                                <Col xl={4} lg={5}>
                                    <PieChartComponent monthlyData={monthlyRevenues.$values} />
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    );
}

export default IncomeStatistic;