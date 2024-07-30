import { useState } from "react";
import Spinner from "../Components/Spinner";
import TextInput from "../Components/TextInput";
import Helper from "../Config/Helper";
import axios from "axios";

const Login = () => {

    const defaultUser = {
        email: "",
        password: "",
    }

    const [user, setUser] = useState(defaultUser);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleLogin = e => {
        e.preventDefault();
        setLoading(true);
        axios.post(`${Helper.apiUrl}auth/login`, user).then(response => {
            Helper.toast("success", response.data.message);
            Helper.setItem("user", response.data.user, true);
            Helper.setItem("token", response.data.access_token);
            window.location.href = "/user/dashboard";
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div class="d-flex flex-column flex-root" id="kt_app_root" style={{ height: '100vh' }}>
            <div class="d-flex flex-column flex-lg-row flex-column-fluid">
                <div class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1">
                    <div class="d-flex flex-center flex-column flex-lg-row-fluid">
                        <div class="w-lg-500px p-10">
                            <form class="form w-100">
                                <div class="text-center mb-11">
                                    <h1 class="text-gray-900 fw-bolder mb-3">
                                        Sign In
                                    </h1>
                                    <div class="text-gray-500 fw-semibold fs-6">
                                        Cyberify Management System
                                    </div>
                                </div>
                                <TextInput placeholder="Your Email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} error={errors.email ? errors.email[0] : ''} />
                                <TextInput placeholder="Password" password={true} onChange={e => setUser({...user, password: e.target.value})} error={errors.password ? errors.password[0] : ''} />
                                <button className="btn btn-primary w-100 btn-loading" disabled={loading} onClick={handleLogin}>{loading && <Spinner />}{loading ? "Please wait..." : "Sign In"}</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2" style={{backgroundImage: `url(${Helper.staticImage('assets/images/auth-bg.jpg')})`}}>
                    <div class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100">          
                        <a href="/" class="mb-0 mb-lg-12">
                            <img alt="Logo" src={Helper.staticImage("assets/logo-dark.png")} class="h-30px h-lg-30px"/>
                        </a>    

                        <img class="d-none d-lg-block mx-auto w-275px w-md-50 w-xl-500px mb-10 mb-lg-20" src={Helper.staticImage("assets/images/auth-bg-front.webp")} alt=""/>                 

                        <h1 class="d-none d-lg-block text-white fs-2qx fw-bolder text-center mb-7"> 
                            Fast, Efficient and Productive
                        </h1>  

                        <div class="d-none d-lg-block text-white fs-base text-center">
                            This management is system is created by <a href="https://cyberify.co" target="_blank" class="opacity-75-hover text-warning fw-bold me-1">Cyberify</a> 

                            to manage their projects, <br/> team and everything that comes in Cyberify. 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;