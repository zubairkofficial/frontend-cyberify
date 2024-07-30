import Helper from "../Config/Helper";

const Allowed = ({ children, roles = [], all = false }) => {
    if(all){
        return children
    }else{
        let userType = Helper.authUser.user_type;
        if(roles.find(role => role == userType)){
            return children;
        }else{
            return null;
        }
    }
}

export default Allowed;