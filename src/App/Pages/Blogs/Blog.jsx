import { Link, useNavigate, useParams } from "react-router-dom";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import FullRow from "../../Components/FullRow";
import Card from "../../Components/Card";
import Row from "../../Components/Row";
import Column from "../../Components/Column";
import TextInput from "../../Components/TextInput";
import { useEffect, useState } from "react";
import { get } from '../../Config/customs';
import BasicSelect from "../../Components/BasicSelect";
import QuillEditor from "../../Components/QuillEditor";
import Helper from "../../Config/Helper";
import Spinner from "../../Components/Spinner";
import ImageInput from "../../Components/ImageInput";
import axios from "axios";

const Blog = () => {

    const {id, slug} = useParams();

    const defaultBlog = {
        blog_category_id: '',
        title: '',
        summary: '',
        content: '',
        slug: '',
        featured_image: null,
        featured_image_name: '',
        meta_title: '',
        meta_description: '',
        meta_keywords: ''
    }

    const defaultImage = {
        image_name: '',
        image_path: null
    }

    const [featuredImage, setFeaturedImage] = useState("");
    const [articleImage, setArticleImage] = useState(defaultImage);
    const [articleImages, setArticleImages] = useState([]);
    const [blog, setBlog] = useState(defaultBlog);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const getCategories = async () => setCategories(await get('blog/category/all'));

    const navigate = useNavigate();

    const saveArticle = () => {
        console.log(blog);
        setLoading(true);
        axios.post(`${Helper.apiUrl}blog/save`, axios.toFormData(blog), Helper.authFileHeaders).then(response => {
            Helper.toast("success", response.data.message);
            setCurrentStep(2);
            if(currentStep === 2){
                navigate('/user/blogs');
            }else{
                setBlog(response.data.blog);
                setArticleImage({...articleImage, blog_id: response.data.blog.id});
                setFeaturedImage(response.data.blog.featured_image);
                setErrors({});
            }
        }).catch(error => {
            Helper.toast("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        });
    }

    const getArticle = () => {
        if(id){
            axios.get(`${Helper.apiUrl}blog/single/${id}`, Helper.authHeaders).then(response => {
                setBlog(response.data);
                setArticleImage({...articleImage, blog_id: response.data.id});
                setFeaturedImage(response.data.featured_image);
            });
        }
    }

    const titleUpdate = e => {
        let val = e.target.value;
        let slug = Helper.replaceSpaces(val, true);
        setBlog({...blog, title: val, slug, meta_title: val});
    }

    const saveImage = () => {
        setLoading(false);
        let article_images_data = articleImage;
        article_images_data.blog_id = blog.id;
        axios.post(`${Helper.apiUrl}blog/image/save`, article_images_data, Helper.authFileHeaders).then(response => {
            Helper.toast("success", response.data.message);
            setArticleImage(defaultImage);
            getArticleImages();
        }).catch(error => {
            setLoading("error", error.response.data.message);
            setErrors(error.response.data.errors || {});
        }).finally(() => {
            setLoading(false);
        })
    }

    const getArticleImages = () => {
        axios.get(`${Helper.apiUrl}blog/image/all/${id}`, Helper.authHeaders).then(response => {
            setArticleImages(response.data);
        });
    }

    useEffect(() => {
        getCategories();
        if(id){
            getArticle();
            getArticleImages();
        }
    }, []);

    return (
        <div class="d-flex flex-column flex-column-fluid">
            <Toolbar title={"Blog Article"}>
                <Link to="/user/blogs" class="btn btn-sm btn-flex btn-primary fw-bold">
                    All Blogs
                </Link>
            </Toolbar>
            <MainContent>
                {currentStep === 1 && <FullRow>
                    <Card>
                        <Row>
                            <Column cols={9}>
                                <FullRow>
                                    <h3>Step 1: Add Basic Details</h3>
                                    <br />
                                </FullRow>
                                <TextInput label="Article Title" required={true} value={blog.title} onChange={titleUpdate} error={errors.title ? errors.title[0] : ''} />
                                <TextInput label="Short Summary" placeholder="Write few words" isTextArea={true} value={blog.summary} onChange={e => setBlog({...blog, summary: e.target.value})} required={true} error={errors.summary ? errors.summary[0] : ''} />
                                <Row>
                                    <Column cols={6}>
                                        <BasicSelect options={categories} isObject={true} optionLabel="name" optionValue="id" label="Select Blog Category" required={true} value={blog.blog_category_id} onChange={e => setBlog({...blog, blog_category_id: e.target.value})} error={errors.blog_category_id ? errors.blog_category_id[0] : ''} />
                                    </Column>
                                    <Column cols={6}>
                                        <TextInput label="Article Slug" required={true} value={Helper.replaceSpaces(blog.slug, true)} onChange={e => setBlog({...blog, slug: e.target.value})} error={errors.slug ? errors.slug[0] : ''} />
                                    </Column>
                                </Row>
                                <FullRow>
                                    <h3>Meta Information</h3>
                                    <br />
                                </FullRow>
                                <Row>
                                    <Column cols={6}>
                                        <TextInput label="Meta Title" required={true} value={blog.meta_title} onChange={e => setBlog({...blog, meta_title: e.target.value})} error={errors.meta_title ? errors.meta_title[0] : ''} />
                                    </Column>
                                    <Column cols={6}>
                                        <TextInput label="Meta Keywords" required={true} value={blog.meta_keywords} onChange={e => setBlog({...blog, meta_keywords: e.target.value})} error={errors.meta_keywords ? errors.meta_keywords[0] : ''} />
                                    </Column>
                                </Row>
                                <TextInput label="Meta Description" placeholder="Meta Description" isTextArea={true} value={blog.meta_description} onChange={e => setBlog({...blog, meta_description: e.target.value})} required={true} error={errors.meta_description ? errors.meta_description[0] : ''} />
                                <Row>
                                    <Column className={'simple-flex'} cols={12}>
                                        <button className="btn btn-primary btn-loading" onClick={saveArticle} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Continue"}</button>
                                        <Link to={`/user/blogs`} className="btn btn-outline-danger">Cancel</Link>
                                    </Column>
                                </Row>
                            </Column>
                            <Column cols={3}>
                                <Card>
                                    <FullRow>
                                        <h3>Featured Image</h3>
                                        <br />
                                    </FullRow>
                                    <ImageInput value={featuredImage} error={errors.featured_image ? errors.featured_image[0] : ''} label="Featured Image" id={'service-icon'} onChange={file => setBlog({...blog, featured_image: file})} />
                                    <TextInput label="Featured Image Name" required={true} value={blog.featured_image_name} onChange={e => setBlog({...blog, featured_image_name: e.target.value})} error={errors.featured_image_name ? errors.featured_image_name[0] : ''} />
                                </Card>
                            </Column>
                        </Row>
                    </Card>
                </FullRow>}
                {currentStep === 2 && <FullRow>
                    <Card>
                        <Row>
                            <FullRow>
                                <h3>Step 2: Article Content</h3>
                                <br />
                            </FullRow>
                            <Column cols={9}>
                                <QuillEditor value={blog.content} label="Blog Content" onChange={value => setBlog({...blog, content: value})} required={true} error={errors.content ? errors.content[0] : ''} />
                                <Row>
                                    <Column className={'simple-flex'} cols={12}>
                                        <button className="btn btn-primary btn-loading" onClick={saveArticle} disabled={loading}>{loading && <Spinner />}{loading ? "Please wait..." : "Save Article"}</button>
                                        <button onClick={() => setCurrentStep(1)} className="btn btn-outline-danger">Back</button>
                                    </Column>
                                </Row>
                                <FullRow>
                                    <table class="table align-middle table-row-dashed fs-7 gy-5">
                                        <thead>
                                            <tr>
                                                <th>Image</th>
                                                <th>Name</th>
                                                <th>Short Code</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articleImages.map(articleImg => {
                                                return (
                                                    <tr key={articleImg.id}>
                                                        <td>
                                                            <img className="service-icon" src={ Helper.serverImage(articleImg.image_path) } />
                                                        </td>
                                                        <td>{ articleImg.image_name }</td>
                                                        <td>{ articleImg.short_code }</td>
                                                        <td>
                                                            <button className="btn btn-sm btn-primary" onClick={() => Helper.copyText(articleImg.short_code)}>Copy Short Code</button>
                                                            <button className="btn btn-sm btn-outline-danger ml5">Delete</button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </FullRow>
                            </Column>
                            <Column cols={3}>
                                <Card className="mt-10">
                                    <FullRow>
                                        <h3>Article Images</h3>
                                        <br />
                                    </FullRow>
                                    <TextInput label="Image Name" required={true} value={articleImage.image_name} onChange={e => setArticleImage({...articleImage, image_name: e.target.value})} error={errors.image_name ? errors.image_name[0] : ''} />
                                    <ImageInput error={errors.image_path ? errors.image_path[0] : ''} label="Article Image" id={'article-image'} onChange={file => setArticleImage({...articleImage, image_path: file})} />
                                    <button className="btn btn-primary btn-sm" onClick={saveImage} disabled={loading}>{'Upload'}</button>
                                    <button onClick={() => setArticleImage(defaultImage)} className="btn btn-outline-danger btn-sm ml5">Cancel</button>
                                </Card>
                            </Column>
                        </Row>
                    </Card>
                </FullRow>}
            </MainContent>
        </div>
    );
}

export default Blog;