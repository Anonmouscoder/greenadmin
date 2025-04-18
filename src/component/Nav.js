import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a className="sidebar-brand brand-logo" href="/"><img src="assets/images/logo.svg" alt="logo" /></a>
          <a className="sidebar-brand brand-logo-mini" href="/"><img src="assets/images/logo-mini.svg" alt="logo" /></a>
        </div>
        <ul className="nav">
          <li className="nav-item profile">
            <div className="profile-desc">
              <div className="profile-pic">
                <div className="count-indicator">
                  <img className="img-xs rounded-circle " src="assets/images/faces/face15.jpg" alt="" />
                  <span className="count bg-success"></span>
                </div>
                <div className="profile-name">
                  <h5 className="mb-0 font-weight-normal">Cardano Core</h5>
                  <span>Master</span>
                </div>
              </div>
              <a href="#" id="profile-dropdown" data-bs-toggle="dropdown"><i className="mdi mdi-dots-vertical"></i></a>
              <div className="dropdown-menu dropdown-menu-right sidebar-dropdown preview-list" aria-labelledby="profile-dropdown">
                <a href="#" className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-cog text-primary"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1 text-small">Account settings</p>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-onepassword  text-info"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1 text-small">Change Password</p>
                  </div>
                </a>
                <div className="dropdown-divider"></div>
                <a href="#" className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <div className="preview-icon bg-dark rounded-circle">
                      <i className="mdi mdi-calendar-today text-success"></i>
                    </div>
                  </div>
                  <div className="preview-item-content">
                    <p className="preview-subject ellipsis mb-1 text-small">To-do list</p>
                  </div>
                </a>
              </div>
            </div>
          </li>
          <li className="nav-item nav-category">
            <span className="nav-link">Navigation</span>
          </li>
          <li className="nav-item menu-items">
            <a className="nav-link" href="/">
              <span className="menu-icon">
                <i className="mdi mdi-speedometer"></i>
              </span>
              <span className="menu-title">Dashboard</span>
            </a>
          </li>
          {/* <li className="nav-item menu-items">
            <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
              <span className="menu-icon">
                <i className="mdi mdi-laptop"></i>
              </span>
              <span className="menu-title">Basic UI Elements</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="ui-basic">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item"> <a className="nav-link" href="pages/ui-features/buttons.html">Buttons</a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/ui-features/dropdowns.html">Dropdowns</a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/ui-features/typography.html">Typography</a></li>
              </ul>
            </div>
          </li> */}
          {/* <li className="nav-item menu-items">
            <a className="nav-link" href="pages/forms/basic_elements.html">
              <span className="menu-icon">
                <i className="mdi mdi-playlist-play"></i>
              </span>
              <span className="menu-title">Form Elements</span>
              <i className="menu-arrow"></i>
            </a>
          </li>
          <li className="nav-item menu-items">
            <a className="nav-link" href="pages/tables/basic-table.html">
              <span className="menu-icon">
                <i className="mdi mdi-table-large"></i>
              </span>
              <span className="menu-title">Tables</span>
              <i className="menu-arrow"></i>
            </a>
          </li>
          <li className="nav-item menu-items">
            <a className="nav-link" href="pages/charts/chartjs.html">
              <span className="menu-icon">
                <i className="mdi mdi-chart-bar"></i>
              </span>
              <span className="menu-title">Charts</span>
              <i className="menu-arrow"></i>
            </a>
          </li>
          <li className="nav-item menu-items">
            <a className="nav-link" href="pages/icons/font-awesome.html">
              <span className="menu-icon">
                <i className="mdi mdi-contacts"></i>
              </span>
              <span className="menu-title">Icons</span>
              <i className="menu-arrow"></i>
            </a>
          </li> */}

          <li className="nav-item menu-items">
            <a className="nav-link" data-bs-toggle="collapse" href="#plan" aria-expanded="false" aria-controls="plan">
              <span className="menu-icon">
                <i className="mdi mdi-chart-bar"></i>
              </span>
              <span className="menu-title">Plan Control</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="plan">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className="nav-link" to="/plan/stackRoi">
                    <i className="fa fa-list m-2" /> Stack ROI
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/plan/stackLevelRoi">
                    <i className="fa fa-list m-2" /> Stack Level ROI
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/plan/miningRoi">
                    <i className="fa fa-list m-2" /> Mining ROI
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/plan/reward">
                    <i className="fa fa-list m-2" /> Reward
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/plan/leadership">
                    <i className="fa fa-list m-2" /> Leadership Rank
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        
          <li className="nav-item menu-items">
            <a className="nav-link" data-bs-toggle="collapse" href="#stake" aria-expanded="false" aria-controls="stake">
              <span className="menu-icon">
                <i className="mdi mdi-file-excel"></i>
              </span>
              <span className="menu-title">Stack Report</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="stake">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className="nav-link" to="/stakeAdmin/sdb">
                    <i className="fa fa-list m-2" /> Stak ROI Bonus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stakeAdmin/sdbSpo">
                    <i className="fa fa-list m-2" /> Stak ROI Spo Bonus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stakeAdmin/ib">
                    <i className="fa fa-list m-2" /> Introducer Bonus
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/stakeAdmin/tdb">
                    <i className="fa fa-list m-2" /> Team Development Bonus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stakeAdmin/gpb">
                    <i className="fa fa-list m-2" /> Global Pool Bonus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stakeAdmin/srb">
                    <i className="fa fa-list m-2" /> Super Revenue Bonus
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/stakeAdmin/lb">
                    <i className="fa fa-list m-2" /> Leadership Bonus
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item menu-items">
            <a className="nav-link" data-bs-toggle="collapse" href="#miner" aria-expanded="false" aria-controls="miner">
              <span className="menu-icon">
                <i className="mdi mdi-cart"></i>
              </span>
              <span className="menu-title">Miner</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="miner">
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link className="nav-link" to="/miner/all">
                    <i className="fa fa-shopping-cart m-2" /> All Miner
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/miner/orders">
                    <i className="fa fa-list m-2" /> Orders
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/miner/resale">
                    <i className="fa fa-list m-2" /> Resale
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/miner/transaction">
                    <i className="fa fa-list m-2" /> Transaction
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/miner/transactionSpo">
                    <i className="fa fa-list m-2" /> Sponcer Transaction
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/miner/releasedPayout">
                    <i className="fa fa-list m-2" /> Payout
                  </Link>
                </li>
              </ul>
            </div>
          </li>

          <li className="nav-item menu-items">
            <a className="nav-link" data-bs-toggle="collapse" href="#wallet" aria-expanded="false" aria-controls="wallet">
              <span className="menu-icon">
                <i className="mdi mdi-wallet"></i>
              </span>
              <span className="menu-title">Wallet Transaction</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="wallet">
  <ul className="nav flex-column sub-menu">
    <li className="nav-item">
      <Link className="nav-link" to="/wallet/all">
        <i className="fa fa-list m-2" /> All Transaction
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/wallet/deposit">
        <i className="fa fa-plus-circle m-2" /> Deposit
      </Link>
    </li>
    <li className="nav-item">
      <Link className="nav-link" to="/wallet/withdrawal">
        <i className="fa fa-minus-circle m-2" /> Withdrawal
      </Link>
    </li>
  </ul>
