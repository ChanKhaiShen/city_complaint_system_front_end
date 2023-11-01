import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import env from "react-dotenv";

import NoPage from "./pages/NoPage";
import Login from "./pages/Login";
import SetPassword from "./pages/SetPassword";
import ManageAccount from "./pages/ManageAccount";
import CheckComplaint from "./pages/CheckComplaint"

// Complainant
import ComplainantLayout from "./pages/Complainant/ComplainantLayout";
import LodgeComplaint from "./pages/Complainant/LodgeComplaint";

// Complaint Handling
import ComplaintHandlerLayout from './pages/ComplaintHandling/ComplaintHandlerLayout';
import AdministratorLayout from './pages/ComplaintHandling/AdministratorLayout';
import ManageSystem from "./pages/ComplaintHandling/ManageSystem";
import StatisticsReporting from "./pages/ComplaintHandling/StatisticsReporting";

export default function App() {
  const [hasToken, setHasToken] = useState(localStorage.getItem('token') != null);

  console.log(env.SERVER_URL);

  useEffect(()=>{
    if (hasToken) {
      axios.get(`${env.SERVER_URL}/verifytoken`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(result=>{
        console.log('token is valid', result);
        setHasToken(true);
      }).catch(error=>{
        console.log('token is invalid', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('name');
        localStorage.removeItem('emailAddress');
        setHasToken(false);
      })
    }
  });

  if (window.location.href === '/setpassword')
    return (
      <SetPassword />
    );
  
  if (!hasToken)
    return (
      <Login setHasToken={setHasToken}/>
    );
  
  console.log(localStorage.getItem('role'), localStorage.getItem('token'), localStorage.getItem('emailAddress'), localStorage.getItem('name'));

  if (localStorage.getItem('role') === 'complainant') 
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<ComplainantLayout/>} >
            <Route index element = {<LodgeComplaint/>} />
            <Route path="checkcomplaint" element = {<CheckComplaint/>} />
            <Route path="manageaccount" element = {<ManageAccount/>} />
            <Route path="*" element = {<NoPage/>} />
          </Route>
          <Route path="*" element = {<NoPage/>} />
        </Routes>
      </BrowserRouter>
    );
  else if (localStorage.getItem('role') === 'complaint handler')
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<ComplaintHandlerLayout/>} >
            <Route index element = {<CheckComplaint/>} />
            <Route path="manageaccount" element = {<ManageAccount/>} />
            <Route path="*" element = {<NoPage/>} />
          </Route>
          <Route path="*" element = {<NoPage/>} />
        </Routes>
      </BrowserRouter>
    );
  else if (localStorage.getItem('role') === 'administrator')
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element = {<AdministratorLayout/>} >
            <Route index element = {<StatisticsReporting/>} />
            <Route path="managesystem" element = {<ManageSystem/>} />
            <Route path="checkcomplaint" element = {<CheckComplaint/>} />
            <Route path="manageaccount" element = {<ManageAccount/>} />
            <Route path="*" element = {<NoPage/>} />
          </Route>
          <Route path="*" element = {<NoPage/>} />
        </Routes>
      </BrowserRouter>
    );
  
}
