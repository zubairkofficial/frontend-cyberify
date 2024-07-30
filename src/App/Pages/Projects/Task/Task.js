import axios from "axios";
import Helper from "../../../Config/Helper";

class TaskClass{
    static createActivity(task_id, activity){
        if(activity){
            let data = { task_id, activity };
            axios.post(`${Helper.apiUrl}task/activity`, data, Helper.authHeaders).then(response => {
                console.log("TASK ACTIVITY", response.data.activity);
            }).catch(error => {
                console.log("TASK ACTIVITY ERROR", error);
            });
        }
    }
}

export default TaskClass;