import { useState } from "react";
import Column from "./Column";
import FullRow from "./FullRow";
import Row from "./Row";
import TextInput from "./TextInput";
import Pagination from "./Pagination";
import Helper from "../Config/Helper";

const DataTable = ({children, title = "", description = "", paginate, data, setData, fields = [], pageNo, paginated, setPageNo}) => {

    const [query, setQuery] = useState("");

    const onInputSearch = inputQuery => {
        if(paginate){
            setData(Helper.paginate(Helper.search(inputQuery, data, fields)))
            setPageNo(0);
        }else{
            setData(Helper.search(inputQuery, data, fields))
        }
    }
    const handleSearchChange = e => {
        if(e.target.value === ''){
            if(paginate){
                setData(Helper.paginate(data));
                setPageNo(0);
            }else{
                setData(data)
            }
        }else{
            onInputSearch(e.target.value);
        }
        setQuery(e.target.value);
    }

    return (
        <FullRow>
            <Row>
                <Column cols={8}>
                    <h3>{title}</h3>
                    <p>{description}</p>
                </Column>
                <Column cols={4}>
                    <TextInput placeholder="Search here..." value={query} onChange={handleSearchChange} />
                </Column>
            </Row>
            {children}
            <br />
            <FullRow>
                <Pagination pageNo={pageNo} paginated={paginated} setPageNo={setPageNo} />
            </FullRow>
        </FullRow>
    )
}

export default DataTable;