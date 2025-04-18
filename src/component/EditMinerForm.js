import React, { useEffect, useState } from 'react'
import { ImageUrl, updateMinerUrl } from '../services/Constant';
import Swal from 'sweetalert2';

function EditMinerForm(minerVal) {

  const [MinerVal, setMinerVal] = useState(minerVal?.minerVal||{});
  useEffect(() => {
    // console.log(minerVal.minerVal);
    setMinerVal(minerVal?.minerVal);
  }, [minerVal]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setMinerVal((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
      ...(name === 'minerPrice' && { minerProfitPerHr: (value / 300).toFixed(3) }),
    }));
  };

  const updateMiner = async () => {
    try {
      console.log(MinerVal);
      const response = await fetch(`${updateMinerUrl}/${MinerVal._id}`, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(MinerVal),
      });

      let resp = await response.json();
      if (resp.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Miner updated successfully!",
        });
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update miner');
    }
};

      
  return (
    <div className="modal fade" id="ViewMinerModal">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "90%", width: "90%" }}>
        <div className="modal-content">
          <div className="modal-header border-bottom-0 py-2 bg-grd-info">
            <h5 className="modal-title text-white">Edit Miner</h5>
            <a href="javascript:;" className="text-danger float-right border border-danger rounded-4 p-2" data-bs-dismiss="modal">
            <i className="fa fa-close"></i>
          </a>
          </div>
          <div className="modal-body">
            <form className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Miner Title</label>
                <input type="text" className="form-control" name="minerTitle" value={MinerVal?.minerTitle} onChange={handleChange} placeholder="Miner Title" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Miner Profit / day</label>
                <input type="text" className="form-control" name="minerProfitPerHr" value={MinerVal?.minerProfitPerHr} onChange={handleChange} placeholder="Profit /Hr" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Miner Price</label>
                <input type="number" className="form-control" name="minerPrice" value={MinerVal?.minerPrice} onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Miner Pic</label><br />
                {MinerVal?.minerPics?.map((item, index) => (
                  <img src={`${ImageUrl}${item}`} key={index} className='img-xs rounded-circle border border-white' alt="Miner Pic" />
                ))}
              </div>


              <p className="text-center h4">Algorithm</p>
              <div className="col-md-4">
                <label className="form-label">Algorithm</label>
                <input type="text" className="form-control" name="algorithm" value={MinerVal?.algorithm} onChange={handleChange} placeholder="Algorithm" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Hashrate</label>
                <input type="text" className="form-control" name="hashrate" value={MinerVal?.hashrate} onChange={handleChange} placeholder="Hashrate" />
              </div>

              <div className="col-md-4">
                <label htmlFor="input9" className="form-label">Consumption</label>
                <input type="text" className="form-control" id="input9" name="consumption" value={MinerVal?.consumption} placeholder="Consumption"  onChange={handleChange}  />
              </div>
              <div className="col-md-4">
                <label htmlFor="input9" className="form-label">Effeciency</label>
                <input type="text" className="form-control" id="input9" name="effeciency" value={MinerVal?.effeciency} placeholder="Effeciency"  onChange={handleChange}  />
              </div>
              <div className="col-md-4">
                <label htmlFor="input9" className="form-label">Profitablity</label>
                <input type="text" className="form-control" id="input9" name="profitablity" value={MinerVal?.profitablity} placeholder="Profitablity"  onChange={handleChange}  />
              </div>
              <div className="col-md-4">
                <label htmlFor="input9" className="form-label">Electricity </label>
                <input type="text" className="form-control" id="input9" name="eBill" value={MinerVal?.eBill} placeholder="Electricity Bill"  onChange={handleChange}  />
              </div>
              <div className="col-md-12">
                <label className="form-label">Description</label>
                <textarea type="text" className="form-control" name="description"  value={MinerVal?.description} onChange={handleChange} placeholder="Description" rows={5} >{MinerVal?.description}</textarea>
              </div>

              <div className="col-md-12 text-center">
              <button type="button" className="btn btn-danger px-4 text-white m-2" onClick={updateMiner}>Update Miner </button>
                <button type="button" className="btn btn-info px-4 text-white" onClick={() => setMinerVal(minerVal)}>Reset </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditMinerForm
