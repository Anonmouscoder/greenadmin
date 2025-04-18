import React, { useEffect, useState } from 'react'
import { getSupportTicket, getWallets, updateSupportTicket } from '../services/Constant';
import Swal from 'sweetalert2';

function SupportTicket() {
    const [data, setdata] =useState([]);
    const [Val, setVal] = useState(null);
    const [Reply, setReply] = useState(null);
    useEffect(() => {
        getData();
    }, [])
    
    const getData = async() =>{
        let res = await fetch(getSupportTicket,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        let result = await res.json();
        console.log(result)
        setdata(result.data);
    }
    function formatCustomDate(dateString) {
        const date = new Date(dateString);
        const options = { year: "numeric", month: "long", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };
        return new Intl.DateTimeFormat("en-GB", options).format(date);
    }
    const handleClose =(e)=>{
        console.log("clicked")
        setVal(null);
        setReply(null);
    }
    const handleUpdate = async(e) =>{
        e.preventDefault();
        console.log(Val, Reply);
        if(!Reply){
            Swal.fire({
                title:"Reply Error",
                text:"Please enter reply first."
            })
            return;
        }
        if(!Val){
            Swal.fire({
                title:"Ticket Error",
                text:"Please select any ticket...."
            })
        }
        let formData = {reply:Reply, status:false, currentStatus:"Successfully Replied..."};
        let res = await fetch(updateSupportTicket+'/'+Val._id,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        let result = await res.json();
        console.log(result);
        if(result.status){
            getData();
            setVal(null);
            setReply(null);
            Swal.fire({
                title:"Ticket Responce",
                text:result.message,
                icon: "success",
            })
        }
        else{
            Swal.fire({
                title:"Ticket Responce",
                text:result.message,
                icon: "error",
            })
        }
        
    }
  return (
    <div className="main-panel">
          <div className="content-wrapper">
            <div className="row ">
                    <div className="col-12 grid-margin">
                        <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Open Ticket</h4>
                            <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr >
                                    <th> Username </th>
                                    <th> Message </th>
                                    <th>Status</th>
                                    <th> Reply </th>
                                </tr>
                                </thead>
                                <tbody>
                                {data.length > 0 ? data.map((item, i)=>(<tr key={i}>
                                    <td>
                                    <p className="text-success"><i className='fa fa-user'></i> {item?.userId?.userId}</p><p className='text-warning'><i className='fa fa-bell'></i>  {formatCustomDate(item?.createdAt)}</p> <p className='text-primary'><i className='fa fa-university'></i> {item?.department}</p><p> <i className='fa fa-share'></i> {item?.currentStatus}</p></td>
                                    <td className='col-warp'> <i className='fa fa-download'></i> {item?.message} {item?.reply &&(<span className='text-warning'><br /><i className='fa fa-upload'></i>  {item.reply}</span>) }</td>
                                    <td>{item.status ? <span className='text-success'>Open</span> : <span className='text-danger'>Closed</span>}</td>
                                    <td><span onClick={(e)=>setVal(item)} className='btn btn-primary'><i  className={item.status ? 'fa fa-upload text-success' : 'fa fa-upload text-danger'}></i></span></td>
                                </tr>))
                                :<tr className='text-center'><td colSpan={4}>No data Found</td></tr>
                                }
                                </tbody>
                            </table>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    </div>
                    {Val && (<div className='modal fade show d-block' id='replyModal' tabIndex='-1' role='dialog' aria-labelledby='replyModalLabel' aria-hidden='true'>
                        <div className='modal-dialog modal-lg' role='document'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title' id='replyModalLabel'>Reply to Ticket {Val?.userId?.userId}</h5>
                                <button type='button' className='close' data-dismiss='modal' aria-label='Close' onClick={handleClose}>
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>
                            <div className='modal-body'>
                                <p className='mt-2'>Query:- {Val?.message}</p>
                                <form>
                                    <div className='form-group'>
                                        <label htmlFor='message'>Reply:</label>
                                        <textarea className='form-control' id='message' rows='3' value={Reply} onChange={(e)=>setReply(e.target.value)} required></textarea>
                                    </div>
                                </form>
                            </div>
                            <div className='modal-footer'>
                                <button type='button' className='btn btn-secondary' data-dismiss='modal' onClick={handleClose}>Close</button>
                                <button type='button' className='btn btn-primary' onClick={handleUpdate}>Send</button>
                            </div>
                            </div>
                            </div>
                            </div>)}
                    </div>
  )
}

export default SupportTicket
