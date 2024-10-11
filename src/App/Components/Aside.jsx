const Aside = () => {
    return (
        <div id="kt_app_aside" className="app-aside  flex-column my-lg-9 p-4 p-lg-0 pe-lg-5 " data-kt-drawer="true" data-kt-drawer-name="app-aside" data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="300px" data-kt-drawer-direction="end" data-kt-drawer-toggle="#kt_app_aside_mobile_toggle">
            <div className="hover-scroll-y pe-2" data-kt-scroll="true" data-kt-scroll-activate="true" data-kt-scroll-height="auto" data-kt-scroll-offset="5px">
                <div className="card card-px-0 mb-5 mb-lg-10">
                    <div className="card-header min-h-50px px-7">
                        <h4 className="card-title">Connections</h4>
                        <div className="card-toolbar">
                            <div className="me-n2">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Aside;