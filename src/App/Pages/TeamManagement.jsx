import { useEffect, useState } from "react";
import Card from "../Components/Card";
import MainContent from "../Components/MainContent";
import Toolbar from "../Components/Toolbar";
import { Link } from "react-router-dom";
import axios from "axios";
import Helper from "../Config/Helper";
import Loader from "../Components/Loader";
import DataTable from "../Components/DataTable";

const TeamManagement = () => {

    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paginated, setPaginated] = useState([]);
    const [pageNo, setPageNo] = useState(0);

    const getTeam = () => {
        setLoading(true);
        axios.get(`${Helper.apiUrl}user/all`, Helper.authHeaders).then(response => {
            setMembers(response.data);
            setPaginated(Helper.paginate(response.data));
            setLoading(false);
        });
    }

    useEffect(() => {
        getTeam();
    }, []);


    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Team Management"}>
                <Link to="/user/team/add" className="btn btn-sm btn-flex btn-primary fw-bold">
                    Add Team Member
                </Link>
            </Toolbar>
            <MainContent>
                <div className="row">
                    <div className="col-md-12">
                        {loading ? <Loader /> : <Card>
                            <DataTable title="Team Cyberify" description="Manage your team" paginate={true} fields={['name', 'email', 'user_type']} data={members} setData={setPaginated} pageNo={pageNo} paginated={paginated} setPageNo={setPageNo}>
                                <table className="table align-middle table-row-dashed fs-6 gy-3">
                                    <thead>
                                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                            <th>Sr. #</th>
                                            <th className="min-w-125px">Name</th>
                                            <th className="min-w-125px">Email</th>
                                            <th className="min-w-125px">Type</th>
                                            <th className="min-w-125px">Last Login</th>
                                            <th className="min-w-125px">Joined Date</th>
                                            <th className="text-end min-w-100px">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginated.length > 0 && paginated[pageNo].map((member, index) => {
                                            return (
                                                <tr key={member.id}>
                                                    <td>{(pageNo * 10) + (index + 1)}</td>
                                                    <td>{member.name}</td> 
                                                    <td>{member.email}</td>
                                                    <td>{Helper.convertOption(member.user_type)}</td>
                                                    <td>{member.last_login ? member.last_login : 'Not Logged'}</td>
                                                    <td>{member.joined_date}</td>
                                                    <td className="text-end">
                                                        <Link to={`/user/team/edit/${member.id}`} className="btn btn-primary btn-sm">Edit</Link>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </DataTable>
                        </Card>}
                    </div>
                </div>
            </MainContent>
        </div>
    );
}

export default TeamManagement;