</div>
          </li>
          <li className="nav-item menu-items">
            <a className="nav-link" data-bs-toggle="collapse" href="#auth" aria-expanded="false" aria-controls="auth">
              <span className="menu-icon">
                <i className="mdi mdi-security"></i>
              </span>
              <span className="menu-title">User Action</span>
              <i className="menu-arrow"></i>
            </a>
            <div className="collapse" id="auth">
              <ul className="nav flex-column sub-menu">
              <li className="nav-item"> <Link className="nav-link" to="/users/all"> <i className='fa fa-users m-2' /> All Users </Link></li>
              <li className="nav-item"> <Link className="nav-link" to="/users/poolStackers"> <i className='fa fa-smile-o m-2' /> Pool Staker </Link></li>
              <li className="nav-item"> <Link className="nav-link" to="/users/inactiveUsers"> <i className='fa fa-frown-o m-2' /> Inactive Users </Link></li>
              <li className="nav-item"> <Link className="nav-link" to="/users/activeMiners"> <i className='fa fa-gears m-2' /> Active Miners </Link></li>
              <li className="nav-item"> <Link className="nav-link" to="/users/inactiveMiners"> <i className='fa fa-pause m-2' /> Inactive Miners </Link></li>
              <li className="nav-item"> <Link className="nav-link" to="/users/blocked"> <i className='fa fa-ban m-2' /> Blocked Users </Link></li>
                {/* <li className="nav-item"> <a className="nav-link" href="pages/samples/login.html"> Login </a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/samples/register.html"> Register </a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/samples/error-404.html"> 404 </a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/samples/error-500.html"> 505 </a></li>
                <li className="nav-item"> <a className="nav-link" href="pages/samples/blank-page.html"> Blank Page </a></li> */}
              </ul>
            </div>
          </li>
          <li className="nav-item menu-items">
            <Link className="nav-link" to="/wallets">
              <span className="menu-icon">
                <i className="mdi mdi-wallet"></i>
              </span>
              <span className="menu-title">Wallets</span>
            </Link>
          </li>
          <li className="nav-item menu-items">
            <Link className="nav-link" to="/supportTicket">
              <span className="menu-icon">
                <i className="mdi mdi-help"></i>
              </span>
              <span className="menu-title">Support Ticket</span>
            </Link>
          </li>
          <li className="nav-item menu-items">
            <Link className="nav-link" to="/notice">
              <span className="menu-icon">
                <i className="mdi mdi-bell"></i>
              </span>
              <span className="menu-title">Notice</span>
            </Link>
          </li>
          {/* <li className="nav-item menu-items">
            <a className="nav-link" href="docs/documentation.html">
              <span className="menu-icon">
                <i className="mdi mdi-file-document"></i>
              </span>
              <span className="menu-title">Documentation</span>
            </a>
          </li> */}
        </ul>
      </nav>
  )
}

export default Nav
