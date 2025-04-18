import { useLocation, useParams, Link } from 'react-router-dom'
import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DataContext } from '../utils/Context';
import MinerForm from './AddMinerForm';
import { activeMiner, blockMiner, deleteMiner, ImageUrl, releaseMinerPayout, releaseSpoMinerPayout, updateResale } from '../services/Constant';
import EditMinerForm from './EditMinerForm';

function TableMiner({title, sub, dataUrl, pageSize = 10,}) {
    const {session} = useContext(DataContext)
  const {status} = useParams();
  const location = useLocation();
  const basePath = "/" + location.pathname.split("/")[1];
  const lastPath = "/" + location.pathname.split("/")[2];
  const [FormData, setFormData] = useState({})
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [MinerVal, setMinerVal] = useState(null)
  const [Refresh, setRefresh] = useState(false)

  const toggleExpand = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  
  useEffect(() => {
      setData([]);
      getData(dataUrl,);
  }, [dataUrl,location.pathname, Refresh]);

  const getData = async (url) => {
    setData([]);
    console.log(url)
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      // console.log(result)
        setData(result.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderPic = (data) => {
    return data.map((imgSrc, index) => (
      <img key={index} src={ImageUrl + imgSrc} alt={`Uploaded ${index}`} style={{ width: "50px", height: "50px", margin: "5px" }} />
    ));
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    const {name, value} = e.target;
    // console.log(name, value);
    setFormData({...FormData, [name]: value });
  }
  const handleMinerViewData = (e, row)=>{
    e.preventDefault();
    setMinerVal(row);
  }
  // const handleDelete = (e,data) => {
  //   e.preventDefault();
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       let res = await fetch(`${deleteMiner}/${data._id}`,{
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         credentials: "include"
  //       })
  //       let resp = await res.json();
  //       if(resp.status){
  //         getData(dataUrl);
  //         Swal.fire("Deleted!", resp.message, "success");
  //       }else{
  //         Swal.fire("Error!", "Miner could not be deleted.", "error");
  //       }
  //     }
  //   });
  // }

  const handleSold = (e,data) => {
    e.preventDefault();
    let view = !data.soldStatus ? "In Stock" : "Sold Out";
    Swal.fire({
      title: `Are you sure to ${view} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${view} it!`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        let res = await fetch(`${activeMiner}/${data._id}`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({soldStatus:!data.soldStatus})
        });
        let resp = await res.json();
        if(resp.status){
          getData(dataUrl);
          Swal.fire("Sold!", `Miner has been ${view}.`, "success");
        }else{
          Swal.fire("Error!", `Miner could not be ${view}.`, "error");
        }
      }
    });
  }
  const handleBlock = (e,data) => {
    e.preventDefault();
    let view = data.status ? "Inactive" : "Active";
    Swal.fire({
      title: `Are you sure to ${view} ?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${view} it!`,
    }).then(async(result) => {
      if (result.isConfirmed) {
        let res =  await fetch(`${blockMiner}/${data._id}`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({status:!data.status})
        });
        let resp = await res.json();
        if(resp.status){
          getData(dataUrl);
          Swal.fire("Blocked!", `Miner has been ${view}.`, "success");
        }else{
          Swal.fire("Error!", `Miner could not be ${view}.`, "error");
        }
      }
    });
  }
  const statusText = (status) => status ? <span className="text-success">Active</span> : <span className="text-danger">Disabled</span>;
  const statusResaleResp = (status) => status ? <span className="text-success">Sale It</span> : <span className="text-danger">Wait for response</span>;
  const statusSold = (status) => status ? <span className="text-success">In Stock</span> : <span className="text-danger">Sold Out</span>;
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).replace(" ", ", ");
};
  const formatType = (type) => (
    <span className={`fw-bold ${type === "Deposit" ? "text-success" : "text-danger"}`}>{type}</span>
  );
  const filteredData = data.filter((row) =>
    Object.values(row).some((cell) => cell?.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  useEffect(() => setCurrentPage(1), [searchTerm]);
  const handleUpdateSale = async(e, item) =>{
    e.preventDefault();
    if (!item || Object.keys(item).length === 0 || !item._id) {
      Swal.fire({
        title: "Error!",
        text: "Miner not found or invalid data.",
        icon: "error",
      });
      return;
    }
    if (item.resaleAmount === 0 && !FormData.resaleAmount) {
      Swal.fire({
        title: "Error!",
        text: "Please enter required Resale Amount details.",
        icon: "error",
      });
      return;
    }
    if (item.resaleAmount !== 0 && !FormData.resaleTrans) {
      Swal.fire({
        title: "Error!",
        text: "Please enter required Hash details.",
        icon: "error",
      });
      return;
    }
  let response = await fetch(`${updateResale}/${item._id}`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(FormData),
  });
  let res = await response.json();
  if(res.status){
    setRefresh(!Refresh);
    Swal.fire({
      title:"Resale Miner",
      text:res.message,
      icon:'success'
    })
  }else{
    Swal.fire({
      title:"Resale Miner",
      text:res.message,
      icon:'error'
    })
  }
  console.log(res)
  }
  const currentData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const generateTableDataArray = () => {
    return currentData
      .map((row, index) => {
        switch (lastPath) {
          case "/all":
            return {Pic:renderPic(row?.minerPics || []), Model: row?.specification?.[1].value || '', Release: formatDate(row.createdAt), Hashrate: row?.hashrate || '', Power: row?.consumption || '', Top: row?.adaAmount?.toFixed(2) || 0.00, Algorithm: row.algorithm || '', "Best Price": row?.minerPrice || 0.00, Profit: row?.minerProfitPerHr?.toFixed(2) || 0.00,Sold:statusSold(row.soldStatus || false), Status: statusText(row.status || false),
              Control:<><i className='fa fa-list me-2 text-success' alt="View Miner"  data-bs-toggle="modal" data-bs-target="#ViewTransModal" onClick={(e)=>handleMinerViewData(e, row)}></i> <i className='fa fa-edit me-2 text-warning' alt="Edit Miner"  data-bs-toggle="modal" data-bs-target="#ViewMinerModal" onClick={(e)=>handleMinerViewData(e, row)}></i> <i className='fa fa-shopping-cart me-2 text-primary' onClick={(e)=>handleSold(e, row)} alt="Sold Out"></i> <i className='fa fa-ban me-2 text-secondary' onClick={(e)=>handleBlock(e, row)} alt="Disable"></i> </>, Action:"" };
          case "/orders":
            return {"#": index + 1, Pic:renderPic(row?.minerId?.minerPics || []), Model: row?.minerId?.specification?.[1].value || '', Release: formatDate(row.createdAt), "Order By": row?.userId?.userId || '', "Product Price": row.productPrice || 0.00, Profit: row?.minerId?.minerProfitPerHr?.toFixed(2) || 0.00, Status: statusText(row.status || false),
                  Control:<> </>, Action:"" };
          case "/resale":
              return {"#": index + 1,Model: row?.minerId?.specification?.[1].value || '', Release: formatDate(row.createdAt), Price: "$"+row?.orderId?.productPrice?.toFixed(2) || 0.00, Earning: row?.minerId?.minerProfitPerHr?.toFixed(2) || 0.00, "Resale BY": row?.userId?.userId || '', "Resale Amount": <input type="number" className='form-control' name="resaleAmount" value={row.resaleAmount || FormData.resaleAmount} onChange={handleInputChange} placeholder='Enter Resale Amount' readOnly={row.resaleAmount !==0 ? true : false} />, "User Responce": statusResaleResp(row.responseStatus|| false), Hash:  row.responseStatus && <input type="text" className='form-control' name="resaleTrans" value={row.resaleTrans || FormData.resaleTrans} onChange={handleInputChange} placeholder='Enter Hash' readOnly={row.resaleTrans ? true :false} />, Status: row.resaleTrans ? statusSold(false) : statusSold(true),
                Control:row.resaleTrans ? <span className='btn btn-light'><i className='fa fa-ban text-danger' ></i></span> :<span className='btn btn-light'  onClick={(e)=>handleUpdateSale(e, row)} ><i className='fa fa-upload text-success'alt="Delete Miner"></i></span>, Action:"" };
          case "/transaction":
              return {"#": index + 1, Model: row?.minerId?.specification?.[1].value || '', Release: formatDate(row.createdAt), Price: row?.minerId?.minerPrice?.toFixed(2) || 0.00, Profit: row?.minerId?.minerProfitPerHr?.toFixed(2) || 0.00, "To User": row?.userId?.userId || '', Payout: row?.adaAmount?.toFixed(6) || 0.00, Status: statusText(row.status || false),
                        Control:<span><i className='fa fa-send me-2 text-success' alt="View Miner"  onClick={(e)=>handleRelease(e, row)}></i></span>, Action:"" };
          case "/transactionSpo":
              return {"#": index + 1, Model: row?.minerId?.specification?.[1].value || '', Release: formatDate(row.createdAt), Price: row?.minerId?.minerPrice?.toFixed(2) || 0.00, Level:row.level, Profit: row?.minerId?.minerProfitPerHr?.toFixed(2) || 0.00, "To User": row?.userId?.userId || '', Payout: row?.adaAmount?.toFixed(6) || 0.00, Status: statusText(row.status || false),
                                  Control:<span><i className='fa fa-send me-2 text-success' alt="View Miner"  onClick={(e)=>handleSpoRelease(e, row)}></i></span>, Action:"" };
          case "/releasedPayout":
              return {"#": index + 1, Model: row?.minerId?.specification?.[1].value || '', Release: formatDate(row.createdAt), Price: row?.minerId?.minerPrice?.toFixed(2) || 0.00, Level:row.level, Profit: row?.minerId?.minerProfitPerHr?.toFixed(2) || 0.00, "To User": row?.userId?.userId || '', Payout: row?.adaAmount?.toFixed(6) || 0.00, Status: statusText(row.status || false),
                                                        Control:<span></span>, Action:"" };
          default:
            return null;
        }
      })
      .filter(Boolean);
  };
  const getTableHeaders = () => {
    switch (lastPath) {
      case "/all":
        return ["Pic","Model", "Release", "Hashrate", "Power", "Top", "Algorithm","Best Price", "Profit","Sold","Status","Control","Action"];
      case "/orders":
        return ["#", "Pic","Model", "Release", "Order By","Product Price", "Profit","Status","Control","Action"];
      case "/resale":
        return ["#", "Model", "Release", "Price", "Earning", "Resale BY", "Resale Amount", "User Responce", "Hash", "Status","Control","Action"];
      case "/transaction":
        return ["#", "Model", "Release","Price", "Profit", "To User", "Payout", "Status","Control","Action"];
      case "/transactionSpo":
        return ["#", "Model", "Release","Price", "Profit", "To User", "Level","Payout", "Status","Control","Action"];
      case "/releasedPayout":
        return ["#", "Model", "Release","Price", "Profit", "To User", "Level", "Payout", "Status","Control","Action"];
      default:
        return [];
    }
  };
  
  const tableHeaders = getTableHeaders();

  const exportToCSV = () => {
    const data = generateTableDataArray();
    if (!Array.isArray(data)) {
        console.error("generateTableDataArray did not return an array:", data);
        return;
    }

    // Define the header title and column headers
    const headers = Object.keys(data[0] || {});
    const modifiedData = [
        ["MY GREEN POOL STACK"], // Title header
        headers.map(h => h.toUpperCase()), // Column headers in uppercase
        ...data.map(row => Object.values(row))
    ];

    const csv = Papa.unparse(modifiedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table_data.csv");
};


const exportToExcel = () => {
  const data = generateTableDataArray();
  if (!Array.isArray(data)) {
      console.error("generateTableDataArray did not return an array:", data);
      return;
  }

  const headers = Object.keys(data[0] || {});
  const modifiedData = [
      ["MY GREEN POOL STACK"], // Title header
      headers.map(h => h.toUpperCase()), // Column headers in uppercase
      ...data.map(row => Object.values(row))
  ];

  const ws = XLSX.utils.aoa_to_sheet(modifiedData);
  const wb = XLSX.utils.book_new();

  // Apply styling - bold headers, alternating row colors
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_ref = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cell_ref]) continue;

          if (R === 0) { 
              // Green background with white text for title
              ws[cell_ref].s = { fill: { fgColor: { rgb: "228B22" } }, font: { color: { rgb: "FFFFFF" }, bold: true } };
          } else if (R === 1) { 
              // Gray background for column headers
              ws[cell_ref].s = { fill: { fgColor: { rgb: "A9A9A9" } }, font: { color: { rgb: "FFFFFF" }, bold: true } };
          } else if (R % 2 === 0) { 
              // Light gray alternating rows
              ws[cell_ref].s = { fill: { fgColor: { rgb: "F0F0F0" } } };
          }
      }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "table_data.xlsx");
};


