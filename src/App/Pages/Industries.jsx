import { Link } from "react-router-dom";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import { useEffect, useState } from "react";
import axios from "axios";
import FullRow from "../Components/FullRow";
import Card from "../Components/Card";
import NothingFound from "../Components/NothingFound";
import Helper from "../Config/Helper";
import Moment from "react-moment";
import Dropdown from "../Components/Dropdown";
import DropdownLink from "../Components/DrowdownLink";

const Industries = () => {
    const [industries, setIndustries] = useState([]);

    // Fetch industries using axios
    const getIndustries = async () => {
        try {
            const response = await axios.get(`${Helper.apiUrl}industry/all`, Helper.authHeaders);
            setIndustries(response.data.industries); // Set the industries data in state
            console.log(response.data)
        } catch (error) {
            console.error("Error fetching industries:", error);
        }
    };

    const deleteIndustry = (id) => {
        axios.get(`${Helper.apiUrl}industry/delete/${id}`, Helper.authHeaders)
            .then(response => {
                // Refresh the industries list after deletion
                getIndustries();
            })
            .catch(error => {
                console.error("Error deleting industry:", error);
            });
    };

    useEffect(() => {
        // Fetch industries when the component mounts
        getIndustries();
    }, []); // Empty dependency array to fetch once when the component loads

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"All Industries"}>
                <Link to="/user/create-industry" className="btn btn-sm btn-flex btn-primary fw-bold">
                    Create Industry
                </Link>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        {industries.length > 0 ? (
                            <table className="table align-middle table-row-dashed fs-7 gy-5">
                                <thead>
                                    <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Slug</th>
                                        <th>Created At</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {industries.map(industry => (
                                        <tr key={industry.id}>
                                            <td>
                                                <img className="service-icon" src={Helper.serverImage(industry.featured_image)} alt="industry" />
                                            </td>
                                            <td>{industry.industry_name}</td>
                                            <td>{industry.industry_slug}</td>
                                            <td><Moment format="MMMM Do YYYY">{industry.created_at}</Moment></td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <DropdownLink link={`/user/industry/view/${industry.id}`} text={'View Industry'} />
                                                    <DropdownLink link={`/user/industry/edit/${industry.id}`} text={'Edit Industry'} />
                                                    <DropdownLink isbutton={true} onClick={() => deleteIndustry(industry.id)} text={'Delete Industry'} isdanger={true} />
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <NothingFound width="20%" />
                        )}
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default Industries;
