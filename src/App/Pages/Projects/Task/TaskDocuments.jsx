import { useEffect, useState } from "react";
import Column from "../../../Components/Column";
import FullRow from "../../../Components/FullRow";
import Row from "../../../Components/Row";
import TextInput from "../../../Components/TextInput";
import Spinner from "../../../Components/Spinner";
import axios from "axios";
import Helper from "../../../Config/Helper";
import Card from "../../../Components/Card";
import Moment from "react-moment";
import FixContainer from "../../../Components/FixContainer";
import NothingFound from "../../../Components/NothingFound";
import TaskClass from "./Task";
import { Link } from "react-router-dom";

const TaskDocuments = ({ taskId }) => {
    const defaultDoc = {
        task_id: taskId,
        name: "",
        link: "",
        description: "",
        is_link: true,
        file_name: "",
    }

    const [activeTab, setActiveTab] = useState("file_link");
    const [addingDoc, setAddingDoc] = useState(false);
    const [loading, setLoading] = useState(false);
    const [document, setDocument] = useState(defaultDoc);
    const [documents, setDocuments] = useState([]);

    const uploadFile = () => {
        setLoading(true);
        let formData = new FormData();
        Object.keys(document).forEach(key => {
            formData.append(key, document[key]);
        })
        axios.post(`${Helper.apiUrl}task/document/create`, formData, Helper.authFileHeaders).then(response => {
            TaskClass.createActivity(taskId, `A document is added named ${document.name}`);
            if(activeTab === "file_link"){
                setDocument({...defaultDoc, is_link: true});
            }else{
                setDocument({...defaultDoc, is_link: false});
            }
            getDocuments();
            setAddingDoc(false);
            Helper.toast("success", response.data.message);
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
        }).finally(() => {
            setLoading(false);
        })
    }

    const switchActiveTab = (tab) => {
        setActiveTab(tab);
        if(tab === "file_link"){
            setDocument({...document, is_link: true});
        }else{
            setDocument({...document, is_link: false});
        }
    }

    const getDocuments = () => {
        axios.get(`${Helper.apiUrl}task/documents/task/${taskId}`, Helper.authHeaders).then(response => {
            setDocuments(response.data);
        })
    }

    useEffect(() => {
        getDocuments();
    }, []);


    return (
        <>
            {!addingDoc && <FixContainer height={'35vh'}>
                {documents.length > 0 ? documents.map(doc => {
                    return (
                        <Card key={doc.id} className="mb-3">
                            <Row isCenter={true}>
                                <Column cols={12}>
                                    <h4>{ doc.name }</h4>
                                    <p>{ doc.description }</p>
                                    <p><small>created by <strong>{ doc.user.name }</strong> on <strong><Moment format="MMMM Do YYYY">{doc.created_at}</Moment></strong></small></p>
                                    <Link to={`${doc.link ? doc.link : Helper.serverImage(doc.file_name)}`} target="_blank" className="btn btn-primary w-100 btn-sm">{doc.link ? 'Open File' : 'Download File'}</Link>
                                </Column>
                            </Row>
                        </Card>
                    );
                }) : <NothingFound />}
            </FixContainer>}
            {!addingDoc && <FullRow>
                <br />
                <button className="btn btn-primary w-100 btn-sm" onClick={() => setAddingDoc(true)}>Add New File</button>
            </FullRow>}
            {addingDoc && <FullRow>
                <Row>
                    <Column cols={6}>
                        <button className={`btn-tab ${activeTab === 'file_link' && 'active'}`} onClick={() => switchActiveTab("file_link")}>File Link</button>
                    </Column>
                    <Column cols={6}>
                        <button className={`btn-tab ${activeTab === 'upload_file' && 'active'}`} onClick={() => switchActiveTab("upload_file")}>Upload File</button>
                    </Column>
                </Row>
                <br />
                <FullRow>
                    <TextInput placeholder="File Name" required={true} value={document.name} onChange={(e) => setDocument({...document, name: e.target.value})} />
                </FullRow>
                <FullRow>
                    <TextInput isTextArea={true} placeholder="Description (optional)" required={false} value={document.description} onChange={(e) => setDocument({...document, description: e.target.value})} />
                </FullRow>
                {activeTab === 'file_link' && <FullRow>
                    <TextInput placeholder="File Link" required={true} value={document.link} onChange={(e) => setDocument({...document, link: e.target.value})} />
                </FullRow>}
                {activeTab === 'upload_file' &&  <FullRow>
                    <TextInput type="file" placeholder="Upload File" required={true} onChange={(e) => setDocument({...document, file_name: e.target.files[0]})} />
                </FullRow>}
                <Row>
                    <Column cols={6}>
                        <button className="btn btn-primary btn-loading w-100" disabled={loading} onClick={uploadFile}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Document"}</button>
                    </Column>
                    <Column cols={6}>
                        <button onClick={() => setAddingDoc(false)} className="btn btn-outline-danger w-100">Cancel</button>
                    </Column>
                </Row>
            </FullRow>}
        </>
    );
}

export default TaskDocuments;