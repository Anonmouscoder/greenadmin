import { useLocation, useParams } from "react-router-dom";
import React, { useState, useEffect, useContext, useMemo } from "react";
import Swal from "sweetalert2";
import { DataContext } from "../utils/Context";
import { blockPlan, createPlan, deletePlan, editPlan, updateMiningRoi, updateStakeRoi } from "../services/Constant";

function TablePlan({ title, dataUrl, apiBaseUrl, pageSize = 10 }) {
  const { session } = useContext(DataContext);
  const { type } = useParams();
  const location = useLocation();
  const basePath = "/" + location.pathname.split("/")[2];

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({ level: "", planTitle: "",business:"", dist: "",totalTeam:"",planPic:"",directDist:"", type:type });
  const [editId, setEditId] = useState(null);
  const [DiredtDist, setDiredtDist] = useState(null);
  const [toSelf, settoSelf] = useState(null);
  useEffect(() => {
    fetchData();
    resetForm();
  }, [dataUrl,type]);

  const fetchData = async () => {
    try {
      const response = await fetch(dataUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();    
      // console.log(result.data)
        setData(result.data || []);
        if(result && result.data && result.data.length > 0) {
          setDiredtDist(result.data[0].directDist);
          settoSelf(result.data[0].selfDistribution);
          setData(type !== "reward" ? result.data.sort((a, b) => a.level - b.level) : result.data);        
        }else{
          setDiredtDist(0);
          settoSelf(0);
        }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  function cleanFormData(formData) {
    Object.keys(formData).forEach(key => {
      if (formData[key] === null || formData[key] === undefined || formData[key] === "") {
        delete formData[key];
      }
    });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    cleanFormData(formData); 
    const url = editId ? `${editPlan}/${type}/${editId}` : `${createPlan}/${type}`;
    const method = "POST";
    const payload = { ...formData};
    console.log(payload)
    try {
      const response = await fetch(`${url}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const result = await response.json();
      console.log(result)
      if (result.status) {
        fetchData();
        Swal.fire({ icon: "success", title: "Success!", text: result.message });
        resetForm();
      } else {
        Swal.fire({ icon: "error", title: "Error!", text: result.message });
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = (row) => {
    setFormData(row);
    setEditId(row._id);
  };

  const handleDelete = async (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You want to delete ${row.planTitle}.You won't be able to revert this!`,
      icon: "danger",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`${deletePlan}/${type}/${row._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          const res = await response.json();

          if (res.status) {
            Swal.fire("Deleted!", res.message, "success");
            fetchData();
          } else {
            Swal.fire("Error!", res.message, "error");
          }
        } catch (error) {
          console.error("Error deleting data:", error);
        }
      }
    });
  };

  const handleBlock = async (row) => {
    setEditId(row._id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, update it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
      try {
        const response = await fetch(`${blockPlan}/${type}/${row._id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body:JSON.stringify({status:!row.status}),
        });
        const res = await response.json();

        if (res.status) {
          Swal.fire("Blocked!", res.message, "success");
          fetchData();
        } else {
          Swal.fire("Error!", res.message, "error");
        }
      } catch (error) {
        console.error("Error blocking data:", error);
      }
    }
  })
  };

  const resetForm = () => {
    setFormData({ level: "", planTitle: "", dist: "" });
    setEditId(null);
    setDiredtDist(null)
    settoSelf(null);
  };

  const tableHeaders = useMemo(() => {
    if(type === "reward"){return ["Pic","Title","Business", "Total Team", "Reward","Status","Control"];}
    else if(type === "stackLevelRoi"){return ["Level", "Title","Limit", "To Sponsor", "Status", "Control"];}
    else if(type === "leadership"){return ["Title", "Super Side", "Other Side","Level", "Reco", "Till", "Type", "Control"];}
    else{return ["Level", "Title","Direct", type === "stackRoi" ? "To Staker" :"To Miner", "Distribution","Status", "Control"];}
  }, [type, data]);

  const tableData = useMemo(() => {
    console.log(data)
    if(type === "reward"){
      return data.map((row, index) => ({
        Pic:<img className="img-xs rounded-circle" src={row.planPic} />,
        Title: row.planTitle,
        Business:row.business,
        "Total Team": row.totalTeam,
        Reward: row.dist,
        Status:row.status? "Active" : "Inactive",
        Control: (
          <>
            <button className="btn btn-sm btn-warning me-2"  data-bs-toggle="modal" data-bs-target="#FormModal"  onClick={() => handleEdit(row)}>
              <i className="fa fa-edit"></i>
            </button>
            <button className="btn btn-sm btn-secondary me-2" onClick={() => handleBlock(row)}>
            {row.status ? <i className="fa fa-ban"></i> : <i className="fa fa-check"></i>}
            </button>
            <button className="btn btn-sm btn-danger " onClick={() => handleDelete(row)}>
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      }));
    }else if(type === "leadership"){
      return data.map((row, index) => ({
        Title: row.planTitle,
        "Super Side": row.superSide +" USDT",
        "Other Side": row.otherSide + " USDT",
        Level:row.level,
        Reco:"$ "+row.rec,
        Till:row.till,
        Type:row.type,
        Control: (
          <>
            <button className="btn btn-sm btn-warning me-2"  data-bs-toggle="modal" data-bs-target="#FormModal"  onClick={() => handleEdit(row)}>
              <i className="fa fa-edit"></i>
            </button>
            <button className="btn btn-sm btn-secondary me-2" onClick={() => handleBlock(row)}>
              {row.status ? <i className="fa fa-ban"></i> : <i className="fa fa-check"></i>}
            </button>
            <button className="btn btn-sm btn-danger " onClick={() => handleDelete(row)}>
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      }));
    }else if(type === "stackLevelRoi"){
      return data.map((row, index) => ({
        Level: row.level,
        Title: row.planTitle,
        Limit:row.limit || 0,
        "To Sponsor": row.dist + "%",
        Status:row.status ? "Active" : "Inactive",
        Control: (
          <>
            <button className="btn btn-sm btn-warning me-2"  data-bs-toggle="modal" data-bs-target="#FormModal"  onClick={() => handleEdit(row)}>
              <i className="fa fa-edit"></i>
            </button>
            <button className="btn btn-sm btn-secondary me-2" onClick={() => handleBlock(row)}>
              {row.status ? <i className="fa fa-ban"></i> : <i className="fa fa-check"></i>}
            </button>
            <button className="btn btn-sm btn-danger " onClick={() => handleDelete(row)}>
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      }));
    }else{
      return data.map((row, index) => ({
        Level: row.level,
        Title: row.planTitle,
        [type === "stackRoi" ? "To Staker" :"To Miner"]: row.selfDistribution,
        Direct:row.directDist,
        Distribution :row.dist,
        Status:row.status ? "Active" : "Inactive",
        Control: (
          <>
            <button className="btn btn-sm btn-warning me-2"  data-bs-toggle="modal" data-bs-target="#FormModal"  onClick={() => handleEdit(row)}>
              <i className="fa fa-edit"></i>
            </button>
            <button className="btn btn-sm btn-secondary me-2" onClick={() => handleBlock(row)}>
              {row.status ? <i className="fa fa-ban"></i> : <i className="fa fa-check"></i>}
            </button>
            <button className="btn btn-sm btn-danger " onClick={() => handleDelete(row)}>
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      }));
    }
  }, [data,type]);
const handleUpdateSelf = async(e)=>{
  e.preventDefault();
  if(toSelf === null ){
    Swal.fire({
      title:"Input Error",
      icon:"error",
      text:"Please enter some value"
    })
    return;
  }
  try {
    const response = await fetch(type === "miningRoi" ? updateMiningRoi: updateStakeRoi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({selfDistribution: toSelf}),
    
      credentials: "include",
    });
    const res = await response.json();

    if (res.status) {
      Swal.fire("Updated!", res.message, "success");
      fetchData();
      resetForm();
    } else {
      Swal.fire("Error!", res.message, "error");
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
}
const handleUpdateDirect = async(e)=>{
  e.preventDefault();
  if(DiredtDist === null){
    Swal.fire({
      title:"Input Error",
      icon:"error",
      text:"Please enter some value"
    })
    return;
  }
  try {
    const response = await fetch(type === "miningRoi" ? updateMiningRoi: updateStakeRoi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({directDist: DiredtDist}),
    
      credentials: "include",
    });
    const res = await response.json();

    if (res.status) {
      Swal.fire("Updated!", res.message, "success");
      fetchData();
      resetForm();
    } else {
      Swal.fire("Error!", res.message, "error");
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

  return (
    <div className="col-lg-12 grid-margin stretch-card">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">{type}</h4>
          <div className="col-md-12 d-flex justify-content-between">
            {type === "reward" ? (<span className="d-flex"></span>): type === "stackLevelRoi" ? (<span className="d-flex"></span>): type === "leadership" ? (<span className="d-flex"></span>):
              (<>
              <span className="d-flex">
                <input type="text" className="form-control me-2" value={toSelf} onChange={(e)=>settoSelf(e.target.value)} placeholder="Distribution to User" />
                <button className="btn btn-primary" onClick={handleUpdateSelf}>
                  <i className="fa fa-upload"></i> Update {type === "stackRoi" ? "Stake" : "Owner Mining"}
                </button>
              </span>
              <span className="d-flex">
              <input type="text" className="form-control me-2" value={DiredtDist} onChange={(e)=>setDiredtDist(e.target.value)} placeholder="Enter direct distribution" />
              <button className="btn btn-primary" onClick={handleUpdateDirect}>
                <i className="fa fa-upload"></i> Update {type === "stackRoi" ? "Stake Direct" : "Mining Direct"}
              </button>
            </span>
            </>
            )}
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#FormModal" >
              <i className="fa fa-plus"></i>
            </button>
          </div>

          <div className="table-responsive mt-3">
            <table className="table table-hover">
              <thead>
                <tr>
                  {tableHeaders.map((header, index) => (
                    <th key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <tr key={index}>
                      {tableHeaders.map((header, i) => (
                        <td key={i}>{row[header]}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length}>No data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
     <div className="modal fade" id="FormModal"><div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">{editId ? "Edit Data" : "Add New Data"}</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {type === "leadership" ? 
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Name</label>
                  <input type="text" name="planTitle" className="form-control" value={formData.name} onChange={handleInputChange} placeholder="Title" required />
                </div>
                <div className="mb-3">
                  <label>Super Side</label>
                  <input type="text" name="superSide" className="form-control" value={formData.superSide} onChange={handleInputChange} placeholder="Super Side" required />
                </div>
                <div className="mb-3">
                  <label>Other Side</label>
                  <input type="text" name="otherSide" className="form-control" value={formData.otherSide} onChange={handleInputChange} placeholder="Other Side" required />
                </div>
                <div className="mb-3">
                  <label>Recognation</label>
                  <input type="text" name="rec" className="form-control" value={formData.rec} onChange={handleInputChange} placeholder="Recognation" required />
                </div>
                <div className="mb-3">
                  <label>Level</label>
                  <input type="text" name="level" className="form-control" value={formData.level} onChange={handleInputChange} placeholder="Level" required />
                </div>
                <div className="mb-3">
                  <label>Till</label>
                  <input type="text" name="till" className="form-control" value={formData.till} onChange={handleInputChange} placeholder="Till Time" required />
                </div>
                <div className="mb-3">
                  <label>Type</label>
                  <select name="type" className="form-control" value={formData.type} onChange={handleInputChange}>
                    <option value="day">Daily</option>
                    <option value="week">Weekily</option>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="single">Single Time</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-success">{editId ? "Update" : "Add"}</button>
              </form>
              :<form onSubmit={handleSubmit}>
              {type !== "reward" &&  <div className="mb-3">
                  <label>Level</label>
                  <input type="hidden" name="type" className="form-control" value={type} required />
                  <input type="number" name="level" className="form-control" value={formData.level} onChange={handleInputChange} required />
                </div>}
                <div className="mb-3">
                  <label>Title</label>
                  <input type="text" name="planTitle" className="form-control" value={formData.planTitle} onChange={handleInputChange} required />
                </div>
                {type === "stackLevelRoi" && <div className="mb-3">
                  <label>Limit</label>
                  <input type="text" name="limit" className="form-control" value={formData.limit} onChange={handleInputChange} required />
                </div>}
                {type === "reward" && <div className="mb-3">
                  <label>Picture</label>
                  {formData.planPic !=='' && <img src={formData.planPic} className="img-xs rounded-circle" /> }<input type="text" name="planPic" className="form-control" value={formData.planPic} onChange={handleInputChange} required />
                </div>}
                {type === "reward" && <div className="mb-3">
                  <label>Business</label>
                  <input type="text" name="business" className="form-control" value={formData.business} onChange={handleInputChange} required />
                </div>}
                {type === "reward" && <div className="mb-3">
                  <label>Total Team</label>
                  <input type="text" name="totalTeam" className="form-control" value={formData.totalTeam} onChange={handleInputChange} required />
                </div>}
                <div className="mb-3">
                  <label>Distribution (%)</label>
                  <input type="number" name="dist" className="form-control" value={formData.dist} onChange={handleInputChange} required />
                </div>
                <button type="submit" className="btn btn-success">{editId ? "Update" : "Add"}</button>
              </form>}
            </div>
          </div>
        </div></div>
    </div>
  );
}

export default TablePlan;
