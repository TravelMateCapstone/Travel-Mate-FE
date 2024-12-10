import React, { useEffect, useState } from "react";
import { AgGridReact } from "@ag-grid-community/react";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import axios from "axios";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

function DestinationManagement() {
  const [rowData, setRowData] = useState([]);
  const [columnDefs] = useState([
    { field: "locationId", headerName: "ID", sortable: true, filter: true },
    { field: "locationName", headerName: "Location Name", sortable: true, filter: true },
    { field: "title", headerName: "Title", sortable: true, filter: true },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "image",
      headerName: "Image",
     
    },
    {
      field: "mapHtml",
      headerName: "Map",
    
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

  return (
    <div
      className="ag-theme-alpine"
      style={{ height: 500, width: "100%" }}
    >
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={{ flex: 1, resizable: true }}
      />
    </div>
  );
}

export default DestinationManagement;
