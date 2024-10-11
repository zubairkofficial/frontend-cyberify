import { Link, useNavigate, useParams } from "react-router-dom";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import Card from "../../Components/Card";
import Row from "../../Components/Row";
import Column from "../../Components/Column";
import TextInput from "../../Components/TextInput";
import axios from "axios";
import Helper from "../../Config/Helper";
import { useEffect, useState } from "react";
import BasicSelect from "../../Components/BasicSelect";
import Spinner from "../../Components/Spinner";

const AddTeamMember = () => {
    const {user_id} = useParams();
    const defaultMember = {
        name: "",
        email: "",
        password: "",
        user_type: "",
        joined_date: "",
    }
    const [types, setTypes] = useState([]);
    const [member, setMember] = useState(defaultMember);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getUserTypes = () => {
        axios.get(`${Helper.apiUrl}user/types`, Helper.authHeaders).then(response => {
            setTypes(response.data);
        });
    }

    const saveTeamMember = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}user/create`, member, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            navigate("/user/team");
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        });
    }

    const getUser = () => {
        axios.get(`${Helper.apiUrl}user/get/${user_id}`, Helper.authHeaders).then(response => {
            setMember(response.data);
        });
    }

    useEffect(() => {
        getUserTypes();
        if(user_id){
            getUser();
        }
    }, []);

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={user_id ? `Update ${ member.name }` : "Add Team Member"}>
                <Link to="/user/team" className="btn btn-sm btn-flex btn-primary fw-bold">
                    All Team Members
                </Link>
            </Toolbar>
            <MainContent>
                <div className="row">
                    <div className="col-md-12">
                        <Card>
                            <Row>
                                <Column cols={12}>
                                    <TextInput label={"Full Name"} required={true} error={errors.name ? errors.name[0] : ''} value={member.name} onChange={e => setMember({...member, name: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <TextInput label={"Email"} required={true} error={errors.email ? errors.email[0] : ''} value={member.email} onChange={e => setMember({...member, email: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <TextInput label={"Password"} required={true} password={true} error={errors.password ? errors.password[0] : ''} value={member.password} onChange={e => setMember({...member, password: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <BasicSelect options={types} required={true} label="User Type" error={errors.user_type ? errors.user_type[0] : ''} value={member.user_type} onChange={e => setMember({...member, user_type: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <TextInput label={"Joined Date"} required={true} type="date" error={errors.joined_date ? errors.joined_date[0] : ''} value={member.joined_date} onChange={e => setMember({...member, joined_date: e.target.value})} />
                                </Column>
                            </Row>
                            <Row>
                                <Column className={'simple-flex'} cols={12}>
                                    <button className="btn btn-primary btn-loading" onClick={saveTeamMember} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Member"}</button>
                                    <Link to={'/user/team'} className="btn btn-outline-danger">Cancel</Link>
                                </Column>
                            </Row>
                        </Card>
                    </div>
                </div>
            </MainContent>
        </div>
    );
}

export default AddTeamMember;