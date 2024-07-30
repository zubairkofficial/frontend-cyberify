const FullRow = ({ children, className }) => {
    return <div className={`row ${className}`}><div className="col-md-12">{children}</div></div>;
}

export default FullRow;