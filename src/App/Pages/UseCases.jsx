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

const UseCases = () => {

    const [useCases, setUseCases] = useState([]);

    const getUseCases = async () => setUseCases(await get('usecase/all'));

    const deleteUsecase = (usecaseId) => {
        axios.get(`${Helper.apiUrl}usecase/delete/${usecaseId}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            getUseCases();
        });
    }

    useEffect(() => {
        getUseCases();
    }, []);

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Use Cases"}>
                <Link to="/user/use-case/create" class="btn btn-sm btn-flex btn-primary fw-bold">
                    Create Use Case
                </Link>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        {useCases.length > 0 ? <table class="table align-middle table-row-dashed fs-7 gy-5">
                            <thead>
                                <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                    <th>Thumbnail</th>
                                    <th>Use Case</th>
                                    <th>Service</th>
                                    <th>Industry</th>
                                    <th>Stacks</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {useCases.map(usecase => {
                                    return (
                                        <tr key={usecase.id}>
                                            <td><img src={Helper.serverImage(usecase.thumbnail)} className="service-icon" /></td>
                                            <td><a href={usecase.project_link} target="_blank">{usecase.name}</a></td>
                                            <td>{ usecase.service }</td>
                                            <td>{ usecase.industry }</td>
                                            <td>{ usecase.stack }</td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <DropdownLink link={`/user/use-case/view/${usecase.id}/${Helper.replaceSpaces(usecase.name)}`} text={'View'} />
                                                    <DropdownLink link={`/user/use-case/edit/${usecase.id}/${Helper.replaceSpaces(usecase.name)}`} text={'Edit'} />
                                                    <DropdownLink text={'Delete'} isdanger={true} isbutton={true} onClick={() => deleteUsecase(usecase.id)} />
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

export default UseCases;