const copyToClipboard = () => {
  const data = generateTableDataArray();
  if (!Array.isArray(data)) {
      console.error("generateTableDataArray did not return an array:", data);
      return;
  }

  const headers = Object.keys(data[0] || {});
  const text = `MY GREEN POOL STACK\n${headers.join("\t")}\n` + 
      data.map(row => Object.values(row).join("\t")).join("\n");

  navigator.clipboard.writeText(text).then(() => {
      Swal.fire("Copied!", "Table data copied to clipboard.", "success");
  });
};


const exportToPdf = () => {
    const data = generateTableDataArray();
    if (!data || data.length === 0) {
      alert("No data available to export!");
      return;
    }
    const doc = new jsPDF();

    // ✅ Add Brand Name as Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // White text
    doc.setFillColor(34, 139, 34); // Green background
    doc.rect(10, 10, 190, 10, "F"); // Draw filled rectangle
    doc.text("MY GREEN POOL STACK", 105, 17, { align: "center" });

    const tableColumn = Object.keys(data[0]);

    // ✅ Prepare Table Rows
    const tableRows = data.map((row, index) => {
      return tableColumn.map((key) => row[key] || "N/A");
    });
    console.log(tableColumn, tableRows)
    // ✅ Add Table to PDF
    autoTable(doc, {
      head: [tableColumn], // Set dynamic column headers
      body: tableRows, // Set dynamic row values
      startY: 25, // Move table down to avoid overlapping title
      theme: "grid",
      headStyles: { fillColor: [169, 169, 169], textColor: [255, 255, 255] }, // Grey header with white text
      styles: { fontSize: 10, cellPadding: 3 }, // Adjust readability
      alternateRowStyles: { fillColor: [240, 240, 240] }, // Light grey background for even rows
    });

    // ✅ Save PDF
    doc.save("table_data.pdf");
  };
  
  const handleReleaseAll = (e) =>{
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to release all payout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Release it!"
    }).then(async (res) => {
      if (res.isConfirmed) {
        let responce = await fetch(releaseMinerPayout,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({session}),
        });
        let result = await responce.json();
        if(result.status){
          getData(dataUrl,);
          Swal.fire("Success", result.message, "success");
        }else{
          Swal.fire("Error", result.message, "error");
        }
      }else{
        return;
      }
    });
  }
  const handleReleaseSpoAll = (e) =>{
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You want to release all payout",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Release it!"
    }).then(async (res) => {
      if (res.isConfirmed) {
        let responce = await fetch(releaseSpoMinerPayout,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({session}),
        });
        let result = await responce.json();
        if(result.status){
          getData(dataUrl,);
          Swal.fire("Success", result.message, "success");
        }else{
          Swal.fire("Error", result.message, "error");
        }
      }else{
        return;
      }
    });
  }
  const handleRelease = (e, item) =>{
    e.preventDefault();
    Swal.fire({
        title: "Are you sure?",
      text: `You want to release ${item?.adaAmount || 0.00} ada payout for userId:- ${item?.userId.userId || "Unknown"}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Release it!"
  }).then(async (res)=>{
      if(res.isConfirmed){
        let responce = await fetch(`${releaseMinerPayout}/${item?.userId?._id}`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({session}),
        });
        let result = await responce.json();
        if(result.status){
          getData(dataUrl,);
          Swal.fire("Success", result.message, "success");
        }else{
          Swal.fire("Error", result.message, "error");
        }
      }else{
        return;
      }
  });
  }
  const handleSpoRelease = (e, item) =>{
    e.preventDefault();
    Swal.fire({
        title: "Are you sure?",
      text: `You want to release ${item?.adaAmount || 0.00} ada payout for userId:- ${item?.userId.userId || "Unknown"}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Release it!"
  }).then(async (res)=>{
      if(res.isConfirmed){
        let responce = await fetch(`${releaseSpoMinerPayout}/${item?.userId?._id}`,{
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({session}),
        });
        let result = await responce.json();
        if(result.status){
          getData(dataUrl,);
          Swal.fire("Success", result.message, "success");
        }else{
          Swal.fire("Error", result.message, "error");
        }
      }else{
        return;
      }
  });
  }
  function sumAdaAmount(data) { return data.reduce((sum, item) => sum + (item?.adaAmount || 0), 0); }
  const getPaginationRange = (totalPages, currentPage, delta = 2) => {
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);
  
    range.push(1); // always show first page
  
    if (left > 2) {
      range.push("...");
    }
  
    for (let i = left; i <= right; i++) {
      range.push(i);
    }
  
    if (right < totalPages - 1) {
      range.push("...");
    }
  
    if (totalPages > 1) {
      range.push(totalPages); // always show last page
    }
  
    return range;
  };
  
  return (
              <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">{status}
                      {status === "all" && <span style={{float:"right", padding:"4px"}} className="text-right float-right border border-white rounded-3" data-bs-toggle="modal" data-bs-target="#FormModal" ><i className="fa fa-spin fa-cog"></i> Add Miners</span>}
                      </h4>
                      {status === "transaction" && <><span className='btn btn-primary m-2'>Remaining :- ${sumAdaAmount(currentData) || 0.00}</span><span style={{float:"right",}} className="text-right float-right btn btn-success" onClick={handleReleaseAll} ><i className='fa fa-send' /> Release All ROI Payout</span></>}
                      {status === "transactionSpo" && <><span className='btn btn-primary m-2'>Remaining :- ${sumAdaAmount(currentData) || 0.00}</span><span style={{float:"right",}} className="text-right float-right btn btn-success" onClick={handleReleaseSpoAll} ><i className='fa fa-send' /> Release All SPO Payout</span></>}
                        <hr />
                    <div className="row justify-between g-2 with-export">
            <div className="col-4 col-sm-6">
              <input type="text" className='form-control' placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: "4px", border: "1px solid #ccc", width:"50%" }} />
            </div>
            <div className="col-8 col-sm-6 text-end">
              <button className="btn btn-light btn-sm mx-1" onClick={copyToClipboard} title="Copy to Clipboard">
                <i className="fa fa-copy text-primary"></i>
              </button>

              <button className="btn btn-light btn-sm mx-1" onClick={exportToCSV} title="Export to CSV">
                <i className="fa fa-file-word-o text-secondry"></i>
              </button>

              <button className="btn btn-light btn-sm mx-1" onClick={exportToExcel} title="Export to Excel">
                <i className="fa fa-file-excel-o text-success"></i>
              </button>

              <button className="btn btn-light btn-sm mx-1" onClick={exportToPdf} title="Export to PDF">
                <i className="fa fa-file-pdf-o text-danger"></i>
              </button>
            </div>

          </div>
                    <div className="table-responsive">
          <table className="table table-hover">
          <thead>
  <tr>
    <th>#</th>
    {getTableHeaders().map((header, index) => (
      <th 
        key={index} 
        className={header === "Action" ? "d-md-none" : index > 2 ? "d-none d-md-table-cell" : ""}
      >
        {header}
      </th>
    ))}
  </tr>
