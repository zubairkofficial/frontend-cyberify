import { Link } from "react-router-dom";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import FullRow from "../Components/FullRow";
import Card from "../Components/Card";
import Column from "../Components/Column";
import TextInput from "../Components/TextInput";
import { useEffect, useState } from "react";
import ImageInput from "../Components/ImageInput";
import Row from "../Components/Row";
import Spinner from "../Components/Spinner";
import axios from 'axios';
import Helper from "../Config/Helper";
import { get } from "../Config/customs";
import BlogCategory from "./BlogCategories/BlogCategory";
import NothingFound from "../Components/NothingFound";
import Dropdown from "../Components/Dropdown";
import DropdownLink from "../Components/DrowdownLink";

const BlogCategories = () => {

    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState({});
    const [showCategoryForm, setShowCategoryForm] = useState(false);

    const getCategories = async () => setCategories(await get('blog/category/all'));

    const deleteCategory = async id => {
        axios.get(`${Helper.apiUrl}blog/category/delete/${id}`, Helper.authHeaders).then(response => {
            Helper.toast(response.data.message);
            getCategories();
        })
    }

    const editCategory = category => {
        setEditingCategory(category);
        setShowCategoryForm(true);
    }

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Blog Categories"} />
            <MainContent>
                {showCategoryForm && <BlogCategory getCategories={getCategories} editingCategory={editingCategory} setShowCategoryForm={setShowCategoryForm} />}
                <FullRow className={'mt-10'}>
                    <Card>
                        <Row isCenter={true} className="mb-10">
                            <Column cols={6}>
                                <h3>All Blog Categories</h3>
                            </Column>
                            <Column cols={6} className="text-end">
                                <button class="btn btn-sm btn-flex btn-primary fw-bold" onClick={() => setShowCategoryForm(true)}>
                                    Create Blog Category
                                </button>
                            </Column>
                        </Row>
                        {categories.length > 0 ? <table class="table align-middle table-row-dashed fs-7 gy-5">
                            <thead>
                                <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Short Description</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(category => {
                                    return(
                                        <tr key={category.id}>
                                            <td>
                                                <img className="service-icon" src={ Helper.serverImage(category.featured_image) } />
                                            </td>
                                            <td>{ category.name }</td>
                                            <td>{ category.description }</td>
                                            <td class="text-end">
                                                <Dropdown>
                                                    <DropdownLink text={'Edit'} onClick={() => editCategory(category)} isbutton={true} />
                                                    <DropdownLink text={'Delete'} isdanger={true} onClick={() => deleteCategory(category.id)} isbutton={true} />
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ) 
                                })}
                            </tbody>
                        </table> : <NothingFound width="20%" />}                        
                    </Card>
                </FullRow>
            </MainContent>
        </div>
    );
}

export default BlogCategories;