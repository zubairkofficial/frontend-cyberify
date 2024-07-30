const Column = ({children, cols, className = ""}) => {
    return <div className={`col-md-${cols} ${className}`}>{ children }</div>;
}

export default Column;