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
import SearchSelect from "../../Components/SearchSelect";
import { get } from '../../Config/customs';

const CreateProject = () => {
    const {project_id} = useParams();
    const defaultProject = {
        name: "",
        description: "",
        project_manager_id: "",
        bidder_id: "",
        status: "",
        project_type: "",
        platform: "",
        upwork_bid_status: "",
        upwork_project_contract_link: "",
        upwork_project_chat_link: "",
        cancelled_reason: '',
        notes: "",
        started_date: "",
        expected_end_date: "",
        cancelled_date: "",
        completed_date: "",
    }
    const [statuses, setStatuses] = useState([]);
    const [upworkBidStatuses, setUpworkBidStatuses] = useState([]);
    const [managers, setManagers] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [bidders, setBidders] = useState([]);
    const [projectManager, setProjectManager] = useState({});
    const [bidder, setBidder] = useState({});
    const [project, setProject] = useState(defaultProject);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getProjectStatuses = async () => {
        setStatuses(await get('project/get-statuses'));
    }
    
    const getUpworkBidStatuses = async () => {
        setUpworkBidStatuses(await get('common/types/upwork_bid_status/projects'));
    }
    
    const getProjectManagers = async () => {
        setManagers(Helper.makeOptions(await get('user/type/project_manager'), true, 'name', 'id'));
    }
    
    const getBidders = async () => {
        setBidders(Helper.makeOptions(await get('user/type/bidder'), true, 'name', 'id'));
    }
    
    const getProjectTypes = async () => {
        setProjectTypes(await get(`common/types/project_type/projects`));
    }

    const saveProject = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}project/create`, project, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            navigate("/user/projects");
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        });
    }

    const getProject = () => {
        axios.get(`${Helper.apiUrl}user/get/${project_id}`, Helper.authHeaders).then(response => {
            setProject(response.data);
        });
    }

    const handleProjectManagerChange = (selectedOption) => {
        setProjectManager(selectedOption);
        setProject({...project, project_manager_id: selectedOption.value});
    }

    useEffect(() => {
        getProjectStatuses();
        getProjectManagers();
        getBidders();
        getUpworkBidStatuses();
        getProjectTypes();
        if(project_id){
            getProject();
        }
    }, []);

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={project_id ? `Update ${ project.name }` : "Create New Project"}>
                <Link to="/user/projects" class="btn btn-sm btn-flex btn-primary fw-bold">
                    All Projects
                </Link>
            </Toolbar>
            <MainContent>
                <div className="row">
                    <div className="col-md-12">
                        <Card>
                            <Row>
                                <Column cols={12}>
                                    <TextInput label={"Project Name"} required={true} error={errors.name ? errors.name[0] : ''} value={project.name} onChange={e => setProject({...project, name: e.target.value})} />
                                </Column>
                                <Column cols={12}>
                                    <TextInput isTextArea={true} label={"Project Description"} placeholder="About Project / Project Overview" required={true} error={errors.description ? errors.description[0] : ''} value={project.description} onChange={e => setProject({...project, description: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <SearchSelect label="Project Manager" value={projectManager} options={managers} onChange={handleProjectManagerChange} />
                                </Column>
                                <Column cols={6}>
                                    <BasicSelect options={statuses} required={true} label="Project Status" error={errors.status ? errors.status[0] : ''} value={project.status} onChange={e => setProject({...project, status: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <BasicSelect options={upworkBidStatuses} required={true} label="Upwork Bid Status" error={errors.upwork_bid_status ? errors.upwork_bid_status[0] : ''} value={project.upwork_bid_status} onChange={e => setProject({...project, upwork_bid_status: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <BasicSelect options={projectTypes} required={true} label="Project Type" error={errors.project_type ? errors.project_type[0] : ''} value={project.project_type} onChange={e => setProject({...project, project_type: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <TextInput label={"Started Date"} type="date" error={errors.started_date ? errors.started_date[0] : ''} value={project.started_date} onChange={e => setProject({...project, started_date: e.target.value})} />
                                </Column>
                                <Column cols={6}>
                                    <TextInput label={"Expected End Date"} type="date" error={errors.expected_end_date ? errors.expected_end_date[0] : ''} value={project.expected_end_date} onChange={e => setProject({...project, expected_end_date: e.target.value})} />
                                </Column>
                            </Row>
                            <Row>
                                <Column className={'simple-flex'} cols={12}>
                                    <button className="btn btn-primary btn-loading" onClick={saveProject} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Create Project"}</button>
                                    <Link to={'/user/projects'} className="btn btn-outline-danger">Cancel</Link>
                                </Column>
                            </Row>
                        </Card>
                    </div>
                </div>
            </MainContent>
        </div>
    );
}

export default CreateProject;