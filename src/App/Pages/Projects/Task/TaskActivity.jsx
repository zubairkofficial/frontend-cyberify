import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import FixContainer from "../../../Components/FixContainer";
import FullRow from "../../../Components/FullRow";
import Helper from "../../../Config/Helper";
import axios from "axios";
import Message from "../../../Components/Message";

const TaskActivity = forwardRef(({ taskId }, ref) => {
    const [activities, setActivities] = useState([]);
    const messagesEndRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getActivities
    }));

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const getActivities = () => {
        axios.get(`${Helper.apiUrl}task/activity/${taskId}`, Helper.authHeaders).then(response => {
            setActivities(response.data);
            setTimeout(() => {
                scrollToBottom();
                console.log("Scrolled", response.data, activities);
            }, 100);
        });
    }

    useEffect(() => {
        getActivities();
    }, []);

    return (
        <FullRow>
            <FixContainer height={'42vh'}>
                {activities.map(activity => {
                    return <Message message={activity} messageKey="activity" key={activity.id} />
                })}
                <div ref={messagesEndRef} />
            </FixContainer>
        </FullRow>
    )
});

export default TaskActivity;