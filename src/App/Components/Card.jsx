const Card = ({ children, className = "", padding = "py-10" }) => {
    return (
        <div class={`card ${className}`}>
            {/* <div class="card-header border-0 pt-6"></div>
            <div class="card-toolbar"></div> */}
            <div class={`card-body ${padding}`}>
                {children}
            </div>
        </div>
    )
}

export default Card;