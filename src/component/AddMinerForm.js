import React, { useEffect, useState } from "react";
import { addMinerReqURL } from "../services/Constant";
import { addMinerReq } from "../services/api";
import Swal from "sweetalert2";

const MinerForm = () => {
  const [formData, setFormData] = useState({minerTitle: "", eBill: "", minerPrice: "",minerProfitPerHr: "", minerPic: [], algorithm: "", hashrate: "", consumption: "", effeciency: "", profitability: "", mineableCoin: "", specification: "", miningPool: "", description: "", });
  const [mineableCoins, setMineableCoins] = useState([]);
  const coinOptions = [ "Bitcoin (BTC)", "Ethereum (ETH)", "Litecoin (LTC)", "Dogecoin (DOGE)", "Monero (XMR)", "Ravencoin (RVN)" , "ALEO", "GRIN", "ZCASH", "DASH", "XMR", "ETHW", "FLUX", "ERGO", "RavenCoin", "Firo", "PirateChain", "LitecoinPlus", "LitecoinCash", "LitecoinGold"];
  const poolOptions = [ {poolName:"f2pool",_id:"12", url:"https://f2pool.io/assets/icons/icon-logo-min.png",website:"https://www.f2pool.com"},
                        {poolName:"DxPool",_id:"123", url:"https://avatars.githubusercontent.com/u/45964482?s=200&v=4",website:"https://www.dxpool.com"},
                        {poolName:"antpool",_id:"124", url:"https://play-lh.googleusercontent.com/1TZfEOuPWQEb6Q16iQc3G6BjfYCCFD8IBCCM2aBKS1m5WsL84wlHZCP20ErACVJzm_U",website:"https://www.antpool.com"},
                        {poolName:"viabtcpool",_id:"125", url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsRU0yxZ7wzz1mEqQPQ1IOXIjoPU9GSnHfTw&s",website:"https://www.viabtc.com"},
                        {poolName:"cloverpool",_id:"126", url:"https://s.cloverpool.com/public/images/cloverpool_logo.png",website:"https://cloverpool.com"},
                        {poolName:"nicehash",_id:"127", url:"https://www.nicehash.com/static/logos/logo_small_dark.png",website:"https://www.nicehash.com"},
                        {poolName:"poolin",_id:"128", url:"https://play-lh.googleusercontent.com/MOqEPM7KyBGuYp8CByX-PJLw0DiLMCs8nPES8RY4UYD2RtOOkgTmNT-7ZZ8CCpItGzA",website:"https://www.poolin.com"},];
  const [profitabilityData, setProfitabilityData] = useState([]);
  const [specificationsData, setSpecificationsData] = useState([]);
  const [poolData, setPoolData] = useState([]);
  const [profitEntry, setProfitEntry] = useState({option: "Income", daily: "", monthly: "", yearly: "", });
  const [specificationEntry, setSpecificationEntry] = useState({ title: "", value: "", });
  const [poolEntry, setPoolEntry] = useState({poolName: "", url: "", website: "", });
  const [openModel, setopenModel] = useState(false);
    const [MiningPool, setMiningPool] = useState([]);
  const [coinName, setcoinName] = useState('');
  const [CoinUrl, setCoinUrl] = useState('');

  useEffect(() => {
    getReqData();
  }, [])

    const getReqData = async () => {
        let result = await fetch(addMinerReq(addMinerReqURL, formData));
        // console.log(result);
    }
  
    const handleMineableCoinChange = (event) => {
        const { value } = event.target;
        setMineableCoins((prev) =>
          prev.includes(value) ? prev.filter((coin) => coin !== value) : [...prev, value]
        );
      };
      
      const handleMiningPoolChange = (event, pool) => {
        const { checked } = event.target;
    
        setMiningPool((prevPools) =>
            checked 
                ? [...prevPools, { id: pool._id, name: pool.poolName }] 
                : prevPools.filter((p) => p.id !== pool._id)
        );
    };
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if(name  === "minerPrice"){
      setFormData((prevData) => ({
        ...prevData,
        ["minerProfitPerHr"]: (value/300).toFixed(2),
      }));
    }
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({
        ...formData,
        minerPic: Array.from(e.target.files)
    });
};

  
  
  const handleProfitChange = (e) => {
    const { name, value } = e.target;
    setProfitEntry({ ...profitEntry, [name]: value });
  };
  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setSpecificationEntry({ ...specificationEntry, [name]: value });
  };
  const handlePoolChange = (e) => {
    const { name, value } = e.target;
    setPoolEntry({ ...poolEntry, [name]: value });
  };
  const addProfitabilityEntry = () => {
    if (profitEntry.daily && profitEntry.monthly && profitEntry.yearly) {
      setProfitabilityData([...profitabilityData, profitEntry]);
      setProfitEntry({ option: "Income", daily: "", monthly: "", yearly: "" });
    }
  };
  const addSpecificationEntry = () => {
    if (specificationEntry.title && specificationEntry.value) {
      setSpecificationsData([...specificationsData, specificationEntry]);
      setSpecificationEntry({ title: "", value: "" });
    }
  };
  const addPoolEntry = () => {
    if (poolEntry.poolName && poolEntry.url && poolEntry.website) {
      setPoolData([...poolData, poolEntry]);
      setPoolEntry({ poolName: "", url: "", website: "" });
    }
  };
  const removeProfitabilityEntry = (index) => {
    setProfitabilityData(profitabilityData.filter((_, i) => i !== index));
  };
  const removeSpecificationEntry = (index) => {
    setSpecificationsData(specificationsData.filter((_, i) => i !== index));
  };
  const removeMiningEntry = (index) => {
    setPoolData(poolData.filter((_, i) => i !== index));
  };
  const handleClose = (e) => {
    e.preventDefault();
    setopenModel(false);
  }
  
  const handleAddMiner = async (e) => {
    e.preventDefault();

    if (!formData.minerTitle || !formData.eBill || !formData.minerPrice || !formData.minerProfitPerHr ||
        !formData.algorithm || !formData.hashrate || !formData.consumption || !formData.effeciency ||
        !profitabilityData || !specificationsData || !mineableCoins || !MiningPool) {
        console.error("All fields are required.");
        return;
    }

    let profitabilityJSON, specificationsJSON, mineableCoinsJSON, miningPoolJSON;

    try {
        profitabilityJSON = JSON.stringify(profitabilityData);
        specificationsJSON = JSON.stringify(specificationsData);
        mineableCoinsJSON = JSON.stringify(mineableCoins);
        miningPoolJSON = JSON.stringify(MiningPool);
    } catch (error) {
        console.error("Invalid JSON data:", error);
        return;
    }

    if (!Array.isArray(formData.minerPic) || formData.minerPic.length === 0) {
        console.error("At least one image is required.");
        return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("minerTitle", formData.minerTitle);
    formDataToSend.append("eBill", formData.eBill);
    formDataToSend.append("minerPrice", formData.minerPrice);
    formDataToSend.append("minerProfitPerHr", formData.minerProfitPerHr);
    formDataToSend.append("algorithm", formData.algorithm);
    formDataToSend.append("hashrate", formData.hashrate);
    formDataToSend.append("consumption", formData.consumption);
    formDataToSend.append("effeciency", formData.effeciency);
    formDataToSend.append("profitability", profitabilityJSON);
    formDataToSend.append("specification", specificationsJSON);
    formDataToSend.append("mineableCoin", mineableCoinsJSON);
    formDataToSend.append("miningPool", miningPoolJSON);
    formDataToSend.append("profitablity", formData.profitablity);
    formDataToSend.append("description", formData.description);
    // Append images
    formData.minerPic.forEach((file) => {
        formDataToSend.append("minerPics", file); // Match field name with multer
    });

    try {
        const response = await fetch(addMinerReqURL, {
            method: "POST",
            body: formDataToSend,
        });

        const result = await response.json();
        if(result.status){
          Swal.fire({
            title: response.message,
            icon:'success',
            confirmButtonText: 'Close'
          })
          setFormData({minerTitle: "", eBill: "", minerPrice: "",minerProfitPerHr: "", minerPic: [], algorithm: "", hashrate: "", consumption: "", effeciency: "",profitablity:'', profitability: "", mineableCoin: "", specification: "", miningPool: "", description: "", });
          setMineableCoins([]);
          setProfitabilityData([]);
          setSpecificationsData([]);
          setMiningPool([]);
        }else{
          Swal.fire({
            title: response.message,
            icon:'error',
            confirmButtonText: 'Close'
          })
        }
    } catch (error) {
        console.error("Error:", error);
    }
};



  const handleCoinAdd = (e) => {
    e.preventDefault();
    console.log(coinName, CoinUrl)
  }
  return (
    <div className="modal fade" id="FormModal">
      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "90%", width: "90%" }}>
        <div className="modal-content">
          <div className="modal-header border-bottom-0 py-2 bg-grd-info">
            <h5 className="modal-title text-white">Add Miner</h5>
            <a href="javascript:;" className="text-danger float-right border border-danger rounded-4 p-2" data-bs-dismiss="modal">
            <i className="fa fa-close"></i>
          </a>
          </div>
          <div className="modal-body">
            <form className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Miner Title</label>
                <input type="text" className="form-control" name="minerTitle" value={formData.minerTitle} onChange={handleChange} placeholder="Miner Title" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Miner Profit / day</label>
                <input type="text" className="form-control" name="minerProfitPerHr" value={formData.minerProfitPerHr} onChange={handleChange} readOnly placeholder="Profit /Hr" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Miner Price</label>
                <input type="number" className="form-control" name="minerPrice" onChange={handleChange} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Miner Pic</label>
                <input type="file" multiple className="form-control" name="minerPic"  onChange={handleFileChange} />
              </div>

              <p className="text-center h4">Algorithm</p>
              <div className="col-md-4">
                <label className="form-label">Algorithm</label>
                <input type="text" className="form-control" name="algorithm" value={formData.algorithm} onChange={handleChange} placeholder="Algorithm" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Hashrate</label>
                <input type="text" className="form-control" name="hashrate" value={formData.hashrate} onChange={handleChange} placeholder="Hashrate" />
              </div>

              <div className="col-md-4">
                <label htmlFor="input9" className="form-label">Consumption</label>
                <input type="text" className="form-control" id="input9" name="consumption" placeholder="Consumption"  onChange={handleChange}  />
              </div>
              <div className="col-md-4">
                <label htmlFor="input9" className="form-label">Effeciency</label>
                <input type="text" className="form-control" id="input9" name="effeciency" placeholder="Effeciency"  onChange={handleChange}  />
              </div>
              <div className="col-md-4">
                <label htmlFor="input9" className="form-label">Profitablity</label>
                <input type="text" className="form-control" id="input9" name="profitablity" placeholder="Profitablity"  onChange={handleChange}  />
              </div>
              <div className="col-md-4">
                <label htmlFor="input9" className="form-label">Electricity</label>
                <input type="text" className="form-control" id="input9" name="eBill" placeholder="Electricity Bill"  onChange={handleChange}  />
              </div>
              <p className="text-center h4">Mineable Coin <span style={{float:"right"}} className="btn btn-warning" onClick={()=>setopenModel(!openModel)}><i className="fa fa-plus"></i></span></p>
              {
                openModel && (
                    <form className="row border p-3 border-warning border-1">
                        <div className="col-md-4">
                            <input type="text" className="form-control" name="minerTitle" value={coinName} onChange={(e)=>setcoinName(e.target.value)} placeholder="Coin Name" />
                        </div>
                        { CoinUrl === '' ? <div className="col-md-4">
                            <input type="text" className="form-control" name="minerProfitPerHr" value={CoinUrl} onChange={(e)=>setCoinUrl(e.target.value)} placeholder="Coin Image URL" />
                        </div>
                        :
                        <>
                            <div className="col-md-3">
                                <input type="text" className="form-control" name="minerProfitPerHr" value={CoinUrl} onChange={(e)=>setCoinUrl(e.target.value)} placeholder="Coin Image URL" />
                            </div>
                            <div className="col-md-1">
                                <img src={CoinUrl} className="img-xs rounded-circle border rounded-3 border-warning" style={{width:"50px", height:"50px"}} alt="Coin Image" />
                            </div>
                        </>
                        }
              <div className="col-md-4 text-center">
                
                <button type="button" className="btn btn-success px-4 text-white m-2" onClick={handleCoinAdd}>Add Coin</button>
                <button type="button" className="btn btn-danger px-4 text-white" onClick={()=>setopenModel(false)}>Close</button>
              </div>
            </form>
                )
              }
              <div className="col-md-12 d-flex align-items-center flex-wrap">
                {coinOptions.map((coin) => (
                    <label key={coin} className="form-check form-check-inline d-flex align-items-center text-white px-3 py-2 border rounded-2" style={{ cursor: "pointer", userSelect: "none", margin: "5px", backgroundColor: "#333" }}>
                    <input type="checkbox" className="form-check-input me-2" id={coin} value={coin} checked={mineableCoins.includes(coin)} onChange={handleMineableCoinChange} style={{ cursor: "pointer" }} />
                    {coin}
                    </label>
                ))}
                </div>

                <div className="col-md-12">
                  <label className="form-label">Selected Coins:</label>
                  <p>{mineableCoins.length > 0 ? mineableCoins.join(", ") : "None selected"}</p>
                </div>

              <p className="text-center h4">Profitability</p>
              <div className="col-md-2">
                <label className="form-label">Option</label>
                <select className="form-control" name="option" value={profitEntry.option} onChange={handleProfitChange}>
                  <option>Income</option>
                  <option>Electricity</option>
                  <option>Profit</option>
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Daily</label>
                <input type="text" className="form-control" name="daily" value={profitEntry.daily} onChange={handleProfitChange} placeholder="Daily" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Monthly</label>
                <input type="text" className="form-control" name="monthly" value={profitEntry.monthly} onChange={handleProfitChange} placeholder="Monthly" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Yearly</label>
                <input type="text" className="form-control" name="yearly" value={profitEntry.yearly} onChange={handleProfitChange} placeholder="Yearly" />
              </div>
              <div className="col-md-1">
                <label className="form-label">Action</label>
                <button type="button" className="btn btn-success px-4 text-white" onClick={addProfitabilityEntry}><i className="fa fa-plus"></i></button>
              </div>

              <table className="table mt-3 text-white">
              <thead>
              <tr>
                  <th>Option</th>
                  <th>Daily</th>
                  <th>Monthly</th>
                  <th>Yearly</th>
                  <th>Remove</th>
              </tr>
            </thead>

                <tbody>
                  {profitabilityData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.option}</td>
                      <td>{entry.daily}</td>
                      <td>{entry.monthly}</td>
                      <td>{entry.yearly}</td>
                      <td> <button type="button" className="btn btn-danger btn-sm" onClick={() => removeProfitabilityEntry(index)} > Remove </button> </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-center h4">Specifications</p>
              <div className="col-md-4">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={specificationEntry.title} onChange={handleSpecificationChange} placeholder="Title" />
              </div>
              <div className="col-md-7">
                <label className="form-label">Value</label>
                <input type="text" className="form-control" name="value" value={specificationEntry.value} onChange={handleSpecificationChange} placeholder="Value" />
              </div>
              <div className="col-md-1">
                <label className="form-label">Action</label>
                <button type="button" className="btn btn-success px-4 text-white" onClick={addSpecificationEntry}><i className="fa fa-plus"></i></button>
              </div>

              <table className="table mt-3">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Value</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {specificationsData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.title}</td>
                      <td>{entry.value}</td>
                      <td> <button type="button" className="btn btn-danger btn-sm" onClick={() => removeSpecificationEntry(index)} > Remove </button> </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-center h4">Mining Pool</p>
              <div className="col-md-12 d-flex align-items-center flex-wrap">
                {poolOptions.map((pool) => (
                    <label key={pool._id} className="form-check form-check-inline d-flex align-items-center text-white px-3 py-2 border rounded-2" style={{ cursor: "pointer", userSelect: "none", margin: "5px", backgroundColor: "#333" }}>
                        <input type="checkbox"  className="form-check-input me-2"  id={pool._id}  value={pool._id}  checked={MiningPool.some((p) => p.id === pool._id)}  onChange={(e) => handleMiningPoolChange(e, pool)}  style={{ cursor: "pointer" }}  />
                        <img  className="img-xs rounded-circle border rounded-3 border-warning"  src={pool.url}  alt={pool.poolName}  /> &nbsp;{pool.poolName}
                    </label>
                ))}
            </div>

            <div className="col-md-12">
                <label className="form-label">Selected Pool:</label>
                <p>{MiningPool.length > 0 ? MiningPool.map((p) => p.name).join(", ") : "None selected"}</p>
            </div>
                
              <div className="col-md-12">
                <label className="form-label">Description</label>
                <textarea type="text" className="form-control" name="description"  onChange={handleChange}  placeholder="Description" rows={5} ></textarea>
              </div>

              <div className="col-md-12 text-center">
                <button type="button" className="btn btn-danger px-4 text-white m-2" onClick={handleAddMiner}>Add Mainer</button>
                <button type="button" className="btn btn-info px-4 text-white">Reset</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinerForm;
