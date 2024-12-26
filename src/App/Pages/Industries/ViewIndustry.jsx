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

const ViewIndustry = () => {
    const { id } = useParams(); // You can get id from the URL
    const [industry, setIndustry] = useState({});
    const [contentSections, setContentSections] = useState([]);
    const [useCases, setUseCases] = useState([]); // To store the use case names
    const navigate = useNavigate();


    const getAllUseCases = () => {
        axios
            .get(`${Helper.apiUrl}usecase/all`, Helper.authHeaders)
            .then((response) => {
                console.log(response)
                const useCasesData = response.data.map(useCase => ({
                    id: useCase.id,
                    name: useCase.name
                }));
                setUseCases(useCasesData); // Store the use cases
                console.log(useCasesData)
            })
            .catch((error) => {
                console.error("Error fetching use cases:", error);
            });
    };

    const getIndustry = () => {
        if (id) {
            axios
                .get(`${Helper.apiUrl}industry/single/${id}`, Helper.authHeaders)
                .then((response) => {
                    console.log(response)
                    const industryData = response.data.industry.industry_data
                        ? JSON.parse(response.data.industry.industry_data)
                        : {};

                    setIndustry({
                        ...response.data.industry,
                        heading: response.data.industry.title,
                        description: industryData.heroSection?.description || '',
                        contentIntro: {
                            heading: industryData.contentIntro?.heading || '',
                            content: industryData.contentIntro?.content || ''
                        },
                        image: response.data.industry.featured_image,
                        use_cases : response.data.industry.use_cases_data
                    });

                    setContentSections(
                        industryData.contentSections?.map((section) => ({
                            id: section.id,
                            heading: section.heading,
                            sectionsData: section.sectionsData,
                            subsections: section.subsections || [],
                        })) || []
                    );
                })
                .catch((error) => {
                    console.error("Error fetching industry:", error);
                });
        }
    };

    useEffect(() => {
        getAllUseCases();

        getIndustry();
    }, [id]);

    // const selectedUseCaseNames = industry.use_cases
    // ? industry.use_cases.map(id => {

    //     const useCase = useCases.find(useCase => useCase.id === id);
    //     return useCase ? useCase.name : null;
    // }).filter(name => name !== null)
    // : [];

    return (
        <div className="d-flex flex-column flex-column-fluid">
            <Toolbar title={industry.heading || "Industry Details"}>
                <Link to="/user/industries" className="btn btn-sm btn-flex btn-primary fw-bold">
                    All Industries
                </Link>
                {/* Optional Edit button if applicable */}
                {/* <Link to={`/user/industry/edit/${id}`} className="btn btn-sm btn-flex btn-default fw-bold ml-10">
                    <i className="fa-light fa-pen-to-square"></i> Edit Industry
                </Link> */}
            </Toolbar>
            <MainContent>
                {industry.heading && (
                    <Row>
                        <Column cols={8}>
                            <Card>
                                <h3>{industry.heading}</h3>
                                <p>{industry.description}</p>
                                <br />
                                {/* <h4>Intro Section</h4> */}
                                <h5>{industry.contentIntro?.heading}</h5>
                                <p>{industry.contentIntro?.content}</p>
                                <div>
                                    <h5>Use Cases</h5>
                                    {industry.use_cases_data.length > 0 ? (
                                    <ul className="d-flex gap-2 list-style-none">
                                        {industry.use_cases_data.map((useCase, index) => (
                                        <li key={index}>{useCase.name}</li>
                                        ))}
                                    </ul>
                                    )  
                                    : (
                                        <p>No use cases assigned</p>
                                    )}
                                </div>
                                <div>
                                    {/* <h4>Content Sections</h4> */}
                                    {contentSections.map((section) => (
                                        <div key={section.id}>
                                            <h5>{section.heading}</h5>
                                            <div>
                                                {section.sectionsData && (
                                                    <p>{section.sectionsData}</p>
                                                )}
                                                {section.subsections.length > 0 && (
                                                    <div>
                                                            {section.subsections.map((subsection, index) => (
                                                                <p><span style={{fontWeight:"bold"}}>{subsection.subheading}: </span>{subsection.content}</p>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </Column>
                        <Column cols={4}>
                            <Card>
                                <h4>Featured Image</h4>
                                <img
                                    src={Helper.serverImage(industry.featured_image)}
                                    className="blog-featured-image"
                                    alt="Industry Featured"
                                />
                            </Card>
                        </Column>
                    </Row>
                )}
            </MainContent>
        </div>
    );
};

export default ViewIndustry;
