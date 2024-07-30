import FullRow from "../../../Components/FullRow";
import TextInput from "../../../Components/TextInput";

const TaskNotes = ({ task, setTask }) => {
    return (
        <FullRow>
            <TextInput isTextArea={true} rows={10} label="Task Notes" value={task.notes} onChange={e => setTask({...task, notes: e.target.value})} placeholder="Take your notes here..." required={false} />
        </FullRow>
    );
}

export default TaskNotes;