</thead>
<tbody>
{generateTableDataArray().map((row, index) => (
  <React.Fragment key={index}>
    <tr>
      {/* Serial Number Column */}
      <td>{(currentPage - 1) * pageSize + index + 1}</td>

      {/* Rest of your columns */}
      {getTableHeaders().map((header, i) =>
        header === "Action" ? null : (
          <td key={i} className={i > 2 ? "d-none d-md-table-cell" : ""}>
            {header === "User" ? (
              <img src="assets/images/faces-clipart/pic-1.png" alt="image" />
            ) : (
              row[header]
            )}
          </td>
        )
      )}

      {/* Mobile Action Button */}
      <td className="d-md-none" key={"new"}>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => toggleExpand(index)}
        >
          {expandedRows[index] ? "−" : "+"}
        </button>
      </td>
    </tr>

    {/* Mobile Collapsible Content */}
    {expandedRows[index] && (
      <tr className="d-md-none">
        <td colSpan="4">
          <ul className="list-group text-start">
            {getTableHeaders().map(
              (header, i) =>
                i > 2 &&
                header !== "Action" && (
                  <li key={i} className="list-group-item text-dark">
                    <strong>{header}:</strong> {row[header]}
                  </li>
                )
            )}
          </ul>
        </td>
      </tr>
    )}
  </React.Fragment>
))}



  {/* No Data Message */}
  {generateTableDataArray().length === 0 && (
    <tr>
      <td colSpan={getTableHeaders().length}>No data available</td>
    </tr>
  )}
</tbody>

            </table>
  </div>
  <div className="d-flex justify-content-between align-items-center mt-2">
  {/* Previous Button */}
  <button
    className="btn btn-outline-primary btn-sm"
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
  >
    Previous
  </button>

  {/* Inline Page Count */}
  <div className="d-flex gap-1 flex-wrap align-items-center">
    {getPaginationRange(totalPages, currentPage).map((page, index) =>
      page === "..." ? (
        <span key={index} className="btn btn-sm btn-light disabled px-2">...</span>
      ) : (
        <button
          key={index}
          className={`btn btn-sm px-2 ${currentPage === page ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      )
    )}
  </div>

  {/* Next Button */}
  <button
    className="btn btn-outline-primary btn-sm"
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
  >
    Next
  </button>
</div>

                  </div>
                </div>
                <MinerForm />
                <EditMinerForm  minerVal={MinerVal} />
              </div>
  )
}

export default TableMiner
