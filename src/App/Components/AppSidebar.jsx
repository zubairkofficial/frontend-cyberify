import { Link, useNavigate } from "react-router-dom";
import Helper from "../Config/Helper";
import Allowed from "./Allowed";


const SidebarItem = ({ icon, name, link = "#", isLogout = false }) => {
    const navigate = useNavigate();

    const logout = e => {
        e.preventDefault();
        localStorage.clear();
        Helper.toast("success", "Logged out successfully");
        navigate('/');
    }

    if(isLogout){
        return (
            <a onClick={logout} data-kt-menu-trigger="click" class="menu-item menu-accordion">
                <span class="menu-link">
                    <span class="menu-icon"><i class={icon}></i></span>
                    <span class="menu-title">{name}</span>
                </span>
            </a>
        )
    }else{
        return (
            <Link to={link} data-kt-menu-trigger="click" class="menu-item menu-accordion">
                <span class="menu-link">
                    <span class="menu-icon"><i class={icon}></i></span>
                    <span class="menu-title">{name}</span>
                </span>
            </Link>
        );
    }

};

const AppSidebar = () => {
    return (
        <div id="kt_app_sidebar" class="app-sidebar" data-kt-drawer="true" data-kt-drawer-name="app-sidebar" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="225px" data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
            <div class="app-sidebar-logo d-flex flex-stack px-9 pt-10 pb-5" id="kt_app_sidebar_logo">
                <a href="index.html">
                    <img alt="Logo" src={Helper.staticImage("assets/logo-dark.png")} class="h-20px theme-light-show" />
                </a>
            </div>
            <div class="app-sidebar-menu flex-column-fluid px-7">
                <div
                    id="kt_app_sidebar_menu_wrapper"
                    class=" my-5"
                    // hover-scroll-y
                    data-kt-scroll="true"
                    data-kt-scroll-activate="true"
                    data-kt-scroll-height="auto"
                    data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
                    data-kt-scroll-wrappers="#kt_app_sidebar_menu"
                    data-kt-scroll-offset="5px"
                >
                    <div class="menu menu-column menu-rounded menu-sub-indention fw-semibold" id="#kt_app_sidebar_menu" data-kt-menu="true" data-kt-menu-expand="false">
                        <Allowed all={true}><SidebarItem name={"Dashboard"} icon={"fa-light fa-house"} link="/user/dashboard" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Team"} icon={"fa-light fa-users"} link="/user/team" /></Allowed>
                        <Allowed roles={["admin", "developer", "project_manager"]}><SidebarItem name={"Projects"} icon={"fa-light fa-layer-group"} link="/user/projects" /></Allowed>
                        <Allowed roles={["admin"]}><SidebarItem name={"Bidding Stats"} icon={"fa-light fa-list-ol"} link="/user/biddings-stats" /></Allowed>
                        <Allowed roles={["bidder"]}><SidebarItem name={"Bidding"} icon={"fa-light fa-gavel"} link="/user/biddings" /></Allowed>
                        <Allowed roles={["bidder", "admin"]}><SidebarItem name={"Bid Response"} icon={"fa-light fa-pen"} link="/user/bid-response" /></Allowed>
                        <SidebarItem name={"Logout"} icon={"fa-light fa-right-from-bracket"} isLogout={true} />
                    </div>
                </div>
            </div>
            <div class="app-sidebar-footer d-flex flex-stack px-10 py-10" id="kt_app_sidebar_footer">
                <div class="me-2">
                    <div
                        class="d-flex align-items-center"
                        data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                        data-kt-menu-overflow="true"
                        data-kt-menu-placement="top-start"
                    >
                        <div class="d-flex flex-center cursor-pointer symbol symbol-circle symbol-40px">
                            <img src="https://cdn-icons-png.freepik.com/512/6596/6596121.png" alt="image" />
                        </div>
                        <div class="d-flex flex-column align-items-start justify-content-center ms-3">
                            <span class="text-gray-500  fs-8 fw-semibold">{ Helper.authUser.name }</span>
                            <a href="#" class="text-gray-800 fs-9 fw-bold text-hover-primary">{ Helper.authUser.email }</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppSidebar;