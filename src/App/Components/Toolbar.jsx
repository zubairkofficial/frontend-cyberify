const Toolbar = ({children, title}) => {
    return (
        <div id="kt_app_toolbar" class="app-toolbar  pt-10 mb-3 ">
            <div id="kt_app_toolbar_container" class="app-container  container-fluid d-flex align-items-stretch ">
                <div class="app-toolbar-wrapper d-flex flex-stack flex-wrap gap-4 w-100">
                    <div class="page-title d-flex flex-column justify-content-center gap-1 me-3">
                        <h1 class="page-heading d-flex flex-column justify-content-center text-gray-900 fw-bold fs-3 m-0">{ title }</h1>
                    </div>
                    <div class="d-flex align-items-center gap-2 gap-lg-3">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Toolbar;