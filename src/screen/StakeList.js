import { useLocation, useParams, Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import TableData from './TableData';
import { API_URL } from '../services/Constant';
import TableStake from '../component/TableStake';

function StakeList() {
  const {status} = useParams();
  const location = useLocation();
  const basePath = "/" + location.pathname.split("/")[1];
  return (
    <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title"> {basePath === "/stake" ? "Stake":"Other"} </h3>
            </div>
            <div className="row">
              <TableStake  dataUrl={API_URL+location.pathname}/>
            </div>
          </div>
        </div>
  )
}

export default StakeList
