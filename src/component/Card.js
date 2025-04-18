import React from 'react'
import { useNavigate } from 'react-router-dom'

function Card({value, icon, vairy, tag, link}) {
  const navigate = useNavigate();
  const handleNavigate = (e, link) => {
    e.preventDefault();
    navigate(link);
  }
  return (
    <div className="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div className="card" onClick={(e)=>handleNavigate(e, link)}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-9">
                        <div className="d-flex align-items-center align-self-start">
                          <h3 className="mb-0">{tag}</h3>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="icon icon-box-success ">
                        <span className={icon || "mdi mdi-arrow-top-right icon-item"}></span>
                        </div>
                      </div>
                    </div>
                    <h6 className="text-muted font-weight-normal">{value} <span className="text-success small mb-0 font-weight-medium">{vairy}</span></h6>
                    
                  </div>
                </div>
              </div>
  )
}

export default Card
