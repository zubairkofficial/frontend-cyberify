import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { get } from "../../Config/customs";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import FullRow from "../../Components/FullRow";
import Card from "../../Components/Card";
import Row from "../../Components/Row";
import Column from "../../Components/Column";
import Helper from "../../Config/Helper";
import TextInput from "../../Components/TextInput";
import axios from "axios";

const ServiceView = () => {
    const {id, name} = useParams();
    const defaultFeature = {
        name: "",
        description: "",
        service_id: id,
    }

    const [service, setService] = useState({});
    const [feature, setFeature] = useState(defaultFeature);
    const [showFeatureForm, setShowFeatureForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const getService = async () => {
        setService(await get(`service/single/${id}`));
    }

    const saveFeature = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}service/feature/save`, feature, Helper.authHeaders).then(response => {
            getService();
            Helper.toast("success", response.data.message);
            setShowFeatureForm(false);
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        })
    }

    const deleteFeature = (id) => {
        axios.get(`${Helper.apiUrl}service/feature/delete/${id}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            setFeature(defaultFeature);
            getService();
        });
    }

    const deleteService = (serviceId) => {
        axios.get(`${Helper.apiUrl}service/delete/${serviceId}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            navigate("/user/services");
        });
    }

    useEffect(() => {
        getService();
    }, []);

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={service.name}>
                <Link to="/user/services" class="btn btn-sm btn-flex btn-primary fw-bold">
                    All Services
                </Link>
                <Link to={`/user/service/edit/${id}/${name}`} class="btn btn-sm btn-flex btn-default fw-bold ml-10">
                    <i className="fa-light fa-pen-to-square"></i> Edit Service
                </Link>
                <button onClick={() => deleteService(id)} class="btn btn-sm btn-flex btn-outline-danger fw-bold ml-10">
                    <i className="fa-light fa-trash"></i> Delete Service
                </button>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        <Row>
                            <Column cols={9}>
                                <h1>{service.name}</h1>
                                <p>{service.description}</p>
                                <br />
                                <p>{service.detailed_description}</p>
                                <br />
                                <FullRow className='mt-10'>
                                    <Row>
                                        <Column cols={6}>
                                            <h2>Features</h2>
                                        </Column>
                                        <Column className="text-end" cols={6}>
                                            <button className="btn btn-sm btn-primary" onClick={() => setShowFeatureForm(true)}>Add Feature</button>
                                        </Column>
                                    </Row>
                                    {showFeatureForm && <Card className="mt-5">
                                        <TextInput value={feature.name} error={errors.name ? errors.name[0] : ''} label="Name" onChange={e => setFeature({...feature, name: e.target.value})} />
                                        <TextInput value={feature.description} error={errors.description ? errors.description[0] : ''} label="Description" isTextArea={true} onChange={e => setFeature({...feature, description: e.target.value})} />
                                        <button className="btn btn-sm btn-primary" disabled={loading} onClick={saveFeature}>{loading ? 'Please wait...' : 'Save Feature'}</button>
                                        <button className="btn btn-sm btn-outline-danger ml5" onClick={() => {setFeature(defaultFeature);setShowFeatureForm(false)}}>Cancel</button>
                                    </Card>}
                                    {!showFeatureForm && <Card className='mt-5'>
                                        <table class="table align-middle table-row-dashed fs-7 gy-5">
                                            {service.service_points && service.service_points.map(single_point => {
                                                return (<tr key={single_point.id}>
                                                    <td>{single_point.name}</td>
                                                    <td className="w-50">{single_point.description}</td>
                                                    <td className="text-end">
                                                        <button className="btn btn-sm btn-default" onClick={() => {setFeature(single_point);setShowFeatureForm(true);}}>Edit</button>
                                                        <button className="btn btn-sm btn-outline-danger ml5" onClick={() => deleteFeature(single_point.id)}>Delete</button>
                                                    </td>
                                                </tr>)
                                            })}
                                        </table>
                                    </Card>}
                                </FullRow>
                            </Column>
                            <Column cols={3}>
                                <Row>
                                    <Card>
                                        <Column className="text-center" cols={12}>
                                            <h3>Icon</h3>
                                            <img className="service-image" src={Helper.serverImage(service.image)} />
                                        </Column>
                                    </Card>
                                </Row>
                                <Row className="mt-10">
                                    <Card>
                                        <Column className="text-center" cols={12}>
                                            <h3>Featured Image</h3>
                                            <img className="service-image" src={Helper.serverImage(service.image2)} />
                                        </Column>
                                    </Card>
                                </Row>
                            </Column>
                        </Row>
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default ServiceView;