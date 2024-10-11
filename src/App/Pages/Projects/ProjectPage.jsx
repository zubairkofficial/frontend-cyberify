import { Link, useParams } from "react-router-dom";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import axios from "axios";
import Helper from "../../Config/Helper";
import { useEffect, useState } from "react";
import Column from "../../Components/Column";
import Row from "../../Components/Row";
import Card from "../../Components/Card";
import FullRow from "../../Components/FullRow";
import TextInput from "../../Components/TextInput";
import TaskEditor from "./TaskEditor";
import Allowed from "../../Components/Allowed";
import Moment from "react-moment";
import TaskViewer from "./TaskViewer";
import FeatherIcon from "feather-icons-react";

const ProjectPage = () => {

    const { project_id, project_name } = useParams();

    const [project, setProject] = useState({});
    const [pageLoading, setPageLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [viewTask, setViewTask] = useState(null);
    const [subTaskViewer, setSubTaskViewer] = useState(null);
    const [showTab, setShowTab] = useState("");

    const getProject = () => {
        setPageLoading(true);
        axios.get(`${Helper.apiUrl}project/single/${project_id}`, Helper.authHeaders).then(response => {
            setProject(response.data);
            getProjectTasks();
            setPageLoading(false);
        });
    }

    const getProjectTasks = () => {
        axios.get(`${Helper.apiUrl}task/all/project/${project_id}`, Helper.authHeaders).then(response => {
            setTasks(response.data);
        });
    }

    const handleViewTask = task => {
        setShowTab("view_task");
        if(task.parent_task){
            setSubTaskViewer(task.parent_task);
        }else{
            setSubTaskViewer(task.id);
        }
        setViewTask(task.id);
    }

    useEffect(() => {
        getProject();
    }, []);

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={pageLoading ? "Project Name" : project.name}>
                <Link to="/user/projects" className="btn btn-sm btn-flex btn-primary fw-bold">
                    All Projects
                </Link>
            </Toolbar>
            <MainContent>
                <Row>
                    <Column cols={8}>
                        <Card>
                            <table className="table align-middle table-row-dashed fs-7 gy-5">
                                <thead>
                                    <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                        <th className="w-50">Name</th>
                                        <th>Assignee</th>
                                        <th>Due Date</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                        <th className="text-end"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map(task => {
                                        return (
                                            <>
                                                <tr className="pointer" onClick={() => handleViewTask(task)}>
                                                    <td>{ task.task } 
                                                        <Allowed roles={['admin', 'project_manager']}>
                                                            <button className="btn btn-add-task btn-sm ml20 fs10" onClick={(e) => {
                                                                e.stopPropagation();
                                                                setShowTab("add_sub_task");
                                                                setViewTask(task.id);
                                                            }}>Add Sub Task</button>
                                                        </Allowed>
                                                    </td>
                                                    <td>{ task.assignee.name }</td>
                                                    <td><Moment format="MMMM Do YYYY">{task.due_date}</Moment></td>
                                                    <td><span className="badge" style={{backgroundColor: Helper.getPriorityColor(task.priority), color: 'white'}}>{ Helper.convertOption(task.priority) }</span></td>
                                                    <td><span className="badge" style={{backgroundColor: Helper.getStatusColor(task.status), color: 'white'}}>{ Helper.convertOption(task.status) }</span></td>
                                                </tr>
                                                {subTaskViewer === task.id && (task.subtasks.length > 0 ? task.subtasks.map(subtask => {
                                                    return (
                                                        <tr className="pointer" onClick={() => handleViewTask(subtask)}>
                                                            <td><FeatherIcon size={15} icon="corner-down-right" /> <span className="pl20">{ subtask.task }</span></td>
                                                            <td>{ subtask.assignee.name }</td>
                                                            <td><Moment format="MMMM Do YYYY">{subtask.due_date}</Moment></td>
                                                            <td><span className="badge" style={{backgroundColor: Helper.getPriorityColor(subtask.priority), color: 'white'}}>{ Helper.convertOption(subtask.priority) }</span></td>
                                                            <td><span className="badge" style={{backgroundColor: Helper.getStatusColor(subtask.status), color: 'white'}}>{ Helper.convertOption(subtask.status) }</span></td>
                                                        </tr>
                                                    );
                                                }): <tr><td><FeatherIcon size={15} icon="corner-down-right" /> <span className="pl20">No subtasks for '{ task.task }'</span></td></tr>)}
                                            </>
                                        )
                                    })}
                                    <Allowed roles={['admin', 'project_manager']}>
                                        <tr>
                                            <td colSpan={5}><button className="btn btn-add-task btn-sm" onClick={() => {
                                                setShowTab("add_task");
                                                setViewTask(null);
                                            }}>Add Task</button></td>
                                        </tr>
                                    </Allowed>
                                </tbody>
                            </table>
                        </Card>
                    </Column>
                    <Allowed all={true}>
                        {showTab === "add_task" && <TaskEditor projectId={project_id} refreshTasks={getProjectTasks} />}
                    </Allowed>
                    <Allowed all={true}>
                        {showTab === "add_sub_task" && <TaskEditor projectId={project_id} taskId={viewTask} refreshTasks={getProjectTasks} />}
                    </Allowed>
                    <Allowed all={true}>
                        {showTab === "view_task" && <TaskViewer taskId={viewTask} refreshTasks={getProjectTasks} />}
                    </Allowed>
                </Row>
            </MainContent>
        </div>
    );
}

export default ProjectPage;