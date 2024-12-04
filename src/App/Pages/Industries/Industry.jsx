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
    image_name: "",
    sections: [],
  };

  const [industry, setIndustry] = useState(defaultIndustry);
  const [contentSections, setContentSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const navigate = useNavigate();

  const saveIndustry = () => {
    
    const jsonData = {
        heroSection:{
            image:industry.image,
            heading:industry.heading,
            description: industry.description
        },
        contentIntro:{
            id:slugify(industry.contentIntro.heading),
            heading:industry.contentIntro.heading,
            content:industry.contentIntro.content,
        },
        contentSections: contentSections.map((section) => ({
            id:slugify(section.heading),
            heading: section.heading, // Get heading of the section
            sectionsData: section.sectionsData, // Get sectionsData of the section
            subsections: section.subsections.map((subsection) => ({
                id:slugify(subsection.subheading),
                subheading: subsection.subheading,  // Get subheading of the subsection
                content: subsection.content,        // Get content of the subsection
            })),
        })),
    }
      console.log(jsonData);
    // const industryWithSlugs = {
    //     ...industry,
    //     content_intro_heading_slug: slugify(industry.content_intro_heading), // Slug for intro heading
    //     sections: sections.map((section, sectionIndex) => {
    //       const sectionSlug = slugify(section.heading); // Slug for section heading
    //       return {
    //         ...section,
    //         id: sectionSlug, // Add slug as id for the section
    //         heading_slug: sectionSlug, // Slug for section heading
    //         subsections: section.subsections.map((subsection) => {
    //           const subsectionSlug = slugify(subsection.heading); // Slug for subsection heading
    //           return {
    //             ...subsection,
    //             id: subsectionSlug, // Add slug as id for subsection
    //             heading_slug: subsectionSlug, // Slug for subsection heading
    //           };
    //         }),
    //       };
    //     }),
    //   };
    
    //   console.log(industryWithSlugs);      
    // setLoading(true);
    // axios
    //   .post(
    //     `${Helper.apiUrl}industry/save`,
    //     axios.toFormData(industry),
    //     Helper.authFileHeaders
    //   )
    //   .then((response) => {
    //     Helper.toast("success", response.data.message);
    //     setCurrentStep(2);
    //     if (currentStep === 2) {
    //       navigate("/user/industries");
    //     } else {
    //       setIndustry(response.data.industry);
    //       setSections(response.data.sections);
    //       setErrors({});
    //     }
    //   })
    //   .catch((error) => {
    //     Helper.toast("error", error.response.data.message);
    //     setErrors(error.response.data.errors || {});
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

//   const getIndustry = () => {
//     if (id) {
//       axios
//         .get(`${Helper.apiUrl}industry/single/${id}`, Helper.authHeaders)
//         .then((response) => {
//           setIndustry(response.data);
//           setSections(response.data.sections);
//         });
//     }
//   };

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
              value={industry.title}
              onChange={(e) =>
                setIndustry({ ...industry, title: e.target.value })
              }
              error={errors.title ? errors.title[0] : ""}
            />
            <TextInput
              label="Industry Heading"
              required={true}
              value={industry.heading}
              onChange={(e) =>
                setIndustry({ ...industry, heading: e.target.value })
              }
              error={errors.heading ? errors.heading[0] : ""}
            />
            <TextInput
              label="Industry Description"
              placeholder="Industry Description"
              isTextArea={true}
              value={industry.description}
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
              value={industry.content_intro_heading}
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
              value={industry.content_intro_content}
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
                    value={section.heading}
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
                    value={section.sectionsData}
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
                        value={subsection.subheading}
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
                        value={subsection.content}
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
              <TextInput
                label="Image Name"
                required={true}
                value={industry.image_name}
                onChange={(e) =>
                  setIndustry({ ...industry, image_name: e.target.value })
                }
                error={errors.image_name ? errors.image_name[0] : ""}
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
