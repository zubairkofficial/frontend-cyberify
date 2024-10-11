import { Link, useLocation, useNavigate } from "react-router-dom";
import Helper from "../Config/Helper";
import Allowed from "./Allowed";


const SidebarItem = ({ icon, name, link = "#", isLogout = false }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const logout = e => {
        e.preventDefault();
        localStorage.clear();
        Helper.toast("success", "Logged out successfully");
        navigate('/');
    }

    if(isLogout){
        return (
            <a onClick={logout} data-kt-menu-trigger="click" className="menu-item menu-accordion">
                <span className="menu-link">
                    <span className="menu-icon"><i className={icon}></i></span>
                    <span className="menu-title">{name}</span>
                </span>
            </a>
        )
    }else{
        return (
            <Link to={link} data-kt-menu-trigger="click" className="menu-item menu-accordion">
                <span className={`menu-link ${location.pathname === link ? 'current' : ''}`}>
                    <span className="menu-icon"><i className={icon}></i></span>
                    <span className="menu-title">{name}</span>
                </span>
            </Link>
        );
    }

};

const AppSidebar = () => {
    return (
        <div id="kt_app_sidebar" className="app-sidebar" data-kt-drawer="true" data-kt-drawer-name="app-sidebar" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="225px" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
            <div className="app-sidebar-logo d-flex flex-stack px-9 pt-10 pb-5" id="kt_app_sidebar_logo">
                <a href="index.html">
                    <img alt="Logo" src={Helper.staticImage("assets/logo-dark.png")} className="h-20px theme-light-show" />
                </a>
            </div>
            <div className="app-sidebar-menu flex-column-fluid px-7">
                <div
                    id="kt_app_sidebar_menu_wrapper"
                    className=" my-5"
                    // hover-scroll-y
                    data-kt-scroll="true"
                    data-kt-scroll-activate="true"
                    data-kt-scroll-height="auto"
                    data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
                    data-kt-scroll-wrappers="#kt_app_sidebar_menu"
                    data-kt-scroll-offset="5px"
                    style={{ "maxHeight": "calc(100vh - 200px)", "overflowY": "auto" }}
                >
                    <div className="menu menu-column menu-rounded menu-sub-indention fw-semibold" id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false">
                        <Allowed all={true}><SidebarItem name={"Dashboard"} icon={"fa-light fa-house"} link="/user/dashboard" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Team"} icon={"fa-light fa-users"} link="/user/team" /></Allowed>
                        <Allowed roles={["admin", "developer", "project_manager"]}><SidebarItem name={"Projects"} icon={"fa-light fa-layer-group"} link="/user/projects" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Bidding Stats"} icon={"fa-light fa-list-ol"} link="/user/biddings-stats" /></Allowed>
                        <Allowed roles={["bidder"]}><SidebarItem name={"Bidding"} icon={"fa-light fa-gavel"} link="/user/biddings" /></Allowed>
                        <Allowed roles={["bidder", "admin"]}><SidebarItem name={"Bid Response"} icon={"fa-light fa-pen"} link="/user/bid-response" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Services"} icon={"fa-light fa-list-check"} link="/user/services" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Use Cases"} icon={"fa-light fa-briefcase"} link="/user/use-cases" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Blog Categories"} icon={"fa-light fa-layer-group"} link="/user/blog-categories" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Blogs"} icon={"fa-light fa-file-lines"} link="/user/blogs" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Knowledge Base"} icon={"fa-light fa-lightbulb"} link="/user/knowledgebase" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Cover Letters"} icon={"fa-light fa-envelope"} link="/user/cover-letters" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Settings"} icon={"fa-light fa-gear"} link="/user/settings" /></Allowed>
                        <SidebarItem name={"Logout"} icon={"fa-light fa-right-from-bracket"} isLogout={true} />
                    </div>
                </div>
            </div>
            <div className="app-sidebar-footer d-flex flex-stack px-10 py-5" id="kt_app_sidebar_footer" >
    <div className="me-2" style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#fff',
        width: '100%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
        <div
            className="d-flex align-items-center"
            data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
            data-kt-menu-overflow="true"
            data-kt-menu-placement="top-start"
            style={{ "gap":"8px" }}
        >
            <div className="d-flex flex-center cursor-pointer symbol symbol-circle symbol-40px" style={{
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                overflow: 'hidden',
                // marginRight: '12px'
            }}>
                <img src="https://cdn-icons-png.freepik.com/512/6596/6596121.png" alt="image" style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }} />
            </div>
            <div className="d-flex flex-column align-items-start justify-content-center" style={{ "gap":"8px" }}>
                <span className="text-gray-500 fs-8 fw-semibold">{Helper.authUser.name}</span>
                <a href="#" className="text-gray-800 fs-9 fw-bold text-hover-primary" style={{ marginTop: '4px', textDecoration: 'none' }}>{Helper.authUser.email}</a>
            </div>
        </div>
    </div>
</div>

        </div>
    );
}

export default AppSidebar;