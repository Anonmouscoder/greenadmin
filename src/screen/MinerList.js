import { useLocation, useParams, Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import TableMiner from '../component/TableMiner';
import { API_URL } from '../services/Constant';

function MinerList() {
  const {status} = useParams();
  const location = useLocation();
  const basePath = "/" + location.pathname.split("/")[1];
  return (
    <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title"> {basePath === "/miner" ? "Miners" : "Others"} </h3>
            </div>
            <div className="row">
              <TableMiner dataUrl={API_URL+location.pathname} />
            </div>
          </div>
        </div>
  )
}

export default MinerList
