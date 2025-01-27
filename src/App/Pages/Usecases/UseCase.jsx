import { Link, useNavigate, useParams } from "react-router-dom";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import FullRow from "../../Components/FullRow";
import Card from "../../Components/Card";
import TextInput from "../../Components/TextInput";
import { useEffect, useState } from "react";
import Row from "../../Components/Row";
import Column from "../../Components/Column";
import Helper from "../../Config/Helper";
import ImageInput from "../../Components/ImageInput";
import axios from "axios";
import Spinner from "../../Components/Spinner";

const UseCase = () => {
    const defaultUsecase = {
        name: "",
        slug: "",
        short_description: "",
        project_overview: "",
        about_the_client: "",
        challenge: "",
        solution: "",
        result: "",
        loom_video_link: "",
        project_link: "",
        client_name: "",
        service: "",
        industry: "",
        stack: "",
        thumbnail: null,
        challenge_image: null,
        solution_image: null,
    }

    const {id} = useParams();
    const [thumbnail, setThumbnail] = useState("");
    const [challengeImage, setChallengeImage] = useState("");
    const [solutionImage, setSolutionImage] = useState("");
    const [usecase, setUsecase] = useState(defaultUsecase);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const saveUsecase = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}usecase/save`, axios.toFormData(usecase), Helper.authFileHeaders).then(response => {
            Helper.toast("success", response.data.message);
            navigate(`/user/use-case/view/${response.data.usecase.id}/${Helper.replaceSpaces(response.data.usecase.name)}`);
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        })
    }

    const getUsecase = () => {
        if(id){
            axios.get(`${Helper.apiUrl}usecase/single/${id}`, Helper.authHeaders).then(response => {
                setUsecase(response.data);
                setThumbnail(response.data.thumbnail);
                setChallengeImage(response.data.challenge_image);
                setSolutionImage(response.data.solution_image);
            });
        }
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
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        <Row>
                            <Column cols={9}>
                                <TextInput error={errors.name ? errors.name[0] : ''} value={usecase.name} onChange={e => setUsecase({...usecase, name: e.target.value ,  slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} label="Case Name" />
                                <TextInput error={errors.short_description ? errors.short_description[0] : ''} value={usecase.short_description} onChange={e => setUsecase({...usecase, short_description: e.target.value})} label="Short Description" />
                                <TextInput isTextArea={true} error={errors.project_overview ? errors.project_overview[0] : ''} value={usecase.project_overview} onChange={e => setUsecase({...usecase, project_overview: e.target.value})} label="Project Overview" />
                                <TextInput isTextArea={true} error={errors.about_the_client ? errors.about_the_client[0] : ''} value={usecase.about_the_client} onChange={e => setUsecase({...usecase, about_the_client: e.target.value})} label="About The Client" />
                                <TextInput  error={errors.challenge ? errors.challenge[0] : ''} value={usecase.challenge} onChange={e => setUsecase({...usecase, challenge: e.target.value})} label="Challenges" />
                                <TextInput  error={errors.solution ? errors.solution[0] : ''} value={usecase.solution} onChange={e => setUsecase({...usecase, solution: e.target.value})} label="Solutions" />
                                <TextInput  error={errors.result ? errors.result[0] : ''} value={usecase.result} onChange={e => setUsecase({...usecase, result: e.target.value})} label="Results" />
                                <Row>
                                    <Column cols={6}>
                                        <TextInput error={errors.loom_video_link ? errors.loom_video_link[0] : ''} value={usecase.loom_video_link} onChange={e => setUsecase({...usecase, loom_video_link: e.target.value})} label="Loom Video ID" />
                                    </Column>
                                    <Column cols={6}>
                                        <TextInput error={errors.project_link ? errors.project_link[0] : ''} value={usecase.project_link} onChange={e => setUsecase({...usecase, project_link: e.target.value})} label="Project Link" />
                                    </Column>
                                </Row>
                                <Row>
                                    <Column cols={6}>
                                        <TextInput error={errors.client_name ? errors.client_name[0] : ''} value={usecase.client_name} onChange={e => setUsecase({...usecase, client_name: e.target.value})} label="Client Name" />
                                    </Column>
                                    <Column cols={6}>
                                        <TextInput error={errors.service ? errors.service[0] : ''} value={usecase.service} onChange={e => setUsecase({...usecase, service: e.target.value})} label="Service" />
                                    </Column>
                                </Row>
                                <Row>
                                    <Column cols={6}>
                                        <TextInput error={errors.industry ? errors.industry[0] : ''} value={usecase.industry} onChange={e => setUsecase({...usecase, industry: e.target.value})} label="Industry" hint="(Use comma (,) to separate keywords)" />
                                    </Column>
                                    <Column cols={6}>
                                        <TextInput error={errors.stack ? errors.stack[0] : ''} value={usecase.stack} onChange={e => setUsecase({...usecase, stack: e.target.value})} label="Tech Stack" hint="(Use comma (,) to separate keywords)" />
                                    </Column>
                                </Row>
                                <Column className={'simple-flex'} cols={12}>
                                    <button className="btn btn-primary btn-loading" onClick={saveUsecase} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Use Case"}</button>
                                    <Link to={'/user/use-cases'} className="btn btn-outline-danger">Cancel</Link>
                                </Column>
                            </Column>
                            <Column cols={3}>
                                <Card>
                                    <ImageInput value={thumbnail} error={errors.thumbnail ? errors.thumbnail[0] : ''} label="Upload Thumbnail" id={'useacse-thumbnail'} onChange={file => setUsecase({...usecase, thumbnail: file})} />
                                    <ImageInput value={challengeImage} error={errors.challenge_image ? errors.challenge_image[0] : ''} label="Upload Overview Image" id={'useacse-challenge'} onChange={file => setUsecase({...usecase, challenge_image: file})} />
                                    <ImageInput value={solutionImage} error={errors.solution_image ? errors.solution_image[0] : ''} label="Upload Benefits Image" id={'useacse-solution'} onChange={file => setUsecase({...usecase, solution_image: file})} />
                                </Card>
                            </Column>
                        </Row>
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default UseCase;