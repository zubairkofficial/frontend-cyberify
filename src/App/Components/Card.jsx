const Card = ({ children, className = "", padding = "py-10" }) => {
    return (
        <div className={`card ${className}`}>
            {/* <div className="card-header border-0 pt-6"></div>
            <div className="card-toolbar"></div> */}
            <div className={`card-body ${padding}`}>
                {children}
            </div>
        </div>
    )
}

export default Card;