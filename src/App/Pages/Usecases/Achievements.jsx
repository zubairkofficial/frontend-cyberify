import { useState } from "react";
import Column from "../../Components/Column";
import FullRow from "../../Components/FullRow";
import Row from "../../Components/Row";
import TextInput from "../../Components/TextInput";
import Helper from "../../Config/Helper";
import Card from "../../Components/Card";
import axios from "axios";

const Achievements = ({ id, achievements = [], getUsecase }) => {

    const defaultAchievement = {
        name: "",
        description: "",
        use_case_id: id,
    }

    const [achievement, setAchievement] = useState(defaultAchievement);
    const [showAchievementForm, setShowAchievementForm] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const saveAchievement = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}usecase/achievement/save`, achievement, Helper.authHeaders).then(response => {
            getUsecase();
            Helper.toast("success", response.data.message);
            setShowAchievementForm(false);
            setAchievement(defaultAchievement);
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        })
    }

    const deleteAchievement = (id) => {
        axios.get(`${Helper.apiUrl}usecase/achievement/delete/${id}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            setAchievement(defaultAchievement);
            getUsecase();
        });
    }

    return (
        <FullRow className='mt-10'>
            <Row>
                <Column cols={6}>
                    <h2>Achievements</h2>
                </Column>
                <Column className="text-end" cols={6}>
                    <button className="btn btn-sm btn-primary" onClick={() => setShowAchievementForm(true)}>Create Achievement</button>
                </Column>
            </Row>
            {showAchievementForm && <Card className="mt-5">
                <TextInput value={achievement.name} error={errors.name ? errors.name[0] : ''} label="Name" onChange={e => setAchievement({...achievement, name: e.target.value})} />
                <TextInput value={achievement.description} error={errors.description ? errors.description[0] : ''} label="Description" isTextArea={true} onChange={e => setAchievement({...achievement, description: e.target.value})} />
                <button className="btn btn-sm btn-primary" disabled={loading} onClick={saveAchievement}>{loading ? 'Please wait...' : 'Save Achievement'}</button>
                <button className="btn btn-sm btn-outline-danger ml5" onClick={() => {setAchievement(defaultAchievement);setShowAchievementForm(false)}}>Cancel</button>
            </Card>}
            {!showAchievementForm && <Card className='mt-5'>
                <table className="table align-middle table-row-dashed fs-7 gy-5">
                    {achievements && achievements.map(achievement => {
                        return (<tr key={achievement.id}>
                            <td>{achievement.name}</td>
                            <td className="w-50">{achievement.description}</td>
                            <td className="text-end">
                                <button className="btn btn-sm btn-default" onClick={() => {setAchievement(achievement);setShowAchievementForm(true);}}>Edit</button>
                                <button className="btn btn-sm btn-outline-danger ml5" onClick={() => deleteAchievement(achievement.id)}>Delete</button>
                            </td>
                        </tr>)
                    })}
                </table>
            </Card>}
        </FullRow>
    )
}

export default Achievements;