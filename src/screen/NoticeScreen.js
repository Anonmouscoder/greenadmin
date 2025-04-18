import React, { useEffect, useState } from "react";
import { getNotice, updateNotice } from "../services/Constant";
import Swal from "sweetalert2";

function Notice() {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({ title: "", desc: "", type: "" });
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const res = await fetch(getNotice, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const result = await res.json();
            if (result.status) setData(result.data);
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    const formatCustomDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        }).format(date);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setFormData({ title: "", desc: "", type: "" });
        setSelectedNotice(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.desc || !formData.type) {
            return Swal.fire({ title: "Error", text: "All fields are required!", icon: "warning" });
        }

        try {
            const res = await fetch(updateNotice + (selectedNotice ? "/" + selectedNotice._id : ""), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, status: true, currentStatus: "Pending..." }),
            });
            const result = await res.json();

            Swal.fire({ title: "Success", text: result.message, icon: result.status ? "success" : "error" });
            if (result.status) {
                getData();
                handleClose();
            }
        } catch (error) {
            console.error("Submit Error:", error);
        }
    };

    const handleEditClick = (item) => {
        setSelectedNotice(item);
        setFormData({ title: item.title, desc: item.desc, type: item.type });
        setIsModalOpen(true);
    };

    return (
        <div className="main-panel">
            <div className="content-wrapper">
                <div className="row">
                    <div className="col-12 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">
                                    Important Notice
                                    <button className="btn btn-success" style={{float:"right"}} onClick={() => setIsModalOpen(true)} >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </h4>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Title</th>
                                                <th>Message</th>
                                                <th>Type</th>
                                                <th>Created At</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.length > 0 ? (
                                                data.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="text-success">{item?.title}</td>
                                                        <td className="col-wrap">{item?.desc}</td>
                                                        <td className="col-wrap">{item?.type}</td>
                                                        <td className="col-wrap">{formatCustomDate(item?.updatedAt)}</td>
                                                        <td>
                                                            {item.status ? (
                                                                <span className="text-success">Active</span>
                                                            ) : (
                                                                <span className="text-danger">Inactive</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <button className="btn btn-primary" onClick={() => handleEditClick(item)}>
                                                                <i className="fa fa-edit text-success"></i>
                                                            </button>
                                                        </td>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedNotice ? "Edit Notice" : "Add New Notice"}</h5>
                                <button type="button" className="close" onClick={handleClose}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Notice Type:</label>
                                    <select
                                        className="form-select"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Notice Type</option>
                                        <option value="Withdrawal">Deposit Withdrawal</option>
                                        <option value="Update">Important Update</option>
                                        <option value="Notice">Dashboard Notices</option>
                                        <option value="Miner">Miner</option>
                                        <option value="Ledger">Ledger</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message:</label>
                                    <textarea
                                        className="form-control"
                                        name="desc"
                                        rows="3"
                                        value={formData.desc}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    {selectedNotice ? "Update" : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notice;
