const MessageCard = ({ children, right = false }) => {
    return (
        <div class={`mb-3 ${right ? 'message-card-right' : 'message-card-left'}`}>
            {children}
        </div>
    )
}

export default MessageCard;