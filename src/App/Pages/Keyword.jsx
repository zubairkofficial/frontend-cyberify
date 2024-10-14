import { useEffect, useState } from "react";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import FullRow from "../Components/FullRow";
import Card from "../Components/Card";
import NothingFound from "../Components/NothingFound";
import Dropdown from "../Components/Dropdown";
import DropdownLink from "../Components/DrowdownLink";
import axios from "axios";
import Helper from "../Config/Helper";

const Keywords = () => {
    const [keywords, setKeywords] = useState([]);
    const [selectedKeyword, setSelectedKeyword] = useState({ name: '' }); // Initialize with empty name field
    const [viewMode, setViewMode] = useState("");  // To track current mode: 'add', 'edit', 'view'

    // Fetch the keywords from the backend
    const getKeywords = async () => {
        const result = await axios.get(`${Helper.apiUrl}keyword/all`, Helper.authHeaders);
        setKeywords(result.data);
    };

    // Handle keyword deletion
    const deleteKeyword = (keywordId) => {
        axios.delete(`${Helper.apiUrl}keyword/delete/${keywordId}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            getKeywords();
        });
    };

    useEffect(() => {
        getKeywords();
    }, []);

    // Handle form changes for both add and edit
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedKeyword(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission for adding or editing
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (viewMode === 'add') {
            // API call to add a new keyword
            await axios.post(`${Helper.apiUrl}keyword/add`, selectedKeyword, Helper.authHeaders);
            Helper.toast("success", "Keyword added successfully");
        } else if (viewMode === 'edit') {
            // API call to update an existing keyword
            await axios.post(`${Helper.apiUrl}keyword/update/${selectedKeyword.id}`, selectedKeyword, Helper.authHeaders);
            Helper.toast("success", "Keyword updated successfully");
        }
        getKeywords();  // Refresh the list of keywords
        setViewMode('');  // Reset the view mode to show the list
    };

    // Function to handle view or edit actions
    const handleViewOrEdit = (keyword, mode) => {
        setSelectedKeyword(keyword);
        setViewMode(mode);
    };

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Keywords"}>
                <button onClick={() => { setViewMode('add'); setSelectedKeyword({ name: '' }); }} className="btn btn-sm btn-flex btn-primary fw-bold">
                    Add Keyword
                </button>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        {/* Only show the table or "NothingFound" when not in add, edit, or view modes */}
                        {viewMode === "" ? (
                            keywords.length > 0 ? (
                                <table className="table align-middle table-row-dashed fs-7 gy-5">
                                    <thead>
                                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {keywords.map(keyword => (
                                            <tr key={keyword.id}>
                                                <td>{keyword.id}</td>
                                                <td>{keyword.name}</td>
                                                <td className="text-end">
                                                    <Dropdown>
                                                        <DropdownLink text="View" isbutton={true} onClick={() => handleViewOrEdit(keyword, 'view')} />
                                                        <DropdownLink text="Edit" isbutton={true} onClick={() => handleViewOrEdit(keyword, 'edit')} />
                                                        <DropdownLink text="Delete" isdanger={true} isbutton={true} onClick={() => deleteKeyword(keyword.id)} />
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <NothingFound width="20%" />
                            )
                        ) : null}  {/* Don't show anything when add/edit/view modes are active */}

                        {/* Add / Edit Keyword Form */}
                        {(viewMode === "add" || viewMode === "edit") && (
                            <div>
                                <h3>{viewMode === "add" ? "Add New Keyword" : "Edit Keyword"}</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Keyword Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={selectedKeyword.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button type="submit" className="btn btn-primary">Save</button>
                                        <button type="button" className="btn btn-secondary" onClick={() => setViewMode("")}>Cancel</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* View Keyword */}
                        {viewMode === "view" && selectedKeyword && (
                            <div>
                                <h3>View Keyword</h3>
                                <p><strong>Name:</strong> {selectedKeyword.name}</p>
                                <button type="button" className="btn btn-secondary" onClick={() => setViewMode("")}>Close</button>
                            </div>
                        )}
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
};

export default Keywords;
