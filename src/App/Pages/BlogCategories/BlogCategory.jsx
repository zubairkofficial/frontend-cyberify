import axios from "axios";
import { useEffect, useState } from "react";
import Helper from "../../Config/Helper";
import FullRow from "../../Components/FullRow";
import Card from "../../Components/Card";
import Row from "../../Components/Row";
import Column from "../../Components/Column";
import TextInput from "../../Components/TextInput";
import ImageInput from "../../Components/ImageInput";
import { Link } from "react-router-dom";
import Spinner from "../../Components/Spinner";

const BlogCategory = ({getCategories, setShowCategoryForm, editingCategory}) => {
    
    const defaultCategory = {
        name: '',
        description: '',
        featured_image: '',
    }

    const [category, setCategory] = useState(defaultCategory);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [featuredImage, setFeaturedImage] = useState("");

    const saveCategory = () => {
        setLoading(true);
        axios.post(`${Helper.apiUrl}blog/category/save`, axios.toFormData(category), Helper.authFileHeaders).then(response => {
            Helper.toast("success", response.data.message);
            getCategories();
            setShowCategoryForm(false);
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        })
    }

    useEffect(() => {
        if(!Helper.isObjectEmpty(editingCategory)){
            setCategory(editingCategory);
            setFeaturedImage(editingCategory.featured_image);
        }
    }, [editingCategory]);

    return (
        <FullRow>
            <Card>
                <Row>
                    <Column cols={9}>
                        <TextInput label="Category Name" value={category.name} required={true} error={errors.name ? errors.name[0] : ''} onChange={e => setCategory({...category, name: e.target.value})} />
                        <TextInput label="Short Description" placeholder="Write few words..." isTextArea={true} error={errors.description ? errors.description[0] : ''} value={category.description} required={true} onChange={e => setCategory({...category, description: e.target.value})} />
                    </Column>
                    <Column cols={3}>
                        <ImageInput value={featuredImage} label="Category Featured Image" id={'featured-image'} error={errors.featured_image ? errors.featured_image[0] : ''} onChange={file => setCategory({...category, featured_image: file})} />
                    </Column>
                </Row>
                <Row>
                    <Column className={'simple-flex'} cols={12}>
                        <button className="btn btn-primary btn-loading" onClick={saveCategory} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Category"}</button>
                        <button onClick={() => {setShowCategoryForm(false);setCategory(defaultCategory)}} className="btn btn-outline-danger">Cancel</button>
                    </Column>
                </Row>
            </Card>
        </FullRow>
    )
}

export default BlogCategory;