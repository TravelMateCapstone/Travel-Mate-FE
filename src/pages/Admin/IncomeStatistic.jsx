import React from 'react'
import ChartComponent from '../../components/Admin/ChartComponent'
import PieChartComponent from '../../components/Admin/PieChartComponent'
function IncomeStatistic() {
    return (
        <div id="wrapper">
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    {/* Container Fluid*/}
                    <div className="container-fluid" id="container-wrapper">
                        <div className="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="./">Home</a></li>
                                <li className="breadcrumb-item active" aria-current="page">Dashboard</li>
                            </ol>
                        </div>
                        <div className="row mb-3">
                            {/* Earnings (Monthly) Card Example */}
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-uppercase mb-1">Earnings (Monthly)</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">$40,000</div>
                                                <div className="mt-2 mb-0 text-muted text-xs">
                                                    <span className="text-success mr-2"><i className="fa fa-arrow-up" /> 3.48%</span>
                                                    <span>Since last month</span>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-calendar fa-2x text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Earnings (Annual) Card Example */}
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-uppercase mb-1">Sales</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">650</div>
                                                <div className="mt-2 mb-0 text-muted text-xs">
                                                    <span className="text-success mr-2"><i className="fas fa-arrow-up" /> 12%</span>
                                                    <span>Since last years</span>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-shopping-cart fa-2x text-success" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* New User Card Example */}
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-uppercase mb-1">New User</div>
                                                <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">366</div>
                                                <div className="mt-2 mb-0 text-muted text-xs">
                                                    <span className="text-success mr-2"><i className="fas fa-arrow-up" /> 20.4%</span>
                                                    <span>Since last month</span>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-users fa-2x text-info" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Pending Requests Card Example */}
                            <div className="col-xl-3 col-md-6 mb-4">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row no-gutters align-items-center">
                                            <div className="col mr-2">
                                                <div className="text-xs font-weight-bold text-uppercase mb-1">Pending Requests</div>
                                                <div className="h5 mb-0 font-weight-bold text-gray-800">18</div>
                                                <div className="mt-2 mb-0 text-muted text-xs">
                                                    <span className="text-danger mr-2"><i className="fas fa-arrow-down" /> 1.10%</span>
                                                    <span>Since yesterday</span>
                                                </div>
                                            </div>
                                            <div className="col-auto">
                                                <i className="fas fa-comments fa-2x text-warning" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Area Chart */}
                            <div className="col-xl-8 col-lg-7">
                                <div className="card mb-4">
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Monthly Recap Report</h6>
                                        <div className="dropdown no-arrow">
                                            <a className="dropdown-toggle" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                                <div className="dropdown-header">Dropdown Header:</div>
                                                <a className="dropdown-item" >Action</a>
                                                <a className="dropdown-item" >Another action</a>
                                                <div className="dropdown-divider" />
                                                <a className="dropdown-item" >Something else here</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <ChartComponent />
                                    </div>
                                </div>
                            </div>
                            {/* Pie Chart */}
                            <div className="col-xl-4 col-lg-5">
                                <div className="card mb-4">
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Products Sold</h6>
                                        <div className="dropdown no-arrow">
                                            <a className="dropdown-toggle btn btn-primary btn-sm" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                Month <i className="fas fa-chevron-down" />
                                            </a>
                                            <div className="dropdown-menu dropdown-menu-right shadow animated--fade-in" aria-labelledby="dropdownMenuLink">
                                                <div className="dropdown-header">Select Periode</div>
                                                <a className="dropdown-item" >Today</a>
                                                <a className="dropdown-item" >Week</a>
                                                <a className="dropdown-item active" >Month</a>
                                                <a className="dropdown-item" >This Year</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <PieChartComponent />
                                    </div>
                                    <div className="card-footer text-center">
                                        <a className="m-0 small text-primary card-link" >View More <i className="fas fa-chevron-right" /></a>
                                    </div>
                                </div>
                            </div>
                            {/* Invoice Example */}
                            <div className="col-xl-8 col-lg-7 mb-4">
                                <div className="card">
                                    <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-primary">Invoice</h6>
                                        <a className="m-0 float-right btn btn-danger btn-sm" >View More <i className="fas fa-chevron-right" /></a>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table align-items-center table-flush">
                                            <thead className="thead-light">
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Customer</th>
                                                    <th>Item</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><a >RA0449</a></td>
                                                    <td>Udin Wayang</td>
                                                    <td>Nasi Padang</td>
                                                    <td><span className="badge badge-success">Delivered</span></td>
                                                    <td><a className="btn btn-sm btn-primary">Detail</a></td>
                                                </tr>
                                                <tr>
                                                    <td><a >RA5324</a></td>
                                                    <td>Jaenab Bajigur</td>
                                                    <td>Gundam 90' Edition</td>
                                                    <td><span className="badge badge-warning">Shipping</span></td>
                                                    <td><a className="btn btn-sm btn-primary">Detail</a></td>
                                                </tr>
                                                <tr>
                                                    <td><a >RA8568</a></td>
                                                    <td>Rivat Mahesa</td>
                                                    <td>Oblong T-Shirt</td>
                                                    <td><span className="badge badge-danger">Pending</span></td>
                                                    <td><a className="btn btn-sm btn-primary">Detail</a></td>
                                                </tr>
                                                <tr>
                                                    <td><a >RA1453</a></td>
                                                    <td>Indri Junanda</td>
                                                    <td>Hat Rounded</td>
                                                    <td><span className="badge badge-info">Processing</span></td>
                                                    <td><a className="btn btn-sm btn-primary">Detail</a></td>
                                                </tr>
                                                <tr>
                                                    <td><a >RA1998</a></td>
                                                    <td>Udin Cilok</td>
                                                    <td>Baby Powder</td>
                                                    <td><span className="badge badge-success">Delivered</span></td>
                                                    <td><a className="btn btn-sm btn-primary">Detail</a></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer" />
                                </div>
                            </div>
                            {/* Message From Customer*/}
                            <div className="col-xl-4 col-lg-5 ">
                                <div className="card">
                                    <div className="card-header py-4 bg-primary d-flex flex-row align-items-center justify-content-between">
                                        <h6 className="m-0 font-weight-bold text-light">Message From Customer</h6>
                                    </div>
                                    <div>
                                        <div className="customer-message align-items-center">
                                            <a className="font-weight-bold" >
                                                <div className="text-truncate message-title">Hi there! I am wondering if you can help me with a
                                                    problem I've been having.</div>
                                                <div className="small text-gray-500 message-time font-weight-bold">Udin Cilok · 58m</div>
                                            </a>
                                        </div>
                                        <div className="customer-message align-items-center">
                                            <a >
                                                <div className="text-truncate message-title">But I must explain to you how all this mistaken idea
                                                </div>
                                                <div className="small text-gray-500 message-time">Nana Haminah · 58m</div>
                                            </a>
                                        </div>
                                        <div className="customer-message align-items-center">
                                            <a className="font-weight-bold" >
                                                <div className="text-truncate message-title">Lorem ipsum dolor sit amet, consectetur adipiscing elit
                                                </div>
                                                <div className="small text-gray-500 message-time font-weight-bold">Jajang Cincau · 25m</div>
                                            </a>
                                        </div>
                                        <div className="customer-message align-items-center">
                                            <a className="font-weight-bold" >
                                                <div className="text-truncate message-title">At vero eos et accusamus et iusto odio dignissimos
                                                    ducimus qui blanditiis
                                                </div>
                                                <div className="small text-gray-500 message-time font-weight-bold">Udin Wayang · 54m</div>
                                            </a>
                                        </div>
                                        <div className="card-footer text-center">
                                            <a className="m-0 small text-primary card-link" >View More <i className="fas fa-chevron-right" /></a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*Row*/}
                        <div className="row">
                            <div className="col-lg-12 text-center">
                                <p>Do you like this template ? you can download from <a href="https://github.com/indrijunanda/RuangAdmin" className="btn btn-primary btn-sm" target="_blank"><i className="fab fa-fw fa-github" />&nbsp;GitHub</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="sticky-footer bg-white">
                    <div className="container my-auto">
                        <div className="copyright text-center my-auto">
                            <span>copyright ©  - developed by
                                <b><a href="https://indrijunanda.gitlab.io/" target="_blank">indrijunanda</a></b>
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>

    )
}

export default IncomeStatistic