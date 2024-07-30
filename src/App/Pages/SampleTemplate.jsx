import { Link } from "react-router-dom";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";

const BidResponse = () => {
    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={user_id ? `Update ${ member.name }` : "Add Team Member"}>
                <Link to="/user/team" class="btn btn-sm btn-flex btn-primary fw-bold">
                    All Team Members
                </Link>
            </Toolbar>
            <MainContent>

            </MainContent>
        </div>
    );
}

export default BidResponse;