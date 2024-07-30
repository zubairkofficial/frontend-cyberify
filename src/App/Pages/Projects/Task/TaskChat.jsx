import { useEffect, useRef, useState } from "react";
import Column from "../../../Components/Column";
import FixContainer from "../../../Components/FixContainer";
import FullRow from "../../../Components/FullRow";
import Row from "../../../Components/Row";
import TextInput from "../../../Components/TextInput";
import Helper from "../../../Config/Helper";
import axios from "axios";
import Message from "../../../Components/Message";

const TaskChat = ({ taskId }) => {
    const defaultMessage = {
        task_id: taskId,
        message: "",
    }

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState(defaultMessage);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const getMessages = () => {
        axios.get(`${Helper.apiUrl}task/messages/${taskId}`, Helper.authHeaders).then(response => {
            setMessages(response.data);
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        });
    }

    const sendMessage = () => {
        setSending(true);
        axios.post(`${Helper.apiUrl}task/message`, message, Helper.authHeaders).then(response => {
            console.log(response);
            setMessage(defaultMessage);
            getMessages();
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
        }).finally(() => {
            setSending(false);
        })
    }

    useEffect(() => {
        getMessages();
    }, []);

    return (
        <FullRow>
            <FixContainer height={'40vh'}>
                {messages.map(msg => {
                    return <Message message={msg} key={msg.id} />
                })}
                <div ref={messagesEndRef} />
            </FixContainer>
            <form onSubmit={sendMessage}>
                <Row>
                    <Column cols={9}>
                        <TextInput value={message.message} onChange={e => setMessage({...message, message: e.target.value})} placeholder="type your message..." />
                    </Column>
                    <Column cols={3}>
                        <button type="submit" className="btn btn-primary btn-sm w-100" onClick={sendMessage} disabled={sending}>Send</button>
                    </Column>
                </Row>
            </form>
        </FullRow>
    )
}

export default TaskChat;