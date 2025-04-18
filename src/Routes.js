// src/AppRoutes.js
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AutoLogout from './utils/AutoLogout';
import LoginScreen from './screen/LoginScreen';
import Dashboard from './screen/Dashboard';
import AdminLayout from './layput/AdminLayout';
import UserList from './screen/UserList';
import WalletList from './screen/WalletList';
import MinerList from './screen/MinerList';
import PlanList from './screen/PlanList';
import WalletsScreen from './screen/Wallets';
import StakeList from './screen/StakeList';
import SupportTicket from './screen/SupportTicketScreen';
import Notice from './screen/NoticeScreen';
import CheckAuth from './utils/CheckAuth';
import Setting from './screen/Setting';

function AppRoutes() {
  // useEffect(() => {
  //   AOS.init({
  //     duration: 1000,
  //     once: true,
  //   });
  // }, []);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AutoLogout />
      {/* <CheckAuth /> */}
      <Routes>
        {/* Public route (no header/footer if desired) */}
        <Route path="/login" element={<LoginScreen />} />
        {/* <Route path="/login" element={<LoginScreen />} />
        <Route path="/staffLogin" element={<LoginStaffScreen />} />
        <Route path="/signup" element={<RegistrationScreen />} />
        <Route path="/verify/:id" element={<VerificationScreen /> } />
        <Route path="/verifyStaff/:id" element={<VerificationStaffScreen /> } /> */}


        {/* Routes that share the common layout */}
          {/* <Route element={<ProtectedRoute />}> */}
          <Route element={ <CheckAuth> <AdminLayout /> </CheckAuth> } >
          <Route path="/" element={<Dashboard />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/users/:status" element={<UserList />} />
          <Route path="/wallet/:status" element={<WalletList />} />
          <Route path="/miner/:status" element={<MinerList />} />
          <Route path="/stakeAdmin/:status" element={<StakeList />} />
          <Route path="/plan/:type" element={<PlanList />} />
          <Route path="/wallets" element={<WalletsScreen />} />
          <Route path="/supportTicket" element={<SupportTicket />} />
          <Route path="/notice" element={<Notice />} />
          {/* <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/contact" element={<ContactScreen />} />
          <Route path="/task/:id" element={<LandingHome />} />
          <Route path="/appeal" element={<Appeal />} />
          <Route path="/memo" element={<Memo />} />
          <Route path="/atcom" element={<Atcom />} />
          <Route path="/allStaff" element={<Staff />} />
          <Route path="/allStudent" element={<Student />} />
          <Route path="/checkList" element={<CheckList />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/reports" element={<CommingSoon />} />
          <Route path="/printLogbook" element={<CommingSoon />} />
          <Route path="/addCollege" element={<AddCollege />} /> */}
          {/* </Route> */}
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
