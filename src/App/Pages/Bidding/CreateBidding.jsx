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
import FullRow from "../../Components/FullRow";
import SearchSelect from "../../Components/SearchSelect";
import Allowed from "../../Components/Allowed";

const CreateBidding = () => {
    const { job_id } = useParams();
    const user_type = Helper.authUser.user_type;
    const defaultJob = {
        job_name: "",
        job_type: "Hourly",
        min_price: "",
        max_price: "",
        bid_price: "",
        job_link: "",
        connects_used: 0,
        upwork_profile: "",
        client_name: "",
        client_location: "",
        total_spending: "",
        created_at: "",
        updated_at: "",
        status: "",
        user_id: null,
    }
    const connectPrice = 0.15;
    const dollarPrice = 280;

    const [profiles, setProfiles] = useState([]);
    const [jobTypes, setJobTypes] = useState([]);
    const [job, setJob] = useState(defaultJob);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [spendingUSD, setSpendingUSD] = useState(0);
    const [spendingPKR, setSpendingPKR] = useState(0);
    const [selectedBidder, setSelectedBidder] = useState({});
    const [biddersOptions, setBiddersOptions] = useState([]);
    const [statuses, setStatuses] = useState([]);

    const navigate = useNavigate();

    const calculateSpendings = () => {
        let total_usd = job.connects_used * connectPrice;
        let total_pkr = total_usd * dollarPrice;
        setSpendingUSD(total_usd);
        setSpendingPKR(total_pkr);
    }

    const getUpworkProfiles = () => {
        axios.get(`${Helper.apiUrl}common/types/upwork_profile/biddings`, Helper.authHeaders).then(response => {
            setProfiles(response.data);
        });
    }

    const getStatuses = () => {
        axios.get(`${Helper.apiUrl}common/types/status/biddings`, Helper.authHeaders).then(response => {
            setStatuses(response.data);
        });
    }

    const getJobTypes = () => {
        axios.get(`${Helper.apiUrl}common/types/job_type/biddings`, Helper.authHeaders).then(response => {
            setJobTypes(response.data);
        });
    }

    const saveBidding = () => {
        let data = job;
        if(user_type === 'admin'){
            setJob({...job, user_id: selectedBidder.value});
            data.user_id = selectedBidder.value;
        }
        setLoading(true);
        axios.post(`${Helper.apiUrl}bidding/post`, data, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            if(user_type === 'admin'){
                setJob(defaultJob);
            }else{
                navigate("/user/biddings");
            }
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        });
    }

    const getBidding = () => {
        axios.get(`${Helper.apiUrl}user/get/${job_id}`, Helper.authHeaders).then(response => {
            setJob(response.data);
        });
    }

    const getBiddersList = () => {
        axios.get(`${Helper.apiUrl}user/type/bidder`, Helper.authHeaders).then(response => {
            setBiddersOptions(Helper.makeOptions(response.data, true, 'name', 'id'));
        });
    }

    useEffect(() => {
        calculateSpendings();
    }, [job.connects_used]);

    useEffect(() => {
        getUpworkProfiles();
        getJobTypes();
        if (job_id) {
            getBidding();
        }
        if(user_type === 'admin'){
            getBiddersList();
            getStatuses();
        }
    }, []);

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={job_id ? `Update ${job.name}` : "Create New Bidding"}>
                <Link to={`/user/${user_type === 'admin' ? 'biddings-stats' : 'biddings'}`} class="btn btn-sm btn-flex btn-primary fw-bold">
                    All Biddings
                </Link>
            </Toolbar>
            <MainContent>
                <div className="row">
                    <div className="col-md-12">
                        <Card>
                            <Row>
                                <Allowed roles={["admin"]}>    
                                    <Column cols={6}>
                                        <SearchSelect label="Select Bidder" required={true} iscustom={true} placeholder="Choose Bidder" value={selectedBidder} options={biddersOptions} onChange={selected => setSelectedBidder(selected)} />
                                    </Column>
                                </Allowed>
                                <Column cols={user_type === 'admin' ? 6 : 12}>
                                    <TextInput label={"Job Name"} required={true} error={errors.job_name ? errors.job_name[0] : ''} value={job.job_name} onChange={e => setJob({ ...job, job_name: e.target.value })} />
                                </Column>
                                <Column cols={12}>
                                    <TextInput label={"Job Link"} required={true} error={errors.job_link ? errors.job_link[0] : ''} value={job.job_link} onChange={e => setJob({ ...job, job_link: e.target.value })} />
                                </Column>
                                <Column cols={6}>
                                    <BasicSelect options={jobTypes} required={true} label="Job Type" error={errors.job_type ? errors.job_type[0] : ''} value={job.job_type} onChange={e => setJob({ ...job, job_type: e.target.value })} />
                                </Column>
                                <Column cols={6}>
                                    <BasicSelect options={profiles} required={true} label="Upwork Profile" error={errors.upwork_profile ? errors.upwork_profile[0] : ''} value={job.upwork_profile} onChange={e => setJob({ ...job, upwork_profile: e.target.value })} />
                                </Column>
                                {job.job_type === 'Hourly' && <Column cols={6}>
                                    <TextInput label={"Min. Hourly ($)"} placeholder="Leave blank if not defined" error={errors.min_price ? errors.min_price[0] : ''} value={job.min_price} onChange={e => setJob({ ...job, min_price: e.target.value })} />
                                </Column>}
                                {job.job_type === 'Hourly' && <Column cols={6}>
                                    <TextInput label={"Max. Hourly ($)"} placeholder="Leave blank if not defined" error={errors.max_price ? errors.max_price[0] : ''} value={job.max_price} onChange={e => setJob({ ...job, max_price: e.target.value })} />
                                </Column>}
                                {job.job_type === 'Fixed' && <Column cols={12}>
                                    <TextInput label={"Project Budget ($)"} placeholder="Fixed Budget" required={true} error={errors.min_price ? errors.min_price[0] : ''} value={job.min_price} onChange={e => setJob({ ...job, min_price: e.target.value })} />
                                </Column>}
                                <Column cols={6}>
                                    <TextInput label={"Bidding Price ($)"} placeholder="The price on which bid is submitted" error={errors.bid_price ? errors.bid_price[0] : ''} value={job.bid_price} onChange={e => setJob({ ...job, bid_price: e.target.value })} />
                                </Column>
                                <Column cols={6}>
                                    <TextInput label={"Connects Used"} required={true} error={errors.connects_used ? errors.connects_used[0] : ''} value={job.connects_used} onChange={e => setJob({ ...job, connects_used: e.target.value })} />
                                </Column>
                                <Allowed roles={["admin"]}>
                                    <Column cols={6}>
                                        <TextInput label={"Client Name"} error={errors.client_name ? errors.client_name[0] : ''} value={job.client_name} onChange={e => setJob({ ...job, client_name: e.target.value })} />
                                    </Column>
                                </Allowed>
                                <Column cols={6}>
                                    <TextInput label={"Client Location"} error={errors.client_location ? errors.client_location[0] : ''} value={job.client_location} onChange={e => setJob({ ...job, client_location: e.target.value })} />
                                </Column>
                                <Column cols={6}>
                                    <TextInput label={"Total Spending"} error={errors.total_spending ? errors.total_spending[0] : ''} value={job.total_spending} onChange={e => setJob({ ...job, total_spending: e.target.value })} />
                                </Column>
                                <Allowed roles={["admin"]}>
                                    <Column cols={6}>
                                        <TextInput type="date" label={"Bidding Date (Created At)"} error={errors.created_at ? errors.created_at[0] : ''} value={job.created_at} onChange={e => setJob({ ...job, created_at: e.target.value })} />
                                    </Column>
                                </Allowed>
                                <Allowed roles={["admin"]}>
                                    <Column cols={6}>
                                        <BasicSelect label="Job Status" options={statuses} value={job.status} onChange={e => setJob({...job, status: e.target.value})} />
                                    </Column>
                                </Allowed>
                                <Allowed roles={["admin"]}>
                                    <Column cols={6}>
                                        <TextInput type="date" label={"Last Updated Date (Updated At)"} error={errors.updated_at ? errors.updated_at[0] : ''} value={job.updated_at} onChange={e => setJob({ ...job, updated_at: e.target.value })} />
                                    </Column>
                                </Allowed>
                            </Row>
                            <FullRow>
                                <h4>You are Spending</h4>
                                <p><strong>${spendingUSD} ≈ PKR {spendingPKR}</strong></p>
                            </FullRow>
                            <Row>
                                <Column className={'simple-flex'} cols={12}>
                                    <button className="btn btn-primary btn-loading" onClick={saveBidding} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Bidding"}</button>
                                    <Link to={`/user/${user_type === 'admin' ? 'biddings-stats' : 'biddings'}`} className="btn btn-outline-danger">Cancel</Link>
                                </Column>
                            </Row>
                        </Card>
                    </div>
                </div>
            </MainContent>
        </div>
    );
}

export default CreateBidding;