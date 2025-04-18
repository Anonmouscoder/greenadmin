import { useLocation, useParams, Link } from 'react-router-dom'
import React, { useState, useEffect } from "react";
import { API_URL } from '../services/Constant';
import TablePlan from '../component/TablePlan';
function PlanList() {
  const {status} = useParams();
  const location = useLocation();
  const basePath = "/" + location.pathname.split("/")[1];
  return (
    <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title"> {basePath === "/plan" ? "Plan Control" : "Others"} </h3>
            </div>
            <div className="row">
              <TablePlan dataUrl={API_URL+location.pathname} />
            </div>
          </div>
        </div>
  )
}

export default PlanList
