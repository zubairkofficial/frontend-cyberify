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

const Service = () => {
    const defaultService = {
        name: "",
        description: "",
        detailed_description: "",
        image: null,
        image2: null,
    }

    const {id} = useParams();
    const [images, setImages] = useState({
        image: "",
        image2: "",
    });
    const [service, setService] = useState(defaultService);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const saveService = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}service/save`, axios.toFormData(service), Helper.authFileHeaders).then(response => {
            Helper.toast("success", response.data.message);
            navigate(`/user/service/view/${response.data.service.id}/${Helper.replaceSpaces(response.data.service.name)}`);
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        })
    }

    const getService = () => {
        if(id){
            axios.get(`${Helper.apiUrl}service/single/${id}`, Helper.authHeaders).then(response => {
                setService(response.data);
                setImages({image: response.data.image, image2: response.data.image2});
            });
        }
    }

    useEffect(() => {
        getService();
    }, []);

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={id ? `Update Service` : "Create New Service"}>
                <Link to="/user/services" className="btn btn-sm btn-flex btn-primary fw-bold">
                    All Services
                </Link>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        <Row>
                            <Column cols={9}>
                                <TextInput error={errors.name ? errors.name[0] : ''} value={service.name} onChange={e => setService({...service, name: e.target.value, service_slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} label="Service Name" />
                                <TextInput error={errors.description ? errors.description[0] : ''} value={service.description} onChange={e => setService({...service, description: e.target.value  })} label="Short Tagline / Description" />
                                <TextInput error={errors.detailed_description ? errors.detailed_description[0] : ''} value={service.detailed_description} onChange={e => setService({...service, detailed_description: e.target.value})} label="Detailed Description" isTextArea={true} />
                                <Column className={'simple-flex'} cols={12}>
                                    <button className="btn btn-primary btn-loading" onClick={saveService} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Service"}</button>
                                    <Link to={'/user/services'} className="btn btn-outline-danger">Cancel</Link>
                                </Column>
                            </Column>
                            <Column cols={3}>
                                <Card>
                                    <ImageInput value={images.image} error={errors.image ? errors.image[0] : ''} label="Upload Icon" id={'service-icon'} onChange={file => setService({...service, image: file})} />
                                    <br />
                                    <ImageInput value={images.image2} error={errors.image2 ? errors.image2[0] : ''} label="Featured Image" id={'featured-image'} onChange={file => setService({...service, image2: file})} />
                                </Card>
                            </Column>
                        </Row>
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default Service;