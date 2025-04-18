import { useLocation, useParams, Link } from 'react-router-dom'
import React, { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DataContext } from '../utils/Context';
import { deleteTrans, deleteUser, loginActivity, updateTrans, updateUser } from '../services/Constant';
import { calculateTotalStats } from '../utils/healper';

function TableData({title, sub, dataUrl, pageSize = 10,}) {
  const {session} = useContext(DataContext);
  const {status} = useParams();
  const location = useLocation();
  const basePath = "/" + location.pathname.split("/")[1];
  const [formData, setFormData] = useState({ f_name: "", l_name: "",gender:"", phone: "",script:"<script defer src=",status:"",responseRemark:""});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [Val, setVal] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [qrData, setQrData] = useState(null);
  const toggleExpand = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  useEffect(() => {
      getData(dataUrl);
  }, [dataUrl]);
  const getData = async (url) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      console.log(result.data)
      if (result.status) { setData(result.data || []); } else { Swal.fire({ icon: "error", title: "Oops...", text: result.message }); }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleList= async(e, val) => {
    e.preventDefault();
    let res = await fetch(loginActivity,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({userId: val._id,})
    });
    let resp = await res.json();
    if(resp.status){
      setActivityData(resp.data);
    }else{
      Swal.fire({ icon: "error", title: "Oops...", text: resp.message });
    }
  }
  const handleEye = async (e, val) => {
    e.preventDefault();
    if(val)
      {
        formData.status = !val.status;
        Object.keys(formData).forEach(key => { if (formData[key] === "") { delete formData[key]; } });
        Swal.fire({
          title: "Are you sure?",
          text: `You want to change the status of ${val.userId}!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Yes, update it!",
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await fetch(`${updateUser}/${val._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body:JSON.stringify(formData)
              });
              const res = await response.json();
              if (res.status) {
                getData(dataUrl);
                setFormData({ f_name: "", l_name: "",gender:"", phone: "",script:"",status:""});
                Swal.fire("Updated!", res.message, "success");
              } else {
                Swal.fire("Error!", res.message, "error");
              }
            } catch (error) {
              console.error("Error deleting data:", error);
            }
          }
        })
      }else{
      Swal.fire({ icon: "error", title: "Oops...", text:"Something went wrong !!" });
    }
  }

  const handleDelete = async (e, val) => {
    e.preventDefault();
    if(val)
      {
        Swal.fire({
          title: "Enter Password to Confirm",
          input: "password",
          inputAttributes: {
            autocapitalize: "off",
            placeholder: "Enter your password",
            required: true
          },
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Confirm & Delete",
          preConfirm: (password) => {
            if (!password) {Swal.showValidationMessage("Password is required!"); return false; }
            return password;
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              const enteredPassword = result.value;
              if (enteredPassword !== '54321') {Swal.fire("Error!", "Incorrect password!", "error"); return; }
              const deleteResponse = await fetch(
                basePath === "/users" ? `${deleteUser}/${val._id}` : `${deleteTrans}/${val._id}`,
                {method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ type: val.type }) }
              );
              const res = await deleteResponse.json();
              if (res.status) {getData(dataUrl); Swal.fire("Deleted!", res.message, "success"); } else { Swal.fire("Error!", res.message, "error"); }
            } catch (error) {
              console.error("Error deleting data:", error);
              Swal.fire("Error!", "Something went wrong.", "error");
            }
          }
        });        
      }else{
      Swal.fire({ icon: "error", title: "Oops...", text:"Something went wrong !!" });
    }
  }


  const statusText = (status) => status ? <span className='text-success'>Active</span> : <span className='text-danger'>Inactive</span>;
  const statusTransText = (status) => status === 1 ? <span className='text-success'>Accepted</span> : status === 0 ? <span className='text-warning'>Pending</span> : <span className='text-danger'>Rejected</span> ;
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {day: "2-digit", month: "short", year: "numeric", }).replace(" ", ", "); };
  const formatType = (type) => (<span className={`fw-bold ${type === "Deposit" ? "text-success" : "text-danger"}`}>{type}</span> );
  const filteredData = data.filter((row) =>
    ["email", "f_name", "l_name", "userId","phone","sponcerBy","destWalletAddress"].some((key) =>
      row[key]?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ) || row.userId?.userId?.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  useEffect(() => setCurrentPage(1), [searchTerm]);
  const currentData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const generateTableDataArray = () => {
    return currentData
      .map((row, index) => {
        switch (basePath) {
          case "/users":
            return {ID: row.userId , Email: row.email, Sponsor: row.sponcerBy, Wallet: "$ "+row?.walletAmount?.toFixed(4), Stake: row?.personalStack?.toFixed(3) ? "$ "+row?.personalStack?.toFixed(3) : "$ "+0, Insure: !row.insurence || row.insurence === 0 ? "No Insurence" :"$ "+row?.insurence?.toFixed(3), "Total Team":calculateTotalStats(currentData, row?.userId)?.totalUsersCount, "Team Stakeing":calculateTotalStats(currentData, row?.userId)?.totalPersonalStack?.toFixed(2), "Team Insure":calculateTotalStats(currentData, row?.userId)?.totalInsurance?.toFixed(2), "Stake Date": row.stakeDate ? formatDate(row.stakeDate) : "No Staking", "Join Date": formatDate(row.createdAt), Status: statusText(row.status), Control:<><i className='fa fa-list text-white me-2' data-bs-toggle="modal" data-bs-target="#ListModel"  onClick={(e)=>handleList(e, row)}></i> <i className='fa fa-edit text-warning me-2' data-bs-toggle="modal" onClick={()=>setVal(row)} data-bs-target="#EditModel"></i> <i className={row.status ? 'fa fa-ban text-danger me-2' : 'fa fa-eye text-success me-2'} onClick={(e)=>handleEye(e, row)}></i> <i className='fa fa-trash text-danger me-2' onClick={(e)=>handleDelete(e, row)}></i></>, Action:"" };
            case "/wallet":
                return {ID: row?.userId?.userId, USDT: row?.usdtAmount?.toFixed(2), ADA:row?.adaAmount?.toFixed(4), "Wallet Address": row.destWalletAddress ?  <span style={{ cursor: "pointer", color: "green", textDecoration: "underline" }} data-bs-toggle="modal" data-bs-target="#qrModal" onClick={() => setQrData(row)} > {row.destWalletAddress} </span> : row.destWalletAddress, Type: row.type, "Transaction Id": row.transaction,"Request Date": formatDate(row.createdAt), Remark:row.remark, "Admin Remark":row.transaction, Status: statusTransText(row.status), Control:<><i className='fa fa-edit me-2' data-bs-toggle="modal" data-bs-target="#EditModel" onClick={()=>setVal(row)}></i> <i className='fa fa-trash text-danger' onClick={(e)=>handleDelete(e, row)}></i></>, Action:"" };
          default:
            return null;
        }
      })
      .filter(Boolean);
  };
  const getTableHeaders = () => {
    switch (basePath) {
      case "/users":
        return ["ID", "Email", "Sponsor", "Wallet", "Stake", "Insure", "Total Team", "Team Stakeing", "Team Insure", "Join Date", "Stake Date","Status","Control","Action"];
    case "/wallet":
        return ["ID", "USDT", "ADA", "Wallet Address", "Type", "Transaction Id","Request Date", "Remark","Admin Remark","Status","Control","Action"];
      default:
        return [];
    }
  };
  const tableHeaders = getTableHeaders();
  const exportToCSV = () => {
    const data = generateTableDataArray();
    if (!Array.isArray(data)) {console.error("generateTableDataArray did not return an array:", data); return; }
    const headers = Object.keys(data[0] || {});
    const modifiedData = [["MY GREEN POOL STACK"], headers.map(h => h.toUpperCase()), ...data.map(row => Object.values(row)) ];
    const csv = Papa.unparse(modifiedData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "table_data.csv");
};

const exportToExcel = () => {
  const data = generateTableDataArray();
  if (!Array.isArray(data)) {console.error("generateTableDataArray did not return an array:", data); return; }
  const headers = Object.keys(data[0] || {});
  const modifiedData = [["MY GREEN POOL STACK"], headers.map(h => h.toUpperCase()), ...data.map(row => Object.values(row)) ];
  const ws = XLSX.utils.aoa_to_sheet(modifiedData);
  const wb = XLSX.utils.book_new();
  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
          const cell_ref = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cell_ref]) continue;
          if (R === 0) { 
              ws[cell_ref].s = { fill: { fgColor: { rgb: "228B22" } }, font: { color: { rgb: "FFFFFF" }, bold: true } };
          } else if (R === 1) { 
              ws[cell_ref].s = { fill: { fgColor: { rgb: "A9A9A9" } }, font: { color: { rgb: "FFFFFF" }, bold: true } };
          } else if (R % 2 === 0) { 
              ws[cell_ref].s = { fill: { fgColor: { rgb: "F0F0F0" } } };
          }
      }
  }
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "table_data.xlsx");
};


