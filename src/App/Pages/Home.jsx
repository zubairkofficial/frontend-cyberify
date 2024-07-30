import MainContent from "../Components/MainContent";
import Row from "../Components/Row";
import Toolbar from "../Components/Toolbar";

const Home = () => {

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Dashboard"}>
                {/* <Link to="/user/projects/create" class="btn btn-sm btn-flex btn-primary fw-bold">
                    Create Project
                </Link> */}
            </Toolbar>
            <MainContent>
                <Row>
                    
                </Row>
            </MainContent>
        </div>
    );
}

export default Home;