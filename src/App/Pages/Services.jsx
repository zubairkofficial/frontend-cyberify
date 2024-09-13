import { Link } from "react-router-dom";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import { useEffect, useState } from "react";
import { get } from "../Config/customs";
import FullRow from "../Components/FullRow";
import Card from "../Components/Card";
import NothingFound from "../Components/NothingFound";
import Helper from "../Config/Helper";
import Dropdown from "../Components/Dropdown";
import DropdownLink from "../Components/DrowdownLink";
import axios from "axios";

const Services = () => {

    const [services, setServices] = useState([]);

    const getServices = async () => {
        setServices(await get('service/all'));
    }

    const deleteService = (serviceId) => {
        axios.get(`${Helper.apiUrl}service/delete/${serviceId}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            getServices();
        });
    }

    useEffect(() => {
        getServices();
    }, []);

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Services"}>
                <Link to="/user/service/create" class="btn btn-sm btn-flex btn-primary fw-bold">
                    Create Service
                </Link>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        {services.length > 0 ? <table class="table align-middle table-row-dashed fs-7 gy-5">
                            <thead>
                                <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                    <th>Icon</th>
                                    <th>Service Name</th>
                                    <th>Image</th>
                                    <th>Short Description</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map(service => {
                                    return(
                                        <tr key={service.id}>
                                            <td>
                                                <img className="service-icon" src={ Helper.serverImage(service.image) } />
                                            </td>
                                            <td>{ service.name }</td>
                                            <td><img className="service-icon" src={ Helper.serverImage(service.image2) } /></td>
                                            <td>{ service.description }</td>
                                            <td class="text-end">
                                                <Dropdown>
                                                    <DropdownLink link={`/user/service/view/${service.id}/${Helper.replaceSpaces(service.name)}`} text={'View'} />
                                                    <DropdownLink text={'Edit'} link={`/user/service/edit/${service.id}/${Helper.replaceSpaces(service.name)}`} />
                                                    <DropdownLink text={'Delete'} isdanger={true} onClick={() => deleteService(service.id)} isbutton={true} />
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ) 
                                })}
                            </tbody>
                        </table> : <NothingFound width="20%" />}
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default Services;