const copyToClipboard = () => {
  const data = generateTableDataArray();
  if (!Array.isArray(data)) {console.error("generateTableDataArray did not return an array:", data); return; }
  const headers = Object.keys(data[0] || {});
  const text = `MY GREEN POOL STACK\n${headers.join("\t")}\n` + data.map(row => Object.values(row).join("\t")).join("\n");
  navigator.clipboard.writeText(text).then(() => { Swal.fire("Copied!", "Table data copied to clipboard.", "success"); });
};

  const exportToPdf = () => {
    const data = generateTableDataArray();
    if (!data || data.length === 0) { alert("No data available to export!"); return; }
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(255, 255, 255); doc.setFillColor(34, 139, 34); doc.rect(10, 10, 190, 10, "F"); doc.text("MY GREEN POOL STACK", 105, 17, { align: "center" });
    const tableColumn = Object.keys(data[0]);
    const tableRows = data.map((row, index) => { return tableColumn.map((key) => row[key] || "N/A"); });
    console.log(tableColumn, tableRows)
    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 25, theme: "grid", headStyles: { fillColor: [169, 169, 169], textColor: [255, 255, 255] }, styles: { fontSize: 10, cellPadding: 3 }, alternateRowStyles: { fillColor: [240, 240, 240] },});
    doc.save("table_data.pdf");
  };
  const handleStack = async(e, type)=>{
    e.preventDefault();
    if(basePath === "/wallet"){
      Object.keys(formData).forEach(key => {
        if (formData[key] === "") {delete formData[key]; }
      });
        if(!Val){Swal.fire("Error!", "Please select the transaction again", "error"); return; }
        if(!formData.status || !formData.transaction ){ Swal.fire("Error!", "Please fill all required fields", "error"); return; }
        let response = await fetch(`${updateTrans}/${Val._id}`,{
          method: 'POST',
          headers: {'Content-Type': 'application/json', },
          body: JSON.stringify({status:formData.status, transaction:formData.transaction, type:Val.type}),
        })
        let result = await response.json();
        if(result.status){
          getData(dataUrl);
          Swal.fire("Success!", "Transaction updated successfully", "success");
          setFormData({status: "", transaction: ""});
          setVal(null);
        }
    }else{
      Object.keys(formData).forEach(key => { if (formData[key] === "") { delete formData[key]; } });
      console.log(formData, Val);
      if(!Val){Swal.fire("Error!", "User validation error", "error"); return; }
      if(!formData){Swal.fire("Error!", "Please fill all required fields", "error"); return; }
      let response = await fetch(`${updateUser}/${Val._id}`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json', },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      let res = await response.json();
      if(res.status){
        getData(dataUrl);
        Swal.fire({title: "Success!", text: "User updated successfully", icon: "success", })
      }else{
        Swal.fire("Error!", "Failed to update user", "error");
      }
    }
  }
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
                    <h4 className="card-title">{status}</h4>
                    <div className="row justify-between g-2 with-export">
            <div className="col-6 col-sm-6">
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ borderRadius: "4px", border: "1px solid #ccc" }} />
            </div>
            <div className="col-6 col-sm-6 text-end">
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
      <td>{(currentPage - 1) * pageSize + index + 1}</td>

      {getTableHeaders().map((header, i) =>
        header === "Action" ? null : (
          <td
            key={i}
            className={i > 2 ? "d-none d-md-table-cell" : ""}
            style={header === "Wallet Address" ? { wordBreak: "break-all", whiteSpace: "normal" } : {}}
          >
            {header === "Username" || header === "Super Side" ? (
              <Link to="/genealogy" state={{ username: row[header] }} className="text-primary">
                {row[header]}
              </Link>
            ) : (
              row[header]
            )}
          </td>
        )
      )}

      {/* Mobile-Only Action Column */}
      <td className="d-md-none" key={"new"}>
        <button className="btn btn-sm btn-primary" onClick={() => toggleExpand(index)}>
          {expandedRows[index] ? "−" : "+"}
        </button>
      </td>
    </tr>

    {/* Extended Column on Mobile */}
    {expandedRows[index] && (
      <tr className="d-md-none">
        <td colSpan="4">
          <ul className="list-group text-start text-dark">
            {getTableHeaders().map(
              (header, i) =>
                i > 2 &&
                header !== "Action" && (
                  <li
                    key={i}
                    className="list-group-item text-dark"
                    style={header === "Wallet Address" ? { wordBreak: "break-all", whiteSpace: "normal" } : {}}
                  >
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
                <div className="modal fade" id="EditModel">
  <div className="modal-dialog modal-dialog-centered" >
    <div className="modal-content">
      
      {/* Modal Header */}
      <div className="modal-header border-bottom-0 py-2 bg-info text-white">
        <h5 className="modal-title">Edit {basePath === "/users" ? "User" : "Transaction"}</h5>
        <button type="button" className="btn-close text-white" data-bs-dismiss="modal"></button>
      </div>

      {/* Modal Body */}
      <div className="modal-body">
        <form className="row g-3" onSubmit={handleStack}>

          {/* User Form */}
          {basePath === "/users" ? (
            <>
              <div className="col-md-4">
                <label className="form-label">First Name</label>
                <input type="text" className="form-control" name="f_name" value={formData.f_name} onChange={handleInputChange} placeholder="Enter First Name" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Last Name</label>
                <input type="text" className="form-control" name="l_name" value={formData.l_name} onChange={handleInputChange} placeholder="Enter Last Name" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Gender</label>
                <select className="form-control" name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Cell</label>
                <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Cell Number" />
              </div>
              <div className="col-md-8">
                <label className="form-label">Script</label>
                <input type="text" className="form-control" name="script"  value={formData.script} onChange={handleInputChange} placeholder="<script defer src="  />
              </div>
            </>
          ) : (
            /* Transaction Form */
            <>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select className="form-control" name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="">Select Status</option>
                  <option value={1}>Accepted</option>
                  <option value={0}>Pending</option>
                  <option value={2}>Rejected</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Hash</label>
                <textarea className="form-control" name="transaction" value={formData.transaction} onChange={handleInputChange} placeholder="Enter hash"></textarea>
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="col-md-12 text-end">
            <button type="submit" className="btn btn-success px-4">Save Changes</button>
          </div>

        </form>
      </div>

    </div>
  </div>
</div>
                <div className="modal fade" id="ListModel">
                  <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "90%", width: "90%" }}>
                    <div className="modal-content">
                      <div className="modal-header border-bottom-0 py-2 bg-grd-info">
                        <h5 className="modal-title text-white">Login Activity</h5>
                        <a href="javascript:;" className="text-danger float-right border border-danger rounded-4 p-2" data-bs-dismiss="modal">
                        <i className="fa fa-close"></i>
                      </a>
                      </div>
                      <div className="modal-body">
                        <div className="table-responsive">
                          <table className="table table-hover table-bordered">
                            <thead>
                              <tr>
                                <th>Username</th>
                                <th>Login Time</th>
                                <th>Browser</th>
                              </tr>
                            </thead>
                            <tbody>
                              {activityData.map((activity, index) => (
                                <tr key={index}>
                                  <td>{activity?.userId?.userId}</td>
                                  <td>{activity.loginTime}</td>
                                  <td><p>{activity.ip} / {activity.device} / {activity.browser}</p></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal fade" id="qrModal" tabIndex="-1" aria-labelledby="qrModalLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="qrModalLabel">QR Code <strong className='text-warning'>{qrData?.userId?.userId}</strong> amount paid in ADA <strong className='text-success'>{qrData?.adaAmount - 2}</strong></h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body text-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData?.destWalletAddress}`}
                          alt="QR Code"
                          style={{ height: "150px", width: "150px" }}
                        />
                        <p className="mt-2" style={{ wordBreak: "break-all", whiteSpace: "normal" }}><strong>Address:</strong> {qrData?.destWalletAddress}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  )
}

export default TableData
