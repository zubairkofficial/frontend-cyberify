import Column from "./Column";
import FullRow from "./FullRow";
import Row from "./Row";

const ProjectProgress = ({tasks = []}) => {
    const total_tasks = tasks.length;
    let completed = 0;
    tasks.forEach(task => {
        if(task.status === 'approved'){
            completed++;
        }
    });
    let percentage = (completed / total_tasks) * 100;

    return (
        <FullRow>
            <br/>
            <Row>
                <Column cols={6}>Tasks {completed} / {total_tasks}</Column>
                <Column cols={6} className="text-end">{percentage ? percentage : 0}%</Column>
            </Row>
            <div className="total-progress"><div className="done" style={{width: `${percentage ? percentage : 0}%`}}></div></div>
        </FullRow>
    )
}

export default ProjectProgress;