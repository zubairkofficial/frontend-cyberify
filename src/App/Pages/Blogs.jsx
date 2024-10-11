import { Link } from "react-router-dom";
import Toolbar from "../Components/Toolbar";
import MainContent from "../Components/MainContent";
import { useEffect, useState } from "react";
import { get } from "../Config/customs";
import FullRow from "../Components/FullRow";
import Card from "../Components/Card";
import NothingFound from "../Components/NothingFound";
import Helper from "../Config/Helper";
import Moment from "react-moment";
import Dropdown from "../Components/Dropdown";
import DropdownLink from "../Components/DrowdownLink";

const Blogs = () => {

    const [blogs, setBlogs] = useState([]);

    const getBlogs = async () => setBlogs(await get('blog/all'));

    const deleteBlog = (id) => {
        axios.get(`${Helper.apiUrl}blog/delete/${id}`, Helper.authHeaders).then(response => {
            getBlogs();
        });
    }

    useEffect(() => {
        getBlogs();
    }, []);

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={"All Blogs"}>
                <Link to="/user/create-blog" className="btn btn-sm btn-flex btn-primary fw-bold">
                    Create Blog Article
                </Link>
            </Toolbar>
            <MainContent>
                <FullRow>
                    <Card>
                        {blogs.length > 0 ? <table className="table align-middle table-row-dashed fs-7 gy-5">
                            <thead>
                                <tr className="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Created At</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogs.map(blog => {
                                    return (
                                        <tr key={blog.id}>
                                            <td>
                                                <img className="service-icon" src={ Helper.serverImage(blog.featured_image) } />
                                            </td>
                                            <td>{ blog.title }</td>
                                            <td>{ blog.blog_category.name }</td>
                                            <td><Moment format="MMMM Do YYYY">{blog.created_at}</Moment></td>
                                            <td className="text-end">
                                                <Dropdown>
                                                    <DropdownLink link={`/user/blog/view/${blog.id}/${blog.slug}`} text={'View Article'} />
                                                    <DropdownLink link={`/user/blog/edit/${blog.id}/${blog.slug}`} text={'Edit Article'} />
                                                    <DropdownLink isbutton={true} onClick={() => deleteBlog(blog.id)} text={'Delete Article'} isdanger={true} />
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

export default Blogs;