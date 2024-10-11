import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FullRow from "../../Components/FullRow";
import Card from "../../Components/Card";
import Row from "../../Components/Row";
import Column from "../../Components/Column";
import Achievements from "./Achievements";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import Helper from "../../Config/Helper";
import axios from "axios";
import KeyPoints from "./KeyPoints";
import LoomVideo from "../../Components/LoomVideo";

const UseCaseView = () => {

    const {id, name} = useParams();

    const [usecase, setUsecase] = useState({});

    const navigate = useNavigate();

    const getUsecase = () => {
        axios.get(`${Helper.apiUrl}usecase/single/${id}`, Helper.authHeaders).then(response => {
            setUsecase(response.data);
        });
    }

    const deleteUsecase = (usecaseId) => {
        axios.get(`${Helper.apiUrl}usecase/delete/${usecaseId}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            navigate("/user/use-cases");
        });
    }

    useEffect(() => {
        getUsecase();
    }, []);
    

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={id ? `Update Use Case` : "Create New Use Case"}>
                <Link to="/user/use-cases" className="btn btn-sm btn-flex btn-primary fw-bold">
                    All Use Cases
                </Link>
                <Link to={`/user/use-case/edit/${id}/${name}`} className="btn btn-sm btn-flex btn-default fw-bold ml-10">
                    <i className="fa-light fa-pen-to-square"></i> Edit Use Case
                </Link>
                <button onClick={() => deleteUsecase(id)} className="btn btn-sm btn-flex btn-outline-danger fw-bold ml-10">
                    <i className="fa-light fa-trash"></i> Delete Use Case
                </button>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        <Row>
                            <Column cols={6}>
                                <LoomVideo className="usecase-thumbnail" videoId={usecase.loom_video_link} />
                            </Column>
                            <Column cols={6}>
                                <img className="usecase-thumbnail" src={Helper.serverImage(usecase.thumbnail)} />
                                {/* <br />
                                <br />
                                <img className="usecase-thumbnail" src={Helper.serverImage(usecase.challenge_image)} />
                                <br />
                                <br />
                                <img className="usecase-thumbnail" src={Helper.serverImage(usecase.solution_image)} /> */}
                            </Column>
                        </Row>
                        <Row className="mt-10">
                            <Column cols={12}>
                                <h1>{usecase.name}</h1>
                                <p>{usecase.short_description}</p>
                                <br />
                                <p>{usecase.project_overview}</p>
                                <br />
                                <h2>Challenge</h2>
                                <p>{ usecase.challenge }</p>
                                <br />
                                <h2>Solution</h2>
                                <p>{ usecase.solution }</p>
                                <br />
                                <Achievements id={id} achievements={usecase.usecase_achievements} getUsecase={getUsecase} />
                                <br />
                                <KeyPoints id={id} keypoints={usecase.usecase_keypoints} getUsecase={getUsecase} />
                            </Column>
                        </Row>
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default UseCaseView;