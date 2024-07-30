import Helper from "../Config/Helper";

const NothingFound = ({ width = '80%' }) => {
    return (
        <div className="text-center">
            <img style={{width: width, height: 'auto'}} src={Helper.staticImage("assets/nothing.png")} />
            <h1>Nothing Found</h1>
        </div>
    );
}

export default NothingFound;