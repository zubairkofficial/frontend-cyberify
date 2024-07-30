import Moment from "react-moment";
import Helper from "../Config/Helper";
import Column from "./Column";
import MessageCard from "./MessageCard";
import Row from "./Row";
import UserAvatar from "./UserAvatar";

const Message = ({ message, messageKey = "message" }) => {
    const isLoginUser = message.user_id == Helper.authUser.id;
    return (
        <Row>
            {!isLoginUser && <Column cols={2}>
                {message.user_id === 0 ? <UserAvatar name={"Cyberify"} /> : <UserAvatar name={message.user ? message.user.name : ""} />}
            </Column>}
            <Column cols={10}>
                <MessageCard right={isLoginUser}>
                    {message.user_id === 0 && <strong>System Message</strong>}
                    <p>{message[messageKey]}</p>
                    <small><Moment format="MMM D, YYYY, h:mm a">{message.created_at}</Moment> by <strong>{message.user ? message.user.name : ""}</strong></small>
                </MessageCard>
            </Column>
            {isLoginUser && <Column cols={2}>
                <UserAvatar name={message.user ? message.user.name : ""} />
            </Column>}
        </Row>
    );
}
export default Message;