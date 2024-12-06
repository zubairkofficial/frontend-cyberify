import { Link, useNavigate, useParams } from "react-router-dom";
import Toolbar from "../../Components/Toolbar";
import MainContent from "../../Components/MainContent";
import FullRow from "../../Components/FullRow";
import Card from "../../Components/Card";
import Row from "../../Components/Row";
import Column from "../../Components/Column";
import TextInput from "../../Components/TextInput";
import { useEffect, useState } from "react";
import { get } from "../../Config/customs";
import BasicSelect from "../../Components/BasicSelect";
import Helper from "../../Config/Helper";
import Spinner from "../../Components/Spinner";
import ImageInput from "../../Components/ImageInput";
import axios from "axios";
import slugify from 'slugify';


const Industry = () => {
  const { id } = useParams();
  
  const defaultIndustry = {
    title: "",
    heading: "",
    description: "",
    contentIntro: {
        heading: "",
        content: "",
      },
    slug: "",
    image: null,
    sections: [],
  };

  const [industry, setIndustry] = useState(defaultIndustry);
  const [contentSections, setContentSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

  // const getIndustry = () => {
  //   if (id) {
  //     axios
  //       .get(`${Helper.apiUrl}industry/single/${id}`, Helper.authHeaders)
  //       .then((response) => {
  //         setIndustry(response.data);
  //         setContentSections(response.data.sections);
  //       });
  //   }
  // };

  const getIndustry = () => {
    if (id) {
      axios
        .get(`${Helper.apiUrl}industry/single/${id}`, Helper.authHeaders)
        .then((response) => {
          const industryData = response.data.industry.industry_data ? JSON.parse(response.data.industry.industry_data) : {};
          console.log(industryData)
          // Destructure industry data and set the states
          setIndustry({
            ...response.data.industry,
            heading: response.data.industry.title,
            description: industryData.heroSection?.description || '',
            contentIntro: {
              heading: industryData.contentIntro?.heading || '',
              content: industryData.contentIntro?.content || ''
            },
            image: response.data.industry.featured_image,
          });
          
          // Set content sections (if any)
          setContentSections(
            industryData.contentSections?.map((section) => ({
              id: section.id,
              heading: section.heading,
              sectionsData: section.sectionsData,
              subsections: section.subsections || []
            })) || []
          );
        })
        .catch((error) => {
          console.error("Error fetching industry:", error);
        });
    }
  };
  

const saveIndustry = () => {
  // Prepare the industry data
  const data = {
    industry_name: industry.title,  // industry_name is the same as industry.title
    industry_slug: slugify(industry.title),  // industry_name is the same as industry.title
    title: industry.heading,  // Title is set as industry.heading
    featured_image: industry.image,  // Featured image to send as file
    industry_data: {
      heroSection: {
        heading: industry.heading,
        description: industry.description,
      },
      tableIntroHeading:{
        id: slugify(industry.contentIntro.heading),
        heading: industry.contentIntro.heading,
        subheadings:[]
      },
      tableOfContents:
        contentSections.map((section) => ({
          id: slugify(section.heading),
          heading: section.heading,
          listItems: section.subsections.map((subsection) => ({
            id: slugify(subsection.subheading),
            text: subsection.subheading,
          })),
        })),
      contentIntro: {
        id: slugify(industry.contentIntro.heading),
        heading: industry.contentIntro.heading,
        content: industry.contentIntro.content,
      },
      contentSections: contentSections.map((section) => ({
        id: slugify(section.heading),
        heading: section.heading,
        sectionsData: section.sectionsData,
        subsections: section.subsections.map((subsection) => ({
          id: slugify(subsection.subheading),
          subheading: subsection.subheading,
          content: subsection.content,
        })),
      })),
    },
  };
  console.log(data)
  // return
  // Prepare form data to include the image file and JSON data
  const formData = new FormData();

  formData.append('industry_name', data.industry_name);
  formData.append('industry_slug', data.industry_slug);
  formData.append('title', data.title);
  formData.append('industry_data', JSON.stringify(data.industry_data));
  // If there's an image file, append it
  if (industry.image instanceof File) {
    formData.append('featured_image', industry.image);
  } else if (industry.image) {
    // If it's a URL (existing image), append a marker to let the API know to keep it
    formData.append('featured_image', null);  // Or any other appropriate logic
  } 
  if (id) {
    formData.append('id', id);
  }
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }
  // return
  // Make the API request to save the industry
  setLoading(true);
  axios
    .post(
      `${Helper.apiUrl}industry/save`,  // Your API endpoint for saving industry
      formData,  // Send the form data with image and JSON
      Helper.authFileHeaders  // Your authorization headers for the request
    )
    .then((response) => {
      Helper.toast("success", response.data.message);
      setCurrentStep(2);
      setIndustry(response.data.industry);
      setContentSections(response.data.sections);
      setErrors({});
      setCurrentStep(2);
    })
    .catch((error) => {
      Helper.toast("error", error.response.data.message);
      setErrors(error.response.data.errors || {});
    })
    .finally(() => {
      setLoading(false);
    });
};


  const addSection = () => {
    setContentSections([
      ...contentSections,
      { id: contentSections.length + 1, heading: "", sectionsData: "", subsections: [] },
    ]);
  };

  const removeSection = (index) => {
    setContentSections(contentSections.filter((_, i) => i !== index));
  };

  const addSubsection = (sectionIndex) => {
    let updatedSections = [...contentSections];
    updatedSections[sectionIndex].subsections.push({
      id: updatedSections[sectionIndex].subsections.length + 1,
      subheading: "",
      content: "",
    });
    setContentSections(updatedSections);
  };

  const removeSubsection = (sectionIndex, subsectionIndex) => {
    let updatedSections = [...contentSections];
    updatedSections[sectionIndex].subsections = updatedSections[
      sectionIndex
    ].subsections.filter((_, i) => i !== subsectionIndex);
    setContentSections(updatedSections);
  };

  useEffect(() => {
    if (currentStep === 2) {
      navigate('/user/industries');
    }
  }, [currentStep]);

  useEffect(() => {
    if (id) {
      getIndustry();
    }
  }, []);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <Toolbar title={"Industry Article"}>
        <Link
          to="/user/industries"
          className="btn btn-sm btn-flex btn-primary fw-bold"
        >
          All Industries
        </Link>
      </Toolbar>
      <MainContent>
  {currentStep === 1 && (
    <FullRow>
      <Card>
        <Row>
          <Column cols={9}>
            <FullRow>
              <h3>Step 1: Add Industry Details</h3>
              <br />
            </FullRow>
            <TextInput
              label="Industry Title"
              required={true}
              value={industry.title || ""}
              onChange={(e) =>
                setIndustry({ ...industry, title: e.target.value })
              }
              error={errors.title ? errors.title[0] : ""}
            />
            <TextInput
              label="Industry Heading"
              required={true}
              value={industry.heading || ""}
              onChange={(e) =>
                setIndustry({ ...industry, heading: e.target.value })
              }
              error={errors.heading ? errors.heading[0] : ""}
            />
            <TextInput
              label="Industry Description"
              placeholder="Industry Description"
              isTextArea={true}
              value={industry.description || ""}
              onChange={(e) =>
                setIndustry({ ...industry, description: e.target.value })
              }
              required={true}
              error={errors.description ? errors.description[0] : ""}
            />

            <FullRow>
              <h3>Content Intro</h3>
              <br />
            </FullRow>
            <TextInput
              label="Content Intro Heading"
              value={industry.contentIntro.heading || ""}
              onChange={(e) =>
                setIndustry({
                  ...industry,
                  contentIntro: {
                    ...industry.contentIntro,
                    heading: e.target.value,
                  },
                })
              }
              required={true}
              error={
                errors.content_intro_heading
                  ? errors.content_intro_heading[0]
                  : ""
              }
            />
            <TextInput
              label="Content Intro Content"
              placeholder="Content Intro"
              isTextArea={true}
              value={industry.contentIntro.content || ""}
              onChange={(e) =>
                setIndustry({
                  ...industry,
                  contentIntro: {
                    ...industry.contentIntro,
                    content: e.target.value,
                  },
                })
              }
              required={true}
              error={
                errors.content_intro_content
                  ? errors.content_intro_content[0]
                  : ""
              }
            />

            <FullRow>
              <div className="d-flex justify-content-start align-items-center">
                <h3>Sections</h3>
                {/* <button
                  type="button"
                  onClick={addSection}
                  className="btn btn-sm btn-primary mx-2"
                >
                  +
                </button> */}
              </div>
              <br />
              {contentSections.map((section, index) => (
                <div key={index} className="section-container">
                  <div className="d-flex justify-content-between">
                    <h3>Section {index + 1}</h3>
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="btn btn-sm btn-outline-danger mx-2"
                      >
                        Remove Section
                      </button>
                    </div>
                  </div>

                  <TextInput
                    label={`Section ${index + 1} Heading`}
                    value={section.heading || ""}
                    onChange={(e) => {
                      let updatedSections = [...contentSections];
                      updatedSections[index].heading = e.target.value;
                      setContentSections(updatedSections);
                    }}
                    required={true}
                    error={
                      errors.sections && errors.sections[index]?.heading
                        ? errors.sections[index].heading[0]
                        : ""
                    }
                  />
                  <TextInput
                    label={`Section ${index + 1} Content`}
                    value={section.sectionsData || ""}
                    isTextArea={true}
                    onChange={(e) => {
                      let updatedSections = [...contentSections];
                      updatedSections[index].sectionsData = e.target.value;
                      setContentSections(updatedSections);
                    }}
                    required={true}
                    error={
                      errors.sections && errors.sections[index]?.content
                        ? errors.sections[index].content[0]
                        : ""
                    }
                  />

                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="subsection-container">
                      <div className="d-flex justify-content-between">
                        <h4>Subsection {subIndex + 1}</h4>
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            onClick={() =>
                              removeSubsection(index, subIndex)
                            }
                            className="btn btn-sm btn-outline-danger mx-2"
                          >
                            Remove Subsection
                          </button>
                        </div>
                      </div>
                      <TextInput
                        label={`Subsection ${subIndex + 1} Heading`}
                        value={subsection.subheading || ""}
                        onChange={(e) => {
                          let updatedSections = [...contentSections];
                          updatedSections[index].subsections[
                            subIndex
                          ].subheading = e.target.value;
                          setContentSections(updatedSections);
                        }}
                        required={true}
                        error={
                          errors.sections &&
                          errors.sections[index]?.subsections &&
                          errors.sections[index].subsections[subIndex]
                            ?.heading
                            ? errors.sections[index].subsections[subIndex]
                                .heading[0]
                            : ""
                        }
                      />
                      <TextInput
                        label={`Subsection ${subIndex + 1} Content`}
                        value={subsection.content || ""}
                        isTextArea={true}
                        onChange={(e) => {
                          let updatedSections = [...contentSections];
                          updatedSections[index].subsections[
                            subIndex
                          ].content = e.target.value;
                          setContentSections(updatedSections);
                        }}
                        required={true}
                        error={
                          errors.sections &&
                          errors.sections[index]?.subsections &&
                          errors.sections[index].subsections[subIndex]
                            ?.content
                            ? errors.sections[index].subsections[subIndex]
                                .content[0]
                            : ""
                        }
                      />
                    </div>
                  ))}
                  <div className="d-flex justify-content-end mt-3">
                    <button
                      type="button"
                      onClick={() => addSubsection(index)}
                      className="btn btn-sm btn-primary mx-2 mb-2"
                    >
                      Add Subsection
                    </button>
                  </div>
                </div>
              ))}
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  onClick={addSection}
                  className="btn btn-sm btn-primary mx-2"
                >
                  Add Section
                </button>
              </div>
            </FullRow>

            <Row>
              <Column className={"simple-flex mt-4"} cols={12}>
                <button
                  className="btn btn-primary btn-loading"
                  onClick={saveIndustry}
                  disabled={loading}
                >
                  {loading && <Spinner />}
                  {loading ? "Please wait..." : "Continue"}
                </button>
                <Link
                  to={`/user/industries`}
                  className="btn btn-outline-danger"
                >
                  Cancel
                </Link>
              </Column>
            </Row>
          </Column>
          <Column cols={3}>
            <Card>
              <FullRow>
                <h3>Industry Image</h3>
                <br />
              </FullRow>
              <ImageInput
                value={industry.image}
                error={errors.image ? errors.image[0] : ""}
                label="Industry Image"
                id={"industry-icon"}
                onChange={(file) =>
                  setIndustry({ ...industry, image: file })
                }
              />
            </Card>
          </Column>
        </Row>
      </Card>
    </FullRow>
  )}
</MainContent>

    </div>
  );
};

export default Industry;
