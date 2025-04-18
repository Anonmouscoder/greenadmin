import React, { useEffect, useState } from 'react'
import Card from '../component/Card'
import TransDash from '../component/TransDash'
import SupportTicket from '../component/SupportTicket'
import MinerComponent from '../component/MinerComponent'
import OrderDash from '../component/OrderDash'
import Footer from '../component/Footer'
import { getAdminDash } from '../services/Constant'

function Dashboard() {
  const [Users, setUsers] = useState([]);
  const [Orders, setOrders] = useState([]);
  const [Tickets, setTickets] = useState([]);
  useEffect(() => {
    getDashboard();
}, [])

const getDashboard = async() =>{
    let res = await fetch(getAdminDash,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    let result = await res.json();
    if(result.status){
      setUsers(result.data[0]);
      setOrders(result.data[2]);
      setTickets(result.data[1]);
    }
}
  return (
    
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="row">
                <Card value={Users.length} vairy={""} link={"/users/all"} tag={"Users"} icon={'mdi mdi-arrow-top-right icon-item'} />
                <Card value={Users.length > 0 && Users.filter(user => user.personalStack > 0).length} link={"/users/Stackers"} vairy={""} tag={"Stakers"} icon={'mdi mdi-arrow-top-right icon-item'} />
                <Card value={Users.length > 0 && Users.filter(user => user.isBlocked).length} vairy={""} link={"/users/blocked"} tag={"Blocked"} icon={'mdi mdi-arrow-top-right icon-item'} />
                <Card value={Users.length > 0 && Users.filter(user => user.personalStack === 0).length} link={"/users/inactiveUsers"} vairy={""} tag={"Inactive"} icon={'mdi mdi-arrow-top-right icon-item'} />
            </div>
            <div className="row">
              <TransDash data={Users} order={Orders} />
              <SupportTicket data={Tickets} />
            </div>
            <MinerComponent data={Orders} />
            <OrderDash data={Orders} />
          </div>
          <Footer />
        </div>
      
  )
}

export default Dashboard
