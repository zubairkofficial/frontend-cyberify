import { useEffect, useState, useCallback, useRef } from "react";
import Column from "../../Components/Column";
import Card from "../../Components/Card";
import FullRow from "../../Components/FullRow";
import axios from "axios";
import Helper from "../../Config/Helper";
import Row from "../../Components/Row";
import BasicSelect from "../../Components/BasicSelect";
import SearchSelect from "../../Components/SearchSelect";
import { debounce } from "lodash";
import Moment from "react-moment";
import TaskDocuments from "./Task/TaskDocuments";
import TaskNotes from "./Task/TaskNotes";
import TaskChat from "./Task/TaskChat";
import TaskClass from "./Task/Task";
import TaskActivity from "./Task/TaskActivity";
import TaskDueDates from "./Task/TaskDueDates";
import Allowed from "../../Components/Allowed";

const TaskViewer = ({ taskId, refreshTasks }) => {
    const [task, setTask] = useState({});
    const [loading, setLoading] = useState(false);
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [taskPriorities, setTaskPriorities] = useState([]);
    const [team, setTeam] = useState([]);
    const [assignee, setAssignee] = useState({});
    const [activeTab, setActiveTab] = useState("task_activity");
    const [activity, setActivity] = useState('');
    const prevTaskRef = useRef(task);
    const taskActivityRef = useRef();

    const getTaskPriorities = () => {
        axios.get(`${Helper.apiUrl}common/types/priority/tasks`, Helper.authHeaders).then(response => {
            setTaskPriorities(response.data);
        });
    }

    const getTask = () => {
        if (taskId) {
            setLoading(true);
            axios.get(`${Helper.apiUrl}task/single/${taskId}`, Helper.authHeaders).then(response => {
                setTask(response.data);
                setAssignee({ label: response.data.assignee.name, value: response.data.assignee.id });
                setLoading(false);
            });
        }
    }

    const getTaskStatuses = () => {
        axios.get(`${Helper.apiUrl}common/types/status/tasks`, Helper.authHeaders).then(response => {
            let developer_options = ['not_started', 'in_progress', 'in_review', 'delayed'];
            let manager_options = ['not_started', 'in_progress', 'in_review', 'on_hold', 'completed', 'delayed'];
            let admin_options = response.data;
            if(Helper.authUser.user_type == 'admin'){
                setTaskStatuses(admin_options);
            }else if(Helper.authUser.user_type == 'project_manager'){
                setTaskStatuses(manager_options);
            }else if(Helper.authUser.user_type == 'developer'){
                setTaskStatuses(developer_options);
            }
        });
    }

    const getTeam = () => {
        axios.get(`${Helper.apiUrl}user/all`, Helper.authHeaders).then(response => {
            setTeam(Helper.makeOptions(response.data, true, 'name', 'id'));
        });
    }

    const handleAssignee = (selectedOption) => {
        setAssignee(selectedOption);
        setActivity(`Assignee updated to ${selectedOption.value} from ${Helper.convertOption(task.assignee.name)}`);
        setTask({ ...task, assigned_to: selectedOption.value });
    }

    const handleStatusUpdate = e => {
        let value = e.target.value;
        setActivity(`Status updated to ${Helper.convertOption(value)} from ${Helper.convertOption(task.status)}`);
        setTask({ ...task, status: value });
    }

    const handlePriorityUpdate = e => {
        let value = e.target.value;
        setActivity(`Priority updated to ${Helper.convertOption(value)} from ${Helper.convertOption(task.status)}`);
        setTask({ ...task, priority: value });
    }

    const saveTask = useCallback(debounce(() => {
        if (!Helper.isObjectEmpty(task)) {
            axios.post(`${Helper.apiUrl}task/save`, task, Helper.authHeaders).then(response => {
                refreshTasks();
                TaskClass.createActivity(taskId, activity);
                setActivity('');
                taskActivityRef.current.getActivities();
            }).catch(error => {
                if (error.response) {
                    Helper.toast("error", error.response.data.message);
                    if (error.response.data.reason === 'incomplete') {
                        setActivity('');
                        setTask({ ...task, status: error.response.data.status });
                    }
                }
            });
        }
    }, 500), [task]);

    useEffect(() => {
        if (!Helper.isObjectEmpty(task) && task !== prevTaskRef.current) {
            saveTask();
            prevTaskRef.current = task;
        }
    }, [task, saveTask]);

    useEffect(() => {
        getTask();
        getTaskStatuses();
        getTaskPriorities();
        getTeam();
    }, [taskId]);

    return (
        <Column cols={4}>
            {<Card>
                <Row>
                    <Column cols={6}>
                        <h3>{task.task}</h3>
                    </Column>
                    <Column className={"text-end"} cols={6}>
                        <button className="btn btn-sm btn-outline-danger" onClick={getTask}>Refresh</button>
                    </Column>
                </Row>
                <br />
                <FullRow>
                    <p>{task.description}</p>
                </FullRow>
                <Row>
                    <Column cols={6}>
                        <Row isCenter={true}>
                            <Column cols={6}>
                                <p><i className="fa-light fa-bullseye"></i> <strong>Status</strong></p>
                            </Column>
                            <Column cols={6}>
                                <BasicSelect isSmall={true} iscustom={true} style={{ backgroundColor: Helper.getStatusColor(task.status), color: 'white' }} options={taskStatuses} value={task.status} onChange={handleStatusUpdate} />
                            </Column>
                        </Row>
                    </Column>
                    <Column cols={6}>
                        <Row isCenter={true}>
                            <Column cols={6}>
                                <p><i className="fa-light fa-flag"></i> <strong>Priority</strong></p>
                            </Column>
                            <Column cols={6}>
                                <BasicSelect isSmall={true} iscustom={true} style={{ backgroundColor: Helper.getPriorityColor(task.priority), color: 'white' }} options={taskPriorities} value={task.priority} onChange={handlePriorityUpdate} />
                            </Column>
                        </Row>
                    </Column>
                </Row>
                <Row isCenter={true}>
                    <Column cols={3}>
                        <p><i className="fa-light fa-user"></i> <strong>Assignee</strong></p>
                    </Column>
                    <Column cols={9}>
                        <Allowed roles={['project_manager', 'admin']}>
                            <SearchSelect iscustom={true} placeholder="Choose Assignee" required={true} value={assignee} options={team} onChange={handleAssignee} />
                        </Allowed>
                        <Allowed roles={['developer']}>
                            <p><strong>{ task.assignee ? task.assignee.name : '' }</strong></p>
                        </Allowed>
                    </Column>
                </Row>
                <Row isCenter={true}>
                    <Column cols={4}>
                        <p className="mb0"><i className="fa-light fa-calendar"></i> <strong>Start Date</strong></p>
                    </Column>
                    <Column cols={8}>
                        <p className="mb0"><Moment format="MMMM Do YYYY">{task.started_date}</Moment></p>
                    </Column>
                    <Column cols={4}>
                        {/* <button className="btn btn-add-task btn-sm fs10 w-100" onClick={() => setActiveTab('task_due_dates')}>Change Start Date</button> */}
                    </Column>
                </Row>
                <br />
                <Row isCenter={true}>
                    <Column cols={4}>
                        <p className="mb0"><i className="fa-light fa-alarm-clock"></i> <strong>Due Date</strong></p>
                    </Column>
                    <Column cols={4}>
                        <p className="mb0"><Moment format="MMMM Do YYYY">{task.due_date}</Moment></p>
                    </Column>
                    <Column cols={4}>
                        <Allowed roles={['admin', 'project_manager']}><button className="btn btn-add-task btn-sm fs10 w-100" onClick={() => setActiveTab('task_due_dates')}>Change Due Date</button></Allowed>
                    </Column>
                </Row>
                {task.completed_date && <><br /><Row isCenter={true}>
                    <Column cols={4}>
                        <p className="mb0"><i className="fa-light fa-circle-check"></i> <strong>Completed Date</strong></p>
                    </Column>
                    <Column cols={4}>
                        <p className="mb0"><Moment format="MMMM Do YYYY">{task.completed_date}</Moment></p>
                    </Column>
                    <Column cols={4}>
                        <p className="mb0">{Helper.daysDiff(task.due_date, task.completed_date)}</p>
                    </Column>
                </Row></>}
                {task.approved_date && <><br /><Row isCenter={true}>
                    <Column cols={4}>
                        <p className="mb0"><i className="fa-light fa-check-double"></i> <strong>Approved Date</strong></p>
                    </Column>
                    <Column cols={8}>
                        <p className="mb0"><Moment format="MMMM Do YYYY">{task.approved_date}</Moment></p>
                    </Column>
                </Row></>}
                <br />
                {activeTab !== 'task_due_dates' && <Row>
                    <Column cols={3}>
                        <button className={`btn-tab ${activeTab === 'task_activity' && 'active'}`} onClick={() => setActiveTab("task_activity")}>Task Activity</button>
                    </Column>
                    <Column cols={3}>
                        <button className={`btn-tab ${activeTab === 'task_chat' && 'active'}`} onClick={() => setActiveTab("task_chat")}>Task Chat</button>
                    </Column>
                    <Column cols={3}>
                        <button className={`btn-tab ${activeTab === 'task_notes' && 'active'}`} onClick={() => setActiveTab("task_notes")}>Notes</button>
                    </Column>
                    <Column cols={3}>
                        <button className={`btn-tab ${activeTab === 'task_documents' && 'active'}`} onClick={() => setActiveTab("task_documents")}>Documents</button>
                    </Column>
                </Row>}
                <br />
                {activeTab === 'task_activity' && <TaskActivity taskId={taskId} ref={taskActivityRef} />}
                {activeTab === 'task_chat' && <TaskChat taskId={taskId} />}
                {activeTab === 'task_notes' && <TaskNotes task={task} setTask={setTask} />}
                {activeTab === 'task_documents' && <TaskDocuments taskId={taskId} />}
                {activeTab === 'task_due_dates' && <TaskDueDates refreshTasks={refreshTasks} getTask={getTask} setMainActiveTab={setActiveTab} task={task} taskId={taskId} />}
            </Card>}
        </Column>
    );
}

export default TaskViewer;