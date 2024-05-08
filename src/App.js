import React from "react";
import './App.css'
import Home from "./components/Home";
import { QrLanding } from "./components/Views/techLanding/modules/QrLanding";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ManagerView } from "./components/Views/adminDashboard/ManagerView";
import { Sites } from "./components/Views/adminSites/Sites";
import { MaintDash } from "./components/Views/adminMaintenances/MaintDash";
import { ReportsDashAdmin } from "./components/Views/adminReports/ReportsDashAdmin";
import { SitesEquipmentAdmin } from "./components/Views/adminSitesEquip/SitesEquipmentAdmin";


import { TechLanding } from "./components/Views/techLanding/TechLanding";
import { MaintsSuperAdmin } from "./components/Views/superAdminMaintenances/MaintsSuperAdmin";
import { TechLandingSA } from "./components/Views/techLanding/TechLandingSA";
import { PwRnw } from "./components/Views/userReset/PwRnw";
import { NewReportEnvelope } from "./components/Views/techLanding/modules/NewReportEnvelope";
import PDFSaver from "./components/Views/adminPrintLabels/PDFLabelSaver";
import { SitesSuperAdmin } from "./components/Views/superAdminSites/SitesSuperAdmin";

export default function App() {
  return (
    <div className='App'>
      <Router>
          <Routes>
            <Route exact path='/' element={<Home/>}></Route>
            <Route exact path='/PwRnw/:id' element={<PwRnw/>}></Route>
            <Route exact path='/lp/:params' element={<PDFSaver/>}></Route>

            <Route exact path='/gpadDash' element={<ManagerView/>}></Route>
            <Route exact path='/gpadSites' element={<Sites/>}></Route>
            <Route exact path='/gpadSitesSA' element={<SitesSuperAdmin/>}></Route>
            <Route exact path='/gpadMaintenances' element={<MaintDash/>}></Route>
            <Route exact path='/gpadReports' element={<ReportsDashAdmin/>}></Route>
            <Route exact path='/gpadEquip' element={<SitesEquipmentAdmin/>}></Route>
            <Route exact path='/gpadSitesSuAd' element={<MaintsSuperAdmin/>}></Route>
            <Route exact path='/gpteLandSA/:params' element={<TechLandingSA/>}></Route>

            <Route exact path='/gpteLand' element={<TechLanding/>}></Route>

            <Route exact path='/equipdetails/:params' element={<QrLanding/>}></Route>
            <Route exact path='/newRep/:params' element={<NewReportEnvelope/>}></Route>
            
            <Route path="*" element={<Home/>}></Route>
          </Routes>
      </Router>
    </div>
  );
}
