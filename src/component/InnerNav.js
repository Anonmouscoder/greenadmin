import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { adminLogout } from '../services/Constant';
import { DataContext } from '../utils/Context';
import Swal from 'sweetalert2';

function InnerNav() {
  const {Session} = useContext(DataContext);
  const navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
  
    try {
        await fetch(adminLogout, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
      localStorage.clear();
      Swal.fire({
        icon: 'success',
        title: 'Logged out successfully!',
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
  
    } catch (error) {
      console.error('Logout error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: 'Something went wrong!',
      });
    }
  };
  return (
    <nav className="navbar p-0 fixed-top d-flex flex-row">
          <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
            <a className="navbar-brand brand-logo-mini" href="index.html"><img src="assets/images/logo-mini.svg" alt="logo" /></a>
          </div>
          <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
            <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
              <span className="mdi mdi-menu"></span>
            </button>
            <ul className="navbar-nav navbar-nav-right">
              <li className="nav-item dropdown">
                <a className="nav-link" id="profileDropdown" href="#" data-bs-toggle="dropdown">
                  <div className="navbar-profile">
                    <img className="img-xs rounded-circle" src="../../../assets/images/faces/face15.jpg" alt="" />
                    <p className="mb-0 d-none d-sm-block navbar-profile-name">Cardano Core</p>
                    <i className="mdi mdi-menu-down d-none d-sm-block"></i>
                  </div>
                </a>
                <div className="dropdown-menu dropdown-menu-end navbar-dropdown preview-list" aria-labelledby="profileDropdown">
                  <h6 className="p-3 mb-0">Profile</h6>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item preview-item"  href="/setting">
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-cog text-success"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <a className="preview-subject mb-1 text-white">Settings</a>
                    </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item preview-item" onClick={handleLogout}>
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-logout text-danger"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject mb-1">Log out</p>
                    </div>
                  </Link>
                </div>
              </li>
            </ul>
            <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
              <span className="mdi mdi-format-line-spacing"></span>
            </button>
          </div>
        </nav>
  )
}

export default InnerNav
