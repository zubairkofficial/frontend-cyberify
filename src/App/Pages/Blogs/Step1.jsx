import { Link } from "react-router-dom";
import Card from "../../Components/Card";
import Column from "../../Components/Column";
import FullRow from "../../Components/FullRow";
import ImageInput from "../../Components/ImageInput";
import Row from "../../Components/Row";
import TextInput from "../../Components/TextInput";

const BlogStep1 = () => {

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

    const [featuredImage, setFeaturedImage] = useState("");
    const [articleImage, setArticleImage] = useState(defaultImage);
    const [articleImages, setArticleImages] = useState([]);
    const [blog, setBlog] = useState(defaultBlog);
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const titleUpdate = e => {
        let val = e.target.value;
        let slug = Helper.replaceSpaces(val, true);
        setBlog({...blog, title: val, slug, meta_title: val});
    }

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

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <FullRow>
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
        </FullRow>
    )
}

export default BlogStep1;