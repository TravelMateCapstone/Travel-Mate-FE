import React, { useEffect, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import axios from "axios";
import { useSelector } from "react-redux";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function DestinationManagement() {
    const [rowData, setRowData] = useState([]);
    const [quickFilterText, setQuickFilterText] = useState("");
    const token = useSelector((state) => state.auth.token );
    const [columnDefs] = useState([
        { field: "locationId", headerName: "ID", sortable: true, filter: true, },
        { field: "locationName", headerName: "Tên địa điểm", sortable: true, filter: true, },
        { field: "title", headerName: "Tiêu đề", sortable: true, filter: true, editable: true },
        { field: "description", headerName: "Mô tả", flex: 2, editable: true },
        {
            field: "image",
            headerName: "Ảnh",
            editable: true,
        },
        {
            field: "mapHtml",
            headerName: "Map",
            editable: true,
        },
        {
            headerName: "Hành động",
            width: 100,
            cellRenderer: (params) => (
                <div className="d-flex gap-2 align-items-center">
                    <button className="btn btn-primary btn-sm">
                        <ion-icon name="information-circle-outline"></ion-icon>
                    </button>
                    <button className="btn btn-danger btn-sm">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            ),
        },
    ]);

    useEffect(() => {
        axios
            .get("https://travelmateapp.azurewebsites.net/api/Locations")
            .then((response) => {
                setRowData(response.data.$values);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const onCellValueChanged = (event) => {
        const updatedData = event.data;
        const id = updatedData.locationId;

        axios
            .put(`https://travelmateapp.azurewebsites.net/api/Locations/${id}`, updatedData, {
                headers: {
                    Authorization: `${token}`,
                },
            })
            .then((response) => {
                alert('Cập nhật thành công');
                console.log("Cập nhật thành công:", response.data);
            })
            .catch((error) => {
                alert('Cập nhật thất bại');
                console.error("Lỗi khi cập nhật dữ liệu:", error);
            });
    };

    return (
        <div>
            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm nhanh..."
                    onChange={(e) => setQuickFilterText(e.target.value)}
                />
            </div>
            <div
                className="ag-theme-alpine"
                style={{ height: 500, width: "100%" }}
            >
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={{ flex: 1, resizable: true }}
                    quickFilterText={quickFilterText}
                    onCellValueChanged={onCellValueChanged}
                />
            </div>
        </div>
    );
}

export default DestinationManagement;
