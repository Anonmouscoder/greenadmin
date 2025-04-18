import React, { useContext, useEffect, useState } from 'react'
import Footer from '../component/Footer'
import { DataContext } from '../utils/Context'
import Swal from 'sweetalert2'
import { genrateQr, updateWalletConfig, verifyQr } from '../services/Constant'

function Setting() {
    const { Config, Session } = useContext(DataContext)
    const [walletConf, setWalletConf] = useState({
        withdrawlStatus: false,
        minDeposit: '',
        minWithdrawal: '',
        withdrawalFee: '',
        depositeHold: '',
    })
    
  const [qrCode, setQrCode] = useState("https://greenstakepool.com/assets/images/logo-white.png");
  const [secret, setSecret] = useState("");
  const [Pin, setPin] = useState(null);
  const [QrDisplay, setQrDisplay] = useState(false);
    useEffect(() => {
        if (Config?.walletConf) {
            setWalletConf({
                withdrawlStatus: Config.walletConf.withdrawlStatus || false,
                minDeposit: Config.walletConf.minDeposit || '',
                minWithdrawal: Config.walletConf.minWithdrawal || '',
                withdrawalFee: Config.walletConf.withdrawalFee || '',
                depositeHold: Config.walletConf.depositeHold || '',
            })
        }
    }, [Config])

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target
        setWalletConf(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSave = async () => {
        console.log('Saving wallet config:', walletConf);
        Swal.fire({
            title: 'Saving...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });
        await fetch(updateWalletConfig, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({wallet:walletConf}),
        })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            if (result.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Wallet config updated successfully',
                    timer: 2000,
                });
                window.location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: result.message,
                });
            }
        })
    }
    const generateQRCode = async (e) => {
        e.preventDefault();
        if(!Session){
            Swal.fire({
                icon: 'error',
                title: 'Session Expired',
                text: 'Please login again.',
            });
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return;
        }
        Swal.fire({
            title: 'Generating Authentication QR Code...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading()
            }
        });
        const response = await fetch(genrateQr, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username:Session?.userId }),
          });
          let result = await response.json();
          console.log(result);
          Swal.close();
          setQrCode(result.qrCode);
          setSecret(result.secret);
          setQrDisplay(true);
    }

    const handleAuthApp = async (e) => {
        e.preventDefault();
        if(!Pin){
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter PIN',
          });
          return;
        }
        const response = await fetch(verifyQr, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ username: Session?.userId, token:Pin}),
        });
        let result = await response.json();
        console.log(result);
        if (result.status) {
          Swal.fire({
            icon:'success',
            title: 'Success!',
            text: 'Authentication successful',
          });
          sessionStorage.setItem('user', JSON.stringify(result.data));
          setPin(null);
          window.location.reload();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: result.message,
          });
        }
      }

    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="row">
                    {/* App Setting */}
                    <div className="col-sm-4 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <h5>App Setting</h5>
                                <div className="row">
                                    <div className="col-8 col-sm-12 col-xl-8 my-auto">
                                        <div className="d-flex d-sm-block align-items-center">
                                            <p className="mb-0"><strong>Version :-</strong> {Config?.app?.version || "1.0.0"}</p>
                                            <p className="mb-0"><strong>Name :-</strong> {Config?.app?.name || "AppName"}</p>
                                            <p className="mb-0"><strong>Licence :-</strong> {Config?.app?.licence?.name || "Default"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Wallet Config */}
                    <div className="col-sm-4 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <h5>Wallet</h5>
                                <div className="form-group d-flex">
                                    <label><strong>Status</strong></label><br />
                                    <label className="switch">
                                        <input type="checkbox" name="withdrawlStatus" checked={walletConf.withdrawlStatus} onChange={handleChange} />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div className="form-group">
                                    <label><strong>Min Deposit</strong></label>
                                    <input type="number" className="form-control" name="minDeposit" value={walletConf.minDeposit} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label><strong>Min Withdrawal</strong></label>
                                    <input type="number" className="form-control" name="minWithdrawal" value={walletConf.minWithdrawal} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label><strong>Withdrawal Fee</strong></label>
                                    <input type="number" className="form-control" name="withdrawalFee" value={walletConf.withdrawalFee} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label><strong>Deposit Hold Message</strong></label>
                                    <textarea type="text" className="form-control" name="depositeHold" cols={10} value={walletConf.depositeHold} onChange={handleChange} />
                                </div>

                                <button className="btn btn-primary mt-3" onClick={handleSave}>Save</button>
                            </div>
                        </div>
                    </div>

                    {/* 2FA Placeholder */}
                    <div className="col-sm-4 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <h5>2FA</h5>
                                <div className="row">
                                    {!QrDisplay ?
                                    <div className="col-8 col-sm-12 col-xl-8 my-auto">
                                        <div className="d-flex d-sm-block d-md-flex align-items-center">
                                            <h2 className="mb-0">36</h2>
                                        </div>
                                        {Session?.twoFAStatus ? <p className="mb-0 text-success"><strong>2FA is already enabled</strong></p>:
                                        <button className="btn btn-lg btn-primary btn-block auth-button-marg" onClick={generateQRCode}>Continue</button>}

                                    </div>
                                    :
                                    <div className="col-8 col-sm-12 col-xl-8 my-auto">
                                        <div className="d-flex d-sm-block m-2">
                                            {qrCode && <img src={qrCode} alt="QR Code" />}
                                            <input type="text" className="form-control form-control-lg" id="oneCode" name="cp1-app-code" placeholder="Check your app" onChange={(e)=>setPin(e.target.value)} maxLength="6" required="" />
                                        </div>
                                        <button className="btn btn-lg btn-primary btn-block auth-button-marg" onClick={handleAuthApp}>Verify</button>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Setting
