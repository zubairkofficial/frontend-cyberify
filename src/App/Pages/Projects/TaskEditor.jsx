import { useEffect, useState } from "react";
import Column from "../../Components/Column";
import Card from "../../Components/Card";
import FullRow from "../../Components/FullRow";
import TextInput from "../../Components/TextInput";
import axios from "axios";
import Helper from "../../Config/Helper";
import BasicSelect from "../../Components/BasicSelect";
import Spinner from "../../Components/Spinner";
import Row from "../../Components/Row";
import SearchSelect from "../../Components/SearchSelect";
import TaskClass from "./Task/Task";

const TaskEditor = ({ projectId, taskId = 0, refreshTasks }) => {

    const defaultTask = {
        project_id: projectId,
        task: "",
        description: "",
        status: "",
        assigned_to: "",
        started_date: "",
        approved_date: "",
        completed_date: "",
        due_date: "",
        priority: "medium",
        is_subtask: taskId ? 1 : 0,
        parent_task: taskId,
        notes: "",
    }

    const [taskStatuses, setTaskStatuses] = useState([]);
    const [taskPriorities, setTaskPriorities] = useState([]);
    const [team, setTeam] = useState([]);
    const [errors, setErrors] = useState({});
    const [task, setTask] = useState(defaultTask);
    const [parentTask, setParentTask] = useState({});
    const [assignee, setAssignee] = useState({});
    const [loading, setLoading] = useState(false);

    const getTaskStatuses = () => {
        axios.get(`${Helper.apiUrl}common/types/status/tasks`, Helper.authHeaders).then(response => {
            setTaskStatuses(response.data);
        });
    }

    const getParentTask = () => {
        if(taskId){
            axios.get(`${Helper.apiUrl}task/single/${taskId}`, Helper.authHeaders).then(response => {
                setParentTask(response.data);
            });
        }
    }

    const getTaskPriorities = () => {
        axios.get(`${Helper.apiUrl}common/types/priority/tasks`, Helper.authHeaders).then(response => {
            setTaskPriorities(response.data);
        });
    }

    const getTeam = () => {
        axios.get(`${Helper.apiUrl}user/all`, Helper.authHeaders).then(response => {
            setTeam(Helper.makeOptions(response.data, true, 'name', 'id'));
        });
    }

    const handleAssignee = (selectedOption) => {
        setAssignee(selectedOption);
        setTask({...task, assigned_to: selectedOption.value});
    }

    const saveTask = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}task/save`, task, Helper.authHeaders).then(response => {
            setTask(defaultTask);
            Helper.toast("success", response.data.message);
            refreshTasks();
            let task = response.data.task;
            if(task.is_subtask == 1){
                TaskClass.createActivity(task.id, `A subtask '${task.task}' for '${task.parent_task.task}' is assigned to ${task.assignee.name}`);
            }else{
                TaskClass.createActivity(task.id, `'${task.task}' assigned to ${task.assignee.name}`);
            }
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        getParentTask();
        getTaskStatuses();
        getTaskPriorities();
        getTeam();
    }, []);

    return (
        <Column cols={4}>
            <Card>
                <FullRow>
                    <h3>{taskId ? `Subtask for '${parentTask.task}'` : "Add New Task"}</h3>
                </FullRow>
                <br/>
                <FullRow>
                    <TextInput error={errors.task ? errors.task[0] : ''} label={"Task"} required={true} value={task.task} onChange={e => setTask({...task, task: e.target.value})} />
                    <TextInput isTextArea={true} label={"Description"} rows={3} required={false} value={task.description} onChange={e => setTask({...task, description: e.target.value})} />
                    <SearchSelect error={errors.assigned_to ? errors.assigned_to[0] : ''} placeholder="Choose Assignee" required={true} label="Assignee" value={assignee} options={team} onChange={handleAssignee} />
                    <Row>
                        <Column cols={6}>
                            <TextInput type="date" error={errors.started_date ? errors.started_date[0] : ''} label={"Start Date"} required={true} value={task.started_date} onChange={e => setTask({...task, started_date: e.target.value})} />
                        </Column>
                        <Column cols={6}>
                            <TextInput type="date" error={errors.due_date ? errors.due_date[0] : ''} label={"Due Date"} required={true} value={task.due_date} onChange={e => setTask({...task, due_date: e.target.value})} />
                        </Column>
                    </Row>
                    <Row>
                        <Column cols={6}>
                            <BasicSelect error={errors.status ? errors.status[0] : ''} options={taskStatuses} required={true} label="Task Status" value={task.status} onChange={e => setTask({...task, status: e.target.value})} />
                        </Column>
                        <Column cols={6}>
                            <BasicSelect error={errors.priority ? errors.priority[0] : ''} options={taskPriorities} required={true} label="Priority" value={task.priority} onChange={e => setTask({...task, priority: e.target.value})} />
                        </Column>
                    </Row>
                </FullRow>
                <Row>
                    <Column className={'simple-flex'} cols={12}>
                        <button className="btn btn-sm btn-primary btn-loading" onClick={saveTask} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Task"}</button>
                        <button className="btn btn-sm btn-outline-danger">Cancel</button>
                    </Column>
                </Row>
            </Card>
        </Column>
    );
}

export default TaskEditor;