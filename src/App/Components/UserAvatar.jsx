const UserAvatar = ({ name = "" }) => {
    const firstWord = name.charAt(0).toUpperCase();

    return (
        <div className="user-avatar"><div>{ firstWord }</div></div>
    );
}

export default UserAvatar;