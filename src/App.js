import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import NoPage from "./pages/NoPage";
import Login from "./pages/Login";

// Complainant
import ManageAccount from "./pages/ManageAccount";
import ComplainantLayout from "./pages/Complainant/ComplainantLayout";
import LodgeComplaint from "./pages/Complainant/LodgeComplaint";
import CheckComplaint from "./pages/Complainant/CheckComplaint"

// Complaint Handling
import ComplaintHandlerLayout from './pages/ComplaintHandling/ComplaintHandlerLayout';
import AdministratorLayout from './pages/ComplaintHandling/AdministratorLayout';
import ManageComplaints from "./pages/ComplaintHandling/ManageComplaints";
import ManageSystem from "./pages/ComplaintHandling/ManageSystem";
import StatisticsReporting from "./pages/ComplaintHandling/StatisticsReporting";

export default function App() {
  const [hasToken, setHasToken] = useState(localStorage.getItem('token') != null);
  
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
            <Route index element = {<ManageComplaints/>} />
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
            <Route index element = {<ManageComplaints/>} />
            <Route path="managesystem" element = {<ManageSystem/>} />
            <Route path="statisticsreporting" element = {<StatisticsReporting/>} />
            <Route path="manageaccount" element = {<ManageAccount/>} />
            <Route path="*" element = {<NoPage/>} />
          </Route>
          <Route path="*" element = {<NoPage/>} />
        </Routes>
      </BrowserRouter>
    );
  
}
