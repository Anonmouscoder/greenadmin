import React, { useState } from 'react';
import { ImageUrl } from '../services/Constant';
import { Link } from 'react-router-dom';

function OrderDash({ data }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // You can adjust this

  // Sort and paginate
  data.sort((a, b) => b.miningStatus - a.miningStatus);
  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(" ", ", ");
  };

  const formatTime = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getPagination = () => {
    const pages = [];
    const sibling = 1;
    const left = Math.max(currentPage - sibling, 1);
    const right = Math.min(currentPage + sibling, totalPages);

    if (left > 2) pages.push(1, '...');
    else for (let i = 1; i < left; i++) pages.push(i);

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < totalPages - 1) pages.push('...', totalPages);
    else for (let i = right + 1; i <= totalPages; i++) pages.push(i);

    return pages;
  };

  return (
    <div className="row">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">
              Miner Order Status
              <span style={{ float: 'right' }}>
                <Link to="/miner/orders" className="text-light">
                  View All
                </Link>
              </span>
            </h4>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th> Serial </th>
                    <th> Client Name </th>
                    <th> Order No </th>
                    <th> User ID </th>
                    <th> Product Cost </th>
                    <th> Profit </th>
                    <th> Start Date </th>
                    <th> Miner Status </th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((miner, index) => (
                      <tr key={miner._id}>
                        <td>{(currentPage - 1) * pageSize + index + 1}</td> {/* Serial Number */}
                        <td>
                          <img
                            src={ImageUrl + miner?.minerId?.minerPics[0]}
                            alt="image"
                          />
                          <span className="ps-2">
                            {miner?.minerId?.specification[1].value}
                          </span>
                        </td>
                        <td> {miner?._id.slice(16, 24)} </td>
                        <td> {miner?.userId?.userId} </td>
                        <td> ${miner.amount?.toFixed(2)} </td>
                        <td> ${miner.perDay?.toFixed(2)} </td>
                        <td>
                          {formatDate(miner.createdAt)}
                          <br />
                          {formatTime(miner.createdAt)}
                        </td>
                        <td>
                          <div
                            className={
                              miner?.minerStartTime
                                ? "badge badge-outline-success"
                                : "badge badge-outline-danger"
                            }
                          >
                            {miner?.minerStartTime ? "Running" : "Pause"}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="text-center">
                      <td colSpan={8}>No orders found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <div className="d-flex gap-1 flex-wrap">
                {getPagination().map((pg, index) => (
                  <button
                    key={index}
                    className={`btn btn-sm ${
                      pg === currentPage ? "btn-primary" : "btn-outline-secondary"
                    }`}
                    onClick={() => typeof pg === "number" && setCurrentPage(pg)}
                    disabled={pg === "..."}
                  >
                    {pg}
                  </button>
                ))}
              </div>

              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
            {/* End Pagination */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDash;
