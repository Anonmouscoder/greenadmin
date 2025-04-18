import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../utils/Context';
import Swal from 'sweetalert2';
import { updateConfig } from '../services/Constant';

function TransDash({data, order}) {
  const {Config} = useContext(DataContext);
  const [total, settotal] = useState(0);
  const [miner, setminer] = useState(0);
  const [wallet, setWallet] = useState(0);
  const [Income, setIncome] = useState(0);
  const [isOn, setIsOn] = useState(false);

  const handleToggle = (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to change the % of the Stake!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.isConfirmed) {
        let update = await fetch(updateConfig, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({roiBelowLimit: !isOn })
        });
        setIsOn(prev => !prev);
        let result = await update.json();
        if (result.status) {
        Swal.fire(
          'Changed!',
          'Your file has been changed.',
          'success'
        )
      } else {
        Swal.fire(
          'Error!',
          'Something went wrong.',
          'error'
        )
      }
      }
    })
  };

  useEffect(() => {
    let total = 0;
    let miner = 0;
    let wallet = 0;
    data.forEach(item => {
      total += item.walletAmount;
        miner += item.minerIncome;
        wallet += item.personalStack;
    });
    settotal(total);
    setminer(miner);
    setWallet(wallet);
    setIsOn(Config?.roiBelowLimit);
  }, [data, Config]);

  useEffect(() => {
    let miner = 0;
    order.forEach(item => {
      miner += item.productPrice;
    });
    setIncome(miner);
  }, [data]);
  
  return (
    <div className="col-md-4 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Transaction History</h4>
                    <div className="position-relative">
                      <div className="daoughnutchart-wrapper">
                        <canvas id="transaction-history" className="transaction-chart"></canvas>
                      </div>
                      <div className="custom-value">{total?.toFixed(2)}<span>ADA</span>
                      </div>
                    </div>
                    <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row mt-4 rounded">
                      <div className="text-md-center text-xl-left">
                        <h6 className="mb-1">Miner Revenue</h6>
                      </div>
                      <div className="align-self-center flex-grow text-end text-md-center text-xl-right">
                        <h6 className="font-weight-bold mb-0">${Income?.toFixed(2)}</h6>
                      </div>
                    </div>
                    <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row rounded">
                      <div className="text-md-center text-xl-left">
                        <h6 className="mb-1">Miner Return</h6>
                      </div>
                      <div className="align-self-center flex-grow text-end text-md-center text-xl-right">
                        <h6 className="font-weight-bold mb-0">${miner?.toFixed(2)}</h6>
                      </div>
                    </div>
                    <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row rounded ">
                      <div className="text-md-center text-xl-left">
                        <h6 className="mb-1">Stake Revenue</h6>
                        {/* <p className="text-muted mb-0">07 Jan 2019, 09:12AM</p> */}
                      </div>
                      <div className="align-self-center flex-grow text-end text-md-center text-xl-right">
                        <h6 className="font-weight-bold mb-0">${wallet?.toFixed(2)}</h6>
                      </div>
                    </div>
                    <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row rounded ">
                      <div className="text-md-center text-xl-left">
                        <h6 className="mb-1">12% Below $999</h6>
                        {/* <p className="text-muted mb-0">07 Jan 2019, 09:12AM</p> */}
                      </div>
                      <div className="align-self-center flex-grow text-end text-md-center text-xl-right form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={isOn} onChange={handleToggle} />
                        <label className="form-check-label" htmlFor="flexSwitchCheckDefault">{isOn ? 'ON' : 'OFF'} </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  )
}
export default TransDash
