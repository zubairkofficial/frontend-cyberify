import Home from './App/Pages/Home'
import './assets/plugins/custom/fullcalendar/fullcalendar.bundle.css'
import './assets/plugins/custom/datatables/datatables.bundle.css'
import './assets/plugins/global/plugins.bundle.css'
import './assets/css/style.bundle.css'

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './App/Layout'
import TeamManagement from './App/Pages/TeamManagement'
import AddTeamMember from './App/Pages/Team/AddMember'
import Login from './App/Pages/Login'
import Projects from './App/Pages/Projects'
import CreateProject from './App/Pages/Projects/CreateProject'
import Helper from './App/Config/Helper'
import ProjectPage from './App/Pages/Projects/ProjectPage'
import Biddings from './App/Pages/Bidding'
import CreateBidding from './App/Pages/Bidding/CreateBidding'
import BiddingTeam from './App/Pages/BiddingTeam'
import BidResponse from './App/Pages/BidResponse'

const Auth = ({ children, isAuth = true }) => {
  let user = Helper.getItem('user', true);
  let token = Helper.getItem('token');
  if (isAuth) {
    if (!user || !token) {
      Helper.toast("error", "Please login to continue");
      return <Navigate to="/" />;
    }

    return children;
  } else {
    if (user && token) {
      return <Navigate to="/user/dashboard" />;
    }
    return children;
  }
}

function App() {



  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Auth isAuth={false}><Login /></Auth>} />
        <Route path="/user" element={<AppLayout />}>
          <Route path="/user/dashboard" element={<Auth><Home /></Auth>} />
          <Route path="/user/team" element={<Auth><TeamManagement /></Auth>} />
          <Route path="/user/team/add" element={<Auth><AddTeamMember /></Auth>} />
          <Route path="/user/team/edit/:user_id" element={<Auth><AddTeamMember /></Auth>} />
          <Route path="/user/projects" element={<Auth><Projects /></Auth>} />
          <Route path="/user/projects/create" element={<Auth><CreateProject /></Auth>} />
          <Route path="/user/project/:project_id/:project_name" element={<Auth><ProjectPage /></Auth>} />
          <Route path="/user/biddings-stats" element={<Auth><BiddingTeam /></Auth>} />
          <Route path="/user/biddings" element={<Auth><Biddings /></Auth>} />
          <Route path="/user/biddings/create" element={<Auth><CreateBidding /></Auth>} />
          <Route path="/user/bid-response" element={<Auth><BidResponse /></Auth>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App