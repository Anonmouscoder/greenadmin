import React from 'react'
import Nav from '../component/Nav'
import InnerNav from '../component/InnerNav'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
  return (
    <div className="container-scroller">
      <Nav />
      <div className="container-fluid page-body-wrapper">
        <InnerNav />
        <Outlet />
        </div>
    </div>
  )
}

export default AdminLayout
