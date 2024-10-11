import { useState } from "react";
import Column from "../../Components/Column";
import FullRow from "../../Components/FullRow";
import Row from "../../Components/Row";
import TextInput from "../../Components/TextInput";
import Helper from "../../Config/Helper";
import Card from "../../Components/Card";
import axios from "axios";

const KeyPoints = ({ id, keypoints = [], getUsecase }) => {

    const defaultKeypoint = {
        point: "",
        use_case_id: id,
    }

    const [keypoint, setKeypoint] = useState(defaultKeypoint);
    const [showKeypointForm, setShowKeypointForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const saveKeypoint = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}usecase/keypoint/save`, keypoint, Helper.authHeaders).then(response => {
            getUsecase();
            Helper.toast("success", response.data.message);
            setShowKeypointForm(false);
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        })
    }

    const deleteKeypoint = (id) => {
        axios.get(`${Helper.apiUrl}usecase/keypoint/delete/${id}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            setKeypoint(defaultKeypoint);
            getUsecase();
        });
    }

    return (
        <FullRow className='mt-10'>
            <Row>
                <Column cols={6}>
                    <h2>Key Points</h2>
                </Column>
                <Column className="text-end" cols={6}>
                    <button className="btn btn-sm btn-primary" onClick={() => setShowKeypointForm(true)}>Create Key Point</button>
                </Column>
            </Row>
            {showKeypointForm && <Card className="mt-5">
                <TextInput value={keypoint.point} error={errors.point ? errors.point[0] : ''} label="Write Key Point" onChange={e => setKeypoint({...keypoint, point: e.target.value})} />
                <button className="btn btn-sm btn-primary" disabled={loading} onClick={saveKeypoint}>{loading ? 'Please wait...' : 'Save Key Point'}</button>
                <button className="btn btn-sm btn-outline-danger ml5" onClick={() => {setKeypoint(defaultKeypoint);setShowKeypointForm(false)}}>Cancel</button>
            </Card>}
            {!showKeypointForm && <Card className='mt-5'>
                <table className="table align-middle table-row-dashed fs-7 gy-5">
                    {keypoints && keypoints.map(keypoint => {
                        return (<tr key={keypoint.id}>
                            <td>{keypoint.point}</td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-default" onClick={() => {setKeypoint(keypoint);setShowKeypointForm(true);}}>Edit</button>
                                <button className="btn btn-sm btn-outline-danger ml5" onClick={() => deleteKeypoint(keypoint.id)}>Delete</button>
                            </td>
                        </tr>)
                    })}
                </table>
            </Card>}
        </FullRow>
    )
}

export default KeyPoints;