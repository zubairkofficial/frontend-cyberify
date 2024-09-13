const Row = ({ children, isCenter = false, className = "" }) => {
    return <div className={`row ${className}`} style={isCenter ? { alignItems: 'center' } : {}}>{children}</div>;
}

export default Row;