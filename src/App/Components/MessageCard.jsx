const MessageCard = ({ children, right = false }) => {
    return (
        <div className={`mb-3 ${right ? 'message-card-right' : 'message-card-left'}`}>
            {children}
        </div>
    )
}

export default MessageCard;