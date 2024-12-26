import { useEffect, useState } from "react";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import FullRow from "../../Components/FullRow";
import Card from "../../Components/Card";
import NothingFound from "../../Components/NothingFound";
import Dropdown from "../../Components/Dropdown";
import DropdownLink from "../../Components/DrowdownLink";
import axios from "axios";
import Helper from "../../Config/Helper";

const GalleryCategories = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ name: '', description: '' }); // Initialize with empty fields
    const [viewMode, setViewMode] = useState("");  // To track current mode: 'add', 'edit', 'view'


    const getCategories = async () => {
        const result = await axios.get(`${Helper.apiUrl}gallery/category/all`, Helper.authHeaders);
        setCategories(result.data);
    };


    const deleteCategory = (categoryId) => {
        axios.delete(`${Helper.apiUrl}gallery/category/delete/${categoryId}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            getCategories();
        });
    };

    useEffect(() => {
        getCategories();
    }, []);

    // Handle form changes for both add and edit
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCategory(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission for adding or editing
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('name', selectedCategory.name);
        formData.append('description', selectedCategory.description ?? "");  // Handle optional description
    
        if (viewMode === 'edit') {
            // Adding the category_id for the edit operation
            formData.append('category_id', selectedCategory.id);
        }
    
        try {
            if (viewMode === 'add') {
                // API call to add a new category
                await axios.post(`${Helper.apiUrl}gallery/category/add`, formData, Helper.authHeaders);
                Helper.toast("success", "Gallery category added successfully");
            } else if (viewMode === 'edit') {
                // API call to update an existing category
                await axios.post(`${Helper.apiUrl}gallery/category/add`, formData, Helper.authHeaders);
                Helper.toast("success", "Gallery category updated successfully");
            }
    
            // Refresh the list of categories after the operation
            getCategories();
            setViewMode('');  // Reset the view mode to show the list
        } catch (error) {
            Helper.toast("error", "An error occurred while saving the category");
        }
    };
    

    // Function to handle view or edit actions
    const handleViewOrEdit = (category, mode) => {
        setSelectedCategory(category);
        setViewMode(mode);
    };

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Gallery Categories"}>
                <button onClick={() => { setViewMode('add'); setSelectedCategory({ name: '', description: '' }); }} className="btn btn-sm btn-flex btn-primary fw-bold">
                    Add Gallery Category
                </button>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        {/* Only show the table or "NothingFound" when not in add, edit, or view modes */}
                        {viewMode === "view" ? (
                            <div className="view-mode">
                                <h4>Category Details</h4>
                                <p><strong>Name:</strong> {selectedCategory.name}</p>
                                <p><strong>Description:</strong> {selectedCategory.description || "No description provided"}</p>
                                <button onClick={() => setViewMode('')} className="btn btn-sm btn-secondary">Back to List</button>
                            </div>
                        ) : viewMode === "" ? (
                            categories.length > 0 ? (
                                <table className="table align-middle table-row-dashed fs-7 gy-5">
                                    <thead>
                                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(category => (
                                            <tr key={category.id}>
                                                <td>{category.id}</td>
                                                <td>{category.name}</td>
                                                <td>{category.description && category.description.length > 50 ? category.description.substring(0, 50) + '...' : category.description != null ? category.description : "No Description"}</td> {/* Truncated description */}
                                                <td className="text-end">
                                                    <Dropdown>
                                                        <DropdownLink text="View" isbutton={true} onClick={() => handleViewOrEdit(category, 'view')} />
                                                        <DropdownLink text="Edit" isbutton={true} onClick={() => handleViewOrEdit(category, 'edit')} />
                                                        <DropdownLink text="Delete" isdanger={true} isbutton={true} onClick={() => deleteCategory(category.id)} />
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

                        {/* Add / Edit Category Form */}
                        {(viewMode === "add" || viewMode === "edit") && (
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Category Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={selectedCategory.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={selectedCategory.description}
                                            onChange={handleInputChange}
                                        ></textarea>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <button type="submit" className="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
};

export default GalleryCategories;
