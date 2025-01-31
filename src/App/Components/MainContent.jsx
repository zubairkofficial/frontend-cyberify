import AppSidebar from "./AppSidebar";
import Aside from "./Aside";

const MainContent = ({ children, aside = null }) => {
    return (
        <>
            <AppSidebar />
            <div className="app-main flex-column flex-row-fluid " id="kt_app_main">
                <div id="kt_app_content" className="app-content  flex-column-fluid " >
                    <div id="kt_app_content_container" className="app-container container-xxl ">
                        {children}
                    </div>
                </div>
            </div>
        </>
        
    );
}

export default MainContent;