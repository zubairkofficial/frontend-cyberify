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

const GalleryImages = () => {
    const [categories, setCategories] = useState([]);  // To store gallery categories
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState({ name: '', description: '', imageFile: null, categoryId: '' });
    const [viewMode, setViewMode] = useState("");  // 'add', 'edit', 'view'

    // Fetch all gallery categories for the dropdown
    const getCategories = async () => {
        const result = await axios.get(`${Helper.apiUrl}gallery/category/all`, Helper.authHeaders);
        setCategories(result.data);
    };

    // Fetch images for the selected category
    const getImages = async () => {
            const result = await axios.get(`${Helper.apiUrl}gallery/image/all`, Helper.authHeaders);
            setImages(result.data);
    };

    // Delete an image
    const deleteImage = (imageId) => {
        axios.delete(`${Helper.apiUrl}gallery/image/delete/${imageId}`, Helper.authHeaders).then(response => {
            Helper.toast("success", response.data.message);
            getImages();
        });
    };

    // Fetch categories and images when the component mounts
    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
            getImages();
    }, []);

    // Handle form input changes (for both add and edit)
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            // Ensure that the image file is assigned to imageFile
            setSelectedImage(prevState => ({
                ...prevState,
                [name]: files[0]  // Handle image file input
            }));
        } else {
            setSelectedImage(prevState => ({
                ...prevState,
                [name]: value  // Handle other fields (name, description)
            }));
        }
    };

    // Handle form submission for adding or editing images
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', selectedImage.name || "");
        formData.append('description', selectedImage.description || "");
        
        if (selectedImage.imageFile) {
            // Append image file to the form data
            formData.append('image', selectedImage.imageFile);
        }
        formData.append('category_id', selectedImage.categoryId);  // Include categoryId in form data
    
        try {
            if (viewMode === 'add') {
                // Post to add image with the categoryId
                await axios.post(`${Helper.apiUrl}gallery/image/add`, formData, Helper.authFileHeaders);
                Helper.toast("success", "Image added successfully");
            } 
            // else if (viewMode === 'edit') {
            //     // Post to update image
            //     formData.append('image_id', selectedImage.id);  // Include imageId for editing
            //     await axios.post(`${Helper.apiUrl}gallery/image/edit`, formData, Helper.authHeaders);
            //     Helper.toast("success", "Image updated successfully");
            // }
    
            getImages();  // Refresh images list
            setViewMode('');  // Reset to view mode
        } catch (error) {
            Helper.toast("error", "An error occurred while saving the image");
        }
    };

    // Handle view or edit actions
    const handleViewOrEdit = (image, mode) => {
        setSelectedImage(image);
        setViewMode(mode);
    };

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Gallery Images"}>
                <button onClick={() => { 
                    setViewMode('add'); 
                    setSelectedImage({ name: '', description: '', imageFile: null, categoryId: selectedImage.categoryId || '' }); 
                }} className="btn btn-sm btn-flex btn-primary fw-bold">
                    Add Gallery Image
                </button>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        {/* Show the form only when in add or edit mode */}
                        {viewMode === 'add' ? (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <select
                                        className="form-select"
                                        name="categoryId"
                                        value={selectedImage.categoryId}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="title"
                                        value={selectedImage.name}
                                        onChange={handleInputChange}
                                        
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Image</label>
                                    <input 
    type="file" 
    className="form-control" 
    name="imageFile" 
    onChange={handleInputChange} 
    required 
/>
                                </div>
                                <button type="submit" className="btn btn-primary">{viewMode === 'add' ? 'Add Image' : 'Update Image'}</button>
                            </form>
                        ) : (
                            // Show the table of images when not in add or edit mode
                            images.length > 0 ? (
                                <table className="table align-middle table-row-dashed fs-7 gy-5">
                                    <thead>
                                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                            <th>ID</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th className="text-end">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {images.map(image => (
                                            <tr key={image.id}>
                                                <td>{image.id}</td>
                                                <td><img  width={"100px"} src={Helper.serverImage(`${image.image_path}`)} alt={image.title || "No Title"} /></td>
                                                <td>{image.title || "No Title"}</td>
                                                <td>{image.description || "No Description"}</td>
                                                <td className="text-end">
                                                    <Dropdown>
                                                        <DropdownLink text="View" isbutton={true} onClick={() => handleViewOrEdit(image, 'view')} />
                                                        <DropdownLink text="Delete" isdanger={true} isbutton={true} onClick={() => deleteImage(image.id)} />
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <NothingFound />
                            )
                        )}
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
};

export default GalleryImages;