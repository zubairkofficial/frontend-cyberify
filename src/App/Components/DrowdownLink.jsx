import { Link } from "react-router-dom";

const DropdownLink = ({ link = "", isbutton = false, onClick, text, icon, isdanger = false }) => {
    if(isbutton){
        return (
            <button className={`dropdown-link ${isdanger ? 'text-danger' : ''}`} onClick={onClick}><i className={icon}></i><span className='ml5'>{text}</span></button>
        )
    }else{
        return (
            <Link className={`dropdown-link ${isdanger ? 'text-danger' : ''}`} to={link}><i className={icon}></i><span className='ml5'>{text}</span></Link>
        )
    }
}

export default DropdownLink;