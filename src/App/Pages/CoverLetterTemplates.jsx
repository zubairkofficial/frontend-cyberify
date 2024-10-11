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

const CoverLetterTemplates = () => {
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState({ name: '', content: '' }); // Initialize with empty fields
    const [viewMode, setViewMode] = useState("");  // To track current mode: 'add', 'edit', 'view'

    // Fetch the cover letter templates from the backend
    const getTemplates = async () => {
        const result = await axios.get(`${Helper.apiUrl}cover-letter/all`, Helper.authHeaders);
        setTemplates(result.data);
    };

    // Handle template deletion
    const deleteTemplate = (templateId) => {
        axios.delete(`${Helper.apiUrl}cover-letter/delete/${templateId}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            getTemplates();
        });
    };

    useEffect(() => {
        getTemplates();
    }, []);

    // Handle form changes for both add and edit
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedTemplate(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission for adding or editing
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (viewMode === 'add') {
            // API call to add a new template
            await axios.post(`${Helper.apiUrl}cover-letter/add`, selectedTemplate, Helper.authHeaders);
            Helper.toast("success", "Cover letter template added successfully");
        } else if (viewMode === 'edit') {
            // API call to update an existing template
            await axios.post(`${Helper.apiUrl}cover-letter/update/${selectedTemplate.id}`, selectedTemplate, Helper.authHeaders);
            Helper.toast("success", "Cover letter template updated successfully");
        }
        getTemplates();  // Refresh the list of templates
        setViewMode('');  // Reset the view mode to show the list
    };

    // Function to handle view or edit actions
    const handleViewOrEdit = (template, mode) => {
        setSelectedTemplate(template);
        setViewMode(mode);
    };

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Cover Letter Templates"}>
                <button onClick={() => { setViewMode('add'); setSelectedTemplate({ name: '', content: '' }); }} className="btn btn-sm btn-flex btn-primary fw-bold">
                    Add Cover Letter Template
                </button>
            </Toolbar>
            <MainContent>
            <FullRow>
                <Card>
                    {/* Only show the table or "NothingFound" when not in add, edit, or view modes */}
                    {viewMode === "" ? (
                        templates.length > 0 ? (
                            <table className="table align-middle table-row-dashed fs-7 gy-5">
                                <thead>
                                    <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Content</th>
                                        <th className="text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {templates.map(template => (
                                        <tr key={template.id}>
                                            <td>{template.id}</td>
                                            <td>{template.name}</td>
                                            <td>{template.content.length > 50 ? template.content.substring(0, 50) + '...' : template.content}</td> {/* Truncated content */}
                                            <td className="text-end">
                                                <Dropdown>
                                                    <DropdownLink text="View" isbutton={true} onClick={() => handleViewOrEdit(template, 'view')} />
                                                    <DropdownLink text="Edit" isbutton={true} onClick={() => handleViewOrEdit(template, 'edit')} />
                                                    <DropdownLink text="Delete" isdanger={true} isbutton={true} onClick={() => deleteTemplate(template.id)} />
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

                    {/* Add / Edit Template Form */}
                    {(viewMode === "add" || viewMode === "edit") && (
                        <div>
                            <h3>{viewMode === "add" ? "Add New Template" : "Edit Template"}</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Template Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={selectedTemplate.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Template Content</label>
                                    <textarea
                                        name="content"
                                        className="form-control"
                                        rows="5"
                                        value={selectedTemplate.content}
                                        onChange={handleInputChange}
                                        required
                                    ></textarea>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="submit" className="btn btn-primary">Save</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setViewMode("")}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* View Template */}
                    {viewMode === "view" && selectedTemplate && (
                        <div>
                            <h3>View Template</h3>
                            <p><strong>Name:</strong> {selectedTemplate.name}</p>
                            <p><strong>Content:</strong> {selectedTemplate.content}</p>
                            <button type="button" className="btn btn-secondary" onClick={() => setViewMode("")}>Close</button>
                        </div>
                    )}
                </Card>
            </FullRow>
            </MainContent>
        </div>
    );
};

export default CoverLetterTemplates;
