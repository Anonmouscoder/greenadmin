import React, { useContext, useEffect, useState } from 'react'
import { DataContext } from '../utils/Context'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { adminLogin, verifyQr } from '../services/Constant';
function LoginScreen() {
const {session} = useContext(DataContext);
const navigate = useNavigate();
const [Email, setEmail] = useState(null);
const [Password, setPassword] = useState(null);
useEffect(() => {
  console.log(session)
    if(session){
      navigate('/dashboard');
    }else{
        sessionStorage.removeItem('admin');
    }
},[session]);


const handleLogin = async(e) => {
    e.preventDefault();
    if(!Email || !Password){
        Swal.fire({
            title: 'Error',
            text: 'Please fill out all fields',
            icon: 'error',
            // timer: 1000,
          });
        return;
    }
    if(!Email){
        Swal.fire({
            title: 'Error',
            text: 'Please enter email',
            icon: 'error',
            // timer: 1000,
          });
        return;
    }
    if(!Password){
        Swal.fire({
            title: 'Error',
            text: 'Please enter password',
            icon: 'error',
            // timer: 1000,
          });
        return;
    }
    if(Password.length < 7){
        Swal.fire({
            title: 'Error',
            text: 'Password must be at least 8 characters',
            icon: 'error',
            // timer: 1000,
          });
        return;
    }
    if(!Email.includes('@')){
        Swal.fire({
            title: 'Error',
            text: 'Please enter valid email address!!',
            icon: 'error',
            // timer: 1000,
          });
        return;
    }

    const formData = {email: Email, password: Password }
    let res = await fetch(adminLogin,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    });
    console.log(res)
    let result = await res.json();
    console.log(result)
    if (result.status) {
      if(result.user.twoFAStatus){
      Swal.fire({
          title: 'Success',
          text: result.message,
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
      }).then(() => {
          // Prompt for 2FA after initial success
          Swal.fire({
              title: 'Enter 2FA Code',
              input: 'text',
              inputLabel: 'A 2FA code has been sent to your device/email.',
              inputPlaceholder: 'Enter your 2FA code',
              showCancelButton: true,
              confirmButtonText: 'Verify',
              preConfirm: (code) => {
                  if (!code) {
                      Swal.showValidationMessage('2FA code is required');
                      return false;
                  }
                  return fetch(verifyQr, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ token:code, username: result.user.userId })
                  })
                  .then(res => res.json())
                  .then(data => {
                    console.log("data",data)
                      if (!data.status) {
                          throw new Error(data.message || 'Invalid code');
                      }
                      else {
                        sessionStorage.setItem('admin', JSON.stringify(result.user));
                          Swal.fire({
                              title: '2FA Verified',
                              text: 'You will now be redirected to the dashboard.',
                              icon: 'success',
                              timer: 2000,
                              showConfirmButton: false
                          });
          
                          setTimeout(() => {
                              window.location.href = '/dashboard';
                          }, 2000);
                      }
                  })
                  .catch(err => {
                      Swal.showValidationMessage(`Verification failed: ${err.message}`);
                  });
              }
          });
      });
    }else{
      sessionStorage.setItem('admin', JSON.stringify(result.user));
      Swal.fire({
          title: 'Success',
          text: result.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
      });
      setTimeout(() => {
          window.location.href = '/dashboard';
      }, 2000);
    }
  }
  
}
  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="row w-100">
          <div className="content-wrapper full-page-wrapper d-flex align-items-center auth login-bg">
            <div className="card col-lg-4 mx-auto">
              <div className="card-body px-5 py-5">
                <h3 className="card-title text-start mb-3">Admin Login</h3>
                <form>
                  <div className="form-group">
                    <label>Username or email *</label>
                    <input type="text" className="form-control p_input" onChange={(e)=>setEmail(e.target.value
                    )}/>
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input type="password" className="form-control p_input" onChange={(e)=>setPassword(e.target.value)} />
                  </div>
                  <div className="text-center d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-block enter-btn" onClick={handleLogin} >Login</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
