import { Outlet, useLocation } from "react-router-dom";
import Helper from "./Config/Helper";
import { useEffect } from "react";
import AppSidebar from "./Components/AppSidebar";
import Aside from "./Components/Aside";

const AppLayout = () => {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
        Helper.loadScript("plugins/global/plugins.bundle.js")
            .then(() => Helper.loadScript("js/scripts.bundle.js"))
            .catch(error => console.error("Script loading failed: ", error));
    }, [location.pathname]);

    return (
        <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
            <div class="app-page  flex-column flex-column-fluid " id="kt_app_page">
                <div id="kt_app_header" class="app-header d-flex d-lg-none border-bottom ">
                    <div class="app-container container-fluid d-flex flex-stack" id="kt_app_header_container">
                        <button class="btn btn-icon btn-sm btn-active-color-primary ms-n2" id="kt_app_sidebar_mobile_toggle">
                            <i class="ki-outline ki-abstract-14 fs-2"></i>
                        </button>
                        <a href="index.html">
                            <img alt="Logo" src="/assets/logo-dark.png" class="h-30px theme-light-show"/>
                            <img alt="Logo" src="/assets/logo-white.png" class="h-30px theme-dark-show"/>
                        </a>
                        <button class="btn btn-icon btn-sm btn-active-color-primary me-n2" id="kt_app_aside_mobile_toggle">
                            <i class="ki-outline ki-menu fs-2"></i>
                        </button>
                    </div>
                </div>
                <div class="app-wrapper  flex-column flex-row-fluid " id="kt_app_wrapper">
                    {/* <div id="kt_app_hero" class="app-hero ">
                        <div id="kt_app_hero_container" class="app-container  container-xxl ">
                            <div class="card card-flush border-0 bgi-no-repeat bgi-size-cover bgi-position-center mt-8 " style={{backgroundColor:"black"}}>

                            </div>
                        </div>
                    </div> */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default AppLayout;