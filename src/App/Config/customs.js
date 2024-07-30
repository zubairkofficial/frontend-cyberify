import axios from "axios"
import Helper from "./Helper"

export const get = async (url) => {
    let response = await axios.get(`${Helper.apiUrl}${url}`, Helper.authHeaders);
    return response.data;
}