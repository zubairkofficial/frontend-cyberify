import { useEffect, useState } from "react";
import Column from "../../../Components/Column";
import FullRow from "../../../Components/FullRow";
import Row from "../../../Components/Row";
import TextInput from "../../../Components/TextInput";
import Spinner from "../../../Components/Spinner";
import axios from "axios";
import Helper from "../../../Config/Helper";
import Card from "../../../Components/Card";
import Moment from "react-moment";
import FixContainer from "../../../Components/FixContainer";
import NothingFound from "../../../Components/NothingFound";
import TaskClass from "./Task";

const TaskDueDates = ({ task, taskId, setMainActiveTab, refreshTasks, getTask }) => {
    const defaultHistory = {
        task_id: taskId,
        date: task.due_date.split(' ')[0],
        reason: "",
        type: 'due_date',
    }

    const [activeTab, setActiveTab] = useState("change_date");
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState(defaultHistory);
    const [allHistory, setAllHistory] = useState([]);
    const [errors, setErrors] = useState({});

    const SaveDueDate = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}task/post-history`, history, Helper.authHeaders).then(response => {
            setHistory(defaultHistory);
            getHistory();
            setMainActiveTab('task_activity');
            Helper.toast("success", response.data.message);
            TaskClass.createActivity(taskId, response.data.message);
            getTask();
            refreshTasks();
        }).catch(error => {
            setErrors(error.response.data.errors || {});
            Helper.toast("error", error.response.data.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const switchActiveTab = (tab) => {
        setActiveTab(tab);
        if(tab === "file_link"){
            setHistory({...history, is_link: true});
        }else{
            setHistory({...history, is_link: false});
        }
    }

    const getHistory = () => {
        axios.get(`${Helper.apiUrl}task/duedates-history/${taskId}`, Helper.authHeaders).then(response => {
            setAllHistory(response.data);
        })
    }

    useEffect(() => {
        getHistory();
    }, []);


    return (
        <>
            <Row>
                <Column cols={6}>
                    <button className={`btn-tab ${activeTab === 'history' && 'active'}`} onClick={() => switchActiveTab("history")}>Due Dates History</button>
                </Column>
                <Column cols={6}>
                    <button className={`btn-tab ${activeTab === 'change_date' && 'active'}`} onClick={() => switchActiveTab("change_date")}>Update Due Date</button>
                </Column>
            </Row>
            <br />
            {activeTab === 'history' && <FixContainer height={'35vh'}>
                {allHistory.length > 0 ? allHistory.map(record => {
                    return (
                        <Card key={record.id} className="mb-3" padding="py-5">
                            <Row isCenter={true}>
                                <Column cols={12}>
                                    <h5><Moment format="MMMM Do YYYY">{record.date}</Moment></h5>
                                    <p>{ record.reason }</p>
                                    <p><small>Updated on <Moment format="MMM D, YYYY, h:mm a">{record.created_at}</Moment> By <strong>{ record.user.name }</strong></small></p>
                                </Column>
                            </Row>
                        </Card>
                    );
                }) : <NothingFound />}
            </FixContainer>}
            {activeTab === 'change_date' && <FullRow>
                <FullRow>
                    <TextInput type="date" error={errors.date ? errors.date[0] : ''} label="New Due Date" placeholder="Due Date" required={true} value={history.date} onChange={(e) => setHistory({...history, date: e.target.value})} />
                </FullRow>
                <FullRow>
                    <TextInput isTextArea={true} error={errors.reason ? errors.reason[0] : ''} label="Reason" placeholder="Explain why you are changing the due date?" required={true} value={history.reason} onChange={(e) => setHistory({...history, reason: e.target.value})} />
                </FullRow>
                <Row>
                    <Column cols={6}>
                        <button className="btn btn-primary btn-loading w-100" disabled={loading} onClick={SaveDueDate}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Due Date"}</button>
                    </Column>
                    <Column cols={6}>
                        <button onClick={() => setActiveTab('history')} className="btn btn-outline-danger w-100">Cancel</button>            
                    </Column>
                </Row>
            </FullRow>}
            <br />
            <button onClick={() => setMainActiveTab('task_activity')} className="btn btn-outline-danger w-100 btn-sm">Close</button>
        </>
    );
}

export default TaskDueDates;