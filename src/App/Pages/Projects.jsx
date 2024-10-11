import { Link } from "react-router-dom";
import Column from "../Components/Column";
import Row from "../Components/Row";
import Toolbar from "../Components/Toolbar";
import NothingFound from "../Components/NothingFound";
import MainContent from "../Components/MainContent";
import { useEffect, useState } from "react";
import axios from "axios";
import Helper from "../Config/Helper";
import Moment from "react-moment";
import FullRow from "../Components/FullRow";
import ProjectProgress from "../Components/ProjectProgress";
import Allowed from "../Components/Allowed";

const Projects = () => {

    const [projects, setProjects] = useState([]);

    const getProjects = () => {
        axios.get(`${Helper.apiUrl}project/all`, Helper.authHeaders).then(response => {
            setProjects(response.data);
        })
    }

    useEffect(() => {
        getProjects();
    }, []);

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Projects"}>
                <Allowed roles={['admin']}>
                    <Link to="/user/projects/create" className="btn btn-sm btn-flex btn-primary fw-bold">
                        Create Project
                    </Link>
                </Allowed>
            </Toolbar>
            <MainContent>
                <Row>
                    {projects.length > 0 ? projects.map(project => {
                        return (
                            <Column key={project.id} cols={4}>
                                <Link to={`/user/project/${project.id}/${Helper.replaceSpaces(project.name)}`} className="card border-hover-primary ">
                                    <div className="card-header border-0 pt-9">
                                        <div className="card-title m-0">
                                            <div className="fs-3 fw-bold text-gray-900">{ project.name }</div>
                                        </div>
                                        <div className="card-toolbar">
                                            <span className="badge badge-light-primary fw-bold me-auto px-4 py-3">{Helper.convertOption(project.status)}</span>
                                        </div>
                                    </div>
                                    <div className="card-body p-9">
                                        <p className="text-gray-500 fw-semibold fs-5 mt-1 mb-2">{ project.description }</p>
                                        <p className="mb-5">Project Manager <strong>{project.project_manager.name}</strong></p>
                                        <Row>
                                            <Column cols={6}><strong>Started</strong> <Moment format="MMMM Do YYYY">{project.started_date}</Moment></Column>
                                            <Column cols={6}><strong>Due Date</strong> <Moment format="MMMM Do YYYY">{project.expected_end_date}</Moment></Column>
                                        </Row>
                                        <ProjectProgress tasks={project.major_tasks} />
                                    </div>
                                </Link>
                            </Column>
                        );
                    }) : <NothingFound width="20%" /> }
                </Row>
            </MainContent>
        </div>
    );
}

export default Projects;