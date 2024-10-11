import { Link, useNavigate, useParams } from "react-router-dom";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import { useEffect, useState } from "react";
import axios from "axios";
import Helper from "../../Config/Helper";
import FullRow from "../../Components/FullRow";
import Card from "../../Components/Card";
import Row from "../../Components/Row";
import Column from "../../Components/Column";

const ViewBlog = () => {

    const {id, slug} = useParams();

    const [blog, setBlog] = useState({});

    const navigate = useNavigate();

    const getBlog = () => {
        axios.get(`${Helper.apiUrl}blog/single/${id}`, Helper.authHeaders).then(response => {
            setBlog(response.data);
        });
    }

    const deleteBlog = (id) => {
        axios.get(`${Helper.apiUrl}blog/delete/${id}`, Helper.authHeaders).then(response => {
            navigate('/user/blogs');
        });
    }

    useEffect(() => {
        getBlog();
    }, []);

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={blog.title}>
                <Link to="/user/blogs" className="btn btn-sm btn-flex btn-primary fw-bold">
                    All Blogs
                </Link>
                <Link to={`/user/blog/edit/${id}/${slug}`} className="btn btn-sm btn-flex btn-default fw-bold ml-10">
                    <i className="fa-light fa-pen-to-square"></i> Edit Blog
                </Link>
                <button onClick={() => deleteBlog(id)} className="btn btn-sm btn-flex btn-outline-danger fw-bold ml-10">
                    <i className="fa-light fa-trash"></i> Delete Blog
                </button>
            </Toolbar>
            <MainContent>
                {!Helper.isObjectEmpty(blog) && <Row>
                    <Column cols={8}>
                        <Card>
                            <h3>{blog.title}</h3>
                            <p>{blog.summary}</p>
                            <br />
                            <div dangerouslySetInnerHTML={{ __html: blog.updated_content }} />
                        </Card>
                    </Column>
                    <Column cols={4}>
                        <Card>
                            <h4>Featured Image</h4>
                            <img src={Helper.serverImage(blog.featured_image)} className="blog-featured-image" />
                            <br />
                            <br />
                            <h4>Meta Title</h4>
                            <p><strong>{ blog.meta_title }</strong></p>
                            <h4>Meta Description</h4>
                            <p>{ blog.meta_description }</p>
                            <h4>Meta Keywords</h4>
                            <p>{ blog.meta_keywords }</p>
                        </Card>
                    </Column>
                </Row>}
            </MainContent>
        </div>
    );
}

export default ViewBlog;