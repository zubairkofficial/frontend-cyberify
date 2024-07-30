import { Link } from "react-router-dom";
import Column from "../Components/Column";
import Row from "../Components/Row";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import { useEffect, useState } from "react";
import axios from "axios";
import Helper from "../Config/Helper";
import FullRow from "../Components/FullRow";
import Card from "../Components/Card";
import Moment from "react-moment";
import TextInput from "../Components/TextInput";
import BasicSelect from "../Components/BasicSelect";
import Allowed from "../Components/Allowed";
import SearchSelect from "../Components/SearchSelect";
import DataTable from "../Components/DataTable";

const BiddingTeam = () => {
    const defaultDates = {
        from_date: null,
        to_date: null,
    }

    const defaultBidderOption = {
        label: 'All Bidders',
        value: 'all',
    }

    const [dates, setDates] = useState(defaultDates);
    const [dateType, setDateType] = useState('created_at');
    const [biddings, setBiddings] = useState([]);
    const [bidders, setBidders] = useState([]);
    const [selectedBidder, setSelectedBidder] = useState(defaultBidderOption);
    const [biddersOptions, setBiddersOptions] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [stats, setStats] = useState({});
    const [currentFileter, setCurrentFilter] = useState('today');
    const [loading, setLoading] = useState(false);
    const [paginated, setPaginated] = useState([]);
    const [pageNo, setPageNo] = useState(0);

    const getBiddings = (datetype = dateType, selected_bidder = selectedBidder) => {
        if(currentFileter !== 'custom_dates'){
            axios.get(`${Helper.apiUrl}bidding/bidding-stats/${selected_bidder.value === 'all' ? 0 : selected_bidder.value}/${currentFileter}/${datetype}`, Helper.authHeaders).then(response => {
                setStats(response.data);
                setBiddings(response.data.all_jobs);
                setPaginated(Helper.paginate(response.data.all_jobs));
            });
        }
    }

    const getStatuses = () => {
        axios.get(`${Helper.apiUrl}common/types/status/biddings`, Helper.authHeaders).then(response => {
            setStatuses(response.data);
        });
    }

    const getBiddingsByDate = (datetype = dateType, selected_bidder = selectedBidder) => {
        if(dates.from_date && dates.to_date){
            setLoading(true);
            axios.get(`${Helper.apiUrl}bidding/bidding-stats/${selected_bidder.value === 'all' ? 0 : selected_bidder.value}/${currentFileter}/${datetype = dateType}/${dates.from_date}/${dates.to_date}`, Helper.authHeaders).then(response => {
                setStats(response.data);
                setBiddings(response.data.all_jobs);
                setPaginated(Helper.paginate(response.data.all_jobs));
            }).catch(error => {
                Helper.toast("error", error.response.data.message);
            }).finally(() => {
                setLoading(false);
            });
        }else{
            Helper.toast("error", "Provide both the dates to filter the biddings");
        }
    }

    const handleStatusChange = (e, updated_bidding) => {
        updated_bidding.status = e.target.value;
        setLoading(true);
        axios.post(`${Helper.apiUrl}bidding/post`, updated_bidding, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            if(currentFileter !== 'custom_dates'){
                getBiddings();
            }else{
                getBiddingsByDate();
            }
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
        }).finally(() => {
            setLoading(false);
        });
    }

    const connectPrice = 0.15;
    const dollarPrice = 280;

    const calculateSpendings = (connects_used) => {
        let total_usd = connects_used * connectPrice;
        let total_pkr = total_usd * dollarPrice;
        return { total_usd, total_pkr };
    }

    const handleDateType = (value) => {
        setDateType(value);
        if(currentFileter !== 'custom_dates'){
            getBiddings(value);
        }else{
            getBiddingsByDate(value);
        }
    }

    const getBiddersList = () => {
        axios.get(`${Helper.apiUrl}user/type/bidder`, Helper.authHeaders).then(response => {
            setBidders(response.data);
            setBiddersOptions(Helper.makeOptions(response.data, true, 'name', 'id', true, 'All Bidders'));
        });
    }

    const handleBidderChange = selected_bidder => {
        setSelectedBidder(selected_bidder);
        if(currentFileter !== 'custom_dates'){
            getBiddings(dateType, selected_bidder);
        }else{
            getBiddingsByDate(dateType, selected_bidder);
        }
    }

    useEffect(() => {
        setDates(defaultDates);
        getBiddings();
    }, [currentFileter]);
    
    useEffect(() => {
        getBiddersList();
        getStatuses();
    }, []);

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Biddings Stats"}>
                <Link to="/user/biddings/create" class="btn btn-sm btn-flex btn-primary fw-bold">
                    Add New Bidding
                </Link>
            </Toolbar>
            <MainContent>
                <Row isCenter={true}>
                    <Column cols={6}>
                        <SearchSelect iscustom={true} placeholder="Choose Bidder" value={selectedBidder} options={biddersOptions} onChange={handleBidderChange} />
                    </Column>
                    <Column cols={6} className="text-end">
                        <button className={`btn btn-sm btn-switch-left ${dateType === 'created_at' && 'switch-active'}`} onClick={() => handleDateType('created_at')}>Created Date</button>
                        <button className={`btn btn-sm btn-switch-right ${dateType === 'updated_at' && 'switch-active'}`} onClick={() => handleDateType('updated_at')}>Updated Date</button>
                    </Column>
                </Row>
                <br />
                <Row>
                    <Column className="mb-3" cols={2}>
                        <button className={`btn-tab ${currentFileter === 'today' && 'active'}`} onClick={() => setCurrentFilter("today")}>Today</button>
                    </Column>
                    <Column className="mb-3" cols={2}>
                        <button className={`btn-tab ${currentFileter === 'yesterday' && 'active'}`} onClick={() => setCurrentFilter("yesterday")}>Yesterday</button>
                    </Column>
                    <Column className="mb-3" cols={2}>
                        <button className={`btn-tab ${currentFileter === 'this_week' && 'active'}`} onClick={() => setCurrentFilter("this_week")}>This Week</button>
                    </Column>
                    <Column className="mb-3" cols={2}>
                        <button className={`btn-tab ${currentFileter === 'this_month' && 'active'}`} onClick={() => setCurrentFilter("this_month")}>This Month</button>
                    </Column>
                    <Column className="mb-3" cols={2}>
                        <button className={`btn-tab ${currentFileter === 'previous_month' && 'active'}`} onClick={() => setCurrentFilter("previous_month")}>Previous Month</button>
                    </Column>
                    <Column className="mb-3" cols={2}>
                        <button className={`btn-tab ${currentFileter === 'custom_dates' && 'active'}`} onClick={() => setCurrentFilter("custom_dates")}>Custom Dates</button>
                    </Column>
                </Row>
                {currentFileter === 'custom_dates' && <Row>
                    <Column cols={5}>
                        <TextInput type="date" label="From" required={true} value={dates.from_date} onChange={e => setDates({...dates, from_date: e.target.value})} />
                    </Column>
                    <Column cols={5}>
                        <TextInput type="date" label="To" required={true} value={dates.to_date} onChange={e => setDates({...dates, to_date: e.target.value})} />
                    </Column>
                    <Column cols={2}>
                        <button className="btn btn-primary btn-sm w-100 mt-9" disabled={loading} onClick={getBiddingsByDate}>{loading ? 'Please wait...' : 'Filter Results'}</button>
                    </Column>
                </Row>}
                <Row>
                    <Column className="mb-3" cols={3}>
                        <Card>
                            <p>Jobs Applied</p>
                            <h1>{stats.jobs_applied}</h1>
                        </Card>
                    </Column>
                    <Column className="mb-3" cols={3}>
                        <Card>
                            <p>Connects Used</p>
                            <h1>{stats.connects_used}</h1>
                        </Card>
                    </Column>
                    <Column className="mb-3" cols={3}>
                        <Card>
                            <p>Amount Spent ($)</p>
                            <h1>USD {stats.amount_pkr ? parseFloat(stats.amount_usd).toFixed(2) : 0}</h1>
                        </Card>
                    </Column>
                    <Column className="mb-3" cols={3}>
                        <Card>
                            <p>Amount Spend (PKR)</p>
                            <h1>PKR {stats.amount_pkr ? parseFloat(stats.amount_pkr).toFixed(2) : 0}</h1>
                        </Card>
                    </Column>
                    <Column className="mb-3" cols={3}>
                        <Card>
                            <p>Reversed Connects</p>
                            <h1>{stats.connects_reversed}</h1>
                        </Card>
                    </Column>
                    <Column className="mb-3" cols={3}>
                        <Card>
                            <p>Total Views</p>
                            <h1>{stats.total_views}</h1>
                        </Card>
                    </Column>
                    <Column className="mb-3" cols={3}>
                        <Card>
                            <p>Total Responses</p>
                            <h1>{stats.total_responses}</h1>
                        </Card>
                    </Column>
                    <Column className="mb-3" cols={3}>
                        <Card>
                            <p>Progress</p>
                            <h1>{parseFloat(stats.progress).toFixed(0)}%</h1>
                        </Card>
                    </Column>
                </Row>
                <FullRow className={'mt-3'}>
                    <Card>
                        <DataTable
                            data={biddings}
                            pageNo={pageNo}
                            paginate={true}
                            paginated={paginated}
                            setData={setPaginated}
                            setPageNo={setPageNo}
                            fields={['job_name', 'job_type', 'bid_price', 'upwork_profile', 'status', 'user.name']}
                            title="Job Applied"
                            description={`Total Jobs: ${stats.jobs_applied}`}
                        >
                            <table class="table align-middle table-row-dashed fs-8 gy-5">
                                <thead>
                                    <tr class="text-start text-muted fw-bold fs-8 text-uppercase gs-0">
                                        <th className="w-25">Job Title</th>
                                        <th>Bidder</th>
                                        <th>Type</th>
                                        <th>Client's Price</th>
                                        <th>Country</th>
                                        <th>Client's Spending</th>
                                        <th>Bid Price</th>
                                        <th>Connects Used</th>
                                        <th>Profile</th>
                                        <th>Spending</th>
                                        <th>{dateType === 'created_at' ? 'Date' : 'Last Updated'}</th>
                                        <th class="text-end">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {biddings.map(bid => {
                                        return (
                                            <tr>
                                                <td><a href={bid.job_link} target="_blank">{bid.job_name}</a></td>
                                                <td>{bid.user ? bid.user.name : ''}</td>
                                                <td>{bid.job_type}</td>
                                                {bid.job_type === 'Hourly' && <td>{bid.min_price ? `$${bid.min_price} - $${bid.max_price} Hourly` : 'Not Defined'}</td>}
                                                {bid.job_type === 'Fixed' && <td>${bid.min_price}</td>}
                                                <td>{bid.client_location}</td>
                                                <td>{ bid.total_spending ? `$${bid.total_spending}` : 'NEW' }</td>
                                                <td>${bid.bid_price} {bid.job_type === 'Hourly' && '/hour'}</td>
                                                <td>{bid.connects_used}</td>
                                                <td>{bid.upwork_profile}</td>
                                                <td>${parseFloat(calculateSpendings(bid.connects_used).total_usd).toFixed(0)} ≈ PKR {parseFloat(calculateSpendings(bid.connects_used).total_pkr).toFixed(0)}</td>
                                                <td><Moment format="MMMM Do YYYY">{dateType === 'created_at' ? bid.created_at : bid.updated_at}</Moment></td>
                                                <td>
                                                    <Allowed roles={["admin"]}><BasicSelect showError={false} isSmall={true} iscustom={true} style={{ backgroundColor: Helper.getBiddingStatusColor(bid.status), color: 'white' }} options={statuses} value={bid.status} onChange={e => handleStatusChange(e, bid)} /></Allowed>
                                                    <Allowed roles={["bidder"]}><span className="badge" style={{backgroundColor: Helper.getBiddingStatusColor(bid.status), color: 'white'}}>{ Helper.convertOption(bid.status) }</span></Allowed>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </DataTable>
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default BiddingTeam;