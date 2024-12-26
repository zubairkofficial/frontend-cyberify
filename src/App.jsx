import Home from "./App/Pages/Home";
import "./assets/plugins/custom/fullcalendar/fullcalendar.bundle.css";
import "./assets/plugins/custom/datatables/datatables.bundle.css";
import "./assets/plugins/global/plugins.bundle.css";
import "./assets/css/style.bundle.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./App/Layout";
import TeamManagement from "./App/Pages/TeamManagement";
import AddTeamMember from "./App/Pages/Team/AddMember";
import Login from "./App/Pages/Login";
import Projects from "./App/Pages/Projects";
import CreateProject from "./App/Pages/Projects/CreateProject";
import Helper from "./App/Config/Helper";
import ProjectPage from "./App/Pages/Projects/ProjectPage";
import Biddings from "./App/Pages/Bidding";
import CreateBidding from "./App/Pages/Bidding/CreateBidding";
import BiddingTeam from "./App/Pages/BiddingTeam";
import BidResponse from "./App/Pages/BidResponse";
import Services from "./App/Pages/Services";
import ServiceView from "./App/Pages/Services/ServiceView";
import Service from "./App/Pages/Services/Service";
import UseCases from "./App/Pages/UseCases";
import UseCaseView from "./App/Pages/Usecases/UseCaseView";
import UseCase from "./App/Pages/Usecases/UseCase";
import Blogs from "./App/Pages/Blogs";
import Blog from "./App/Pages/Blogs/Blog";
import BlogCategories from "./App/Pages/BlogCategories";
import ViewBlog from "./App/Pages/Blogs/ViewBlog";
import Settings from "./App/Pages/Settings";
import KnowledgeBase from "./App/Pages/KnowledgeBase";
import ApiKeys from "./App/Pages/ApiKeys";
import ErrorPage from "./App/Pages/ErrorPage";
import CoverLetterTemplates from "./App/Pages/CoverLetterTemplates";
import Keywords from "./App/Pages/Keyword";
import Industries from "./App/Pages/Industries";
import Industry from "./App/Pages/Industries/Industry";
import ViewIndustry from "./App/Pages/Industries/ViewIndustry";
import GalleryCategories from "./App/Pages/Gallery/GalleryCategories";
import GalleryImages from "./App/Pages/Gallery/GalleryImages";

const Auth = ({ children, isAuth = true }) => {
  let user = Helper.getItem("user", true);
  let token = Helper.getItem("token");
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
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ErrorPage />} />
        <Route
          path="/"
          element={
            <Auth isAuth={false}>
              <Login />
            </Auth>
          }
        />
        <Route path="/user" element={<AppLayout />}>
          <Route
            path="/user/dashboard"
            element={
              <Auth>
                <Home />
              </Auth>
            }
          />
          <Route
            path="/user/team"
            element={
              <Auth>
                <TeamManagement />
              </Auth>
            }
          />
          <Route
            path="/user/team/add"
            element={
              <Auth>
                <AddTeamMember />
              </Auth>
            }
          />
          <Route
            path="/user/team/edit/:user_id"
            element={
              <Auth>
                <AddTeamMember />
              </Auth>
            }
          />
          <Route
            path="/user/projects"
            element={
              <Auth>
                <Projects />
              </Auth>
            }
          />
          <Route
            path="/user/projects/create"
            element={
              <Auth>
                <CreateProject />
              </Auth>
            }
          />
          <Route
            path="/user/project/:project_id/:project_name"
            element={
              <Auth>
                <ProjectPage />
              </Auth>
            }
          />
          <Route
            path="/user/biddings-stats"
            element={
              <Auth>
                <BiddingTeam />
              </Auth>
            }
          />
          <Route
            path="/user/biddings"
            element={
              <Auth>
                <Biddings />
              </Auth>
            }
          />
          <Route
            path="/user/biddings/create"
            element={
              <Auth>
                <CreateBidding />
              </Auth>
            }
          />
          <Route
            path="/user/bid-response"
            element={
              <Auth>
                <BidResponse />
              </Auth>
            }
          />

          <Route
            path="/user/industries"
            element={
              <Auth>
                <Industries />
              </Auth>
            }
          />
           <Route
            path="/user/create-industry"
            element={
              <Auth>
                <Industry />
              </Auth>
            }
          />
          <Route
            path="/user/industry/edit/:id"
            element={
              <Auth>
                <Industry />
              </Auth>
            }
          />
          <Route
            path="/user/industry/view/:id"
            element={
              <Auth>
                <ViewIndustry />
              </Auth>
            }
          />

          <Route
            path="/user/services"
            element={
              <Auth>
                <Services />
              </Auth>
            }
          />
          <Route
            path="/user/service/create"
            element={
              <Auth>
                <Service />
              </Auth>
            }
          />
          <Route
            path="/user/service/edit/:id/:name"
            element={
              <Auth>
                <Service />
              </Auth>
            }
          />
          <Route
            path="/user/service/view/:id/:name"
            element={
              <Auth>
                <ServiceView />
              </Auth>
            }
          />

          <Route
            path="/user/use-cases"
            element={
              <Auth>
                <UseCases />
              </Auth>
            }
          />
          <Route
            path="/user/use-case/create"
            element={
              <Auth>
                <UseCase />
              </Auth>
            }
          />
          <Route
            path="/user/use-case/edit/:id/:name"
            element={
              <Auth>
                <UseCase />
              </Auth>
            }
          />
          <Route
            path="/user/use-case/view/:id/:name"
            element={
              <Auth>
                <UseCaseView />
              </Auth>
            }
          />

          <Route
            path="/user/blog-categories"
            element={
              <Auth>
                <BlogCategories />
              </Auth>
            }
          />

          <Route
            path="/user/blogs"
            element={
              <Auth>
                <Blogs />
              </Auth>
            }
          />
          <Route
            path="/user/settings/:chat_slug?"
            element={
              <Auth>
                <Settings />
              </Auth>
            }
          />
          <Route
            path="/user/knowledgebase"
            element={
              <Auth>
                <KnowledgeBase />
              </Auth>
            }
          />
          <Route
            path="/user/apikeys"
            element={
              <Auth>
                <ApiKeys />
              </Auth>
            }
          />
          <Route
            path="/user/cover-letters"
            element={
              <Auth>
                <CoverLetterTemplates />
              </Auth>
            }
          />
          <Route
            path="/user/gallery-categories"
            element={
              <Auth>
                <GalleryCategories />
              </Auth>
            }
          />
          <Route
            path="/user/gallery-images"
            element={
              <Auth>
                <GalleryImages />
              </Auth>
            }
          />
          <Route
            path="/user/keywords"
            element={
              <Auth>
                <Keywords />
              </Auth>
            }
          />
          <Route
            path="/user/create-blog"
            element={
              <Auth>
                <Blog />
              </Auth>
            }
          />
          <Route
            path="/user/blog/edit/:id/:slug"
            element={
              <Auth>
                <Blog />
              </Auth>
            }
          />
          <Route
            path="/user/blog/view/:id/:slug"
            element={
              <Auth>
                <ViewBlog />
              </Auth>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
