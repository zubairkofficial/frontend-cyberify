const Row = ({ children, isCenter = false }) => {
    return <div className="row" style={isCenter ? { alignItems: 'center' } : {}}>{children}</div>;
}

export default Row;