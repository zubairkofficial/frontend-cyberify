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
import slugify from "slugify";
import MultiSelect from "../../Components/MultiSelect";
import QuillEditor from "../../Components/QuillEditor";

const Industry = () => {
  const { id } = useParams();

  const defaultIndustry = {
    title: "",
    heading: "",
    slug: "",
    image: null,
    emailData: "",
    emailImage : null,
    sections: [],
  };

  const [industry, setIndustry] = useState(defaultIndustry);
  const [useCases, setUseCases] = useState([]);
  const [selectedUseCases, setSelectedUseCases] = useState([]);
  // const [selectedUseCase, setSelectedUseCase] = useState();
  const [contentSections, setContentSections] = useState([]);
  const [subsections, setSubsections] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  console.log("editlog", industry);
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch all use cases when the component mounts
    axios
      .get(`${Helper.apiUrl}usecase/all`, Helper.authHeaders)
      .then((response) => {
        // Extract only the 'id' and 'name' from the response
        const filteredUseCases = response.data.map((useCase) => ({
          id: useCase.id,
          name: useCase.name,
        }));
        setUseCases(filteredUseCases); // Store the filtered use cases
      })
      .catch((error) => {
        console.error("Error fetching use cases:", error);
      });
  }, []);

  const handleUseCaseChange = (selectedOptions) => {
    console.log(selectedOptions);
    setSelectedUseCases(selectedOptions);
  };

  useEffect(() => {
    console.log(selectedUseCases);
  }, [selectedUseCases]);

  const getIndustry = () => {
    if (id) {
      axios
        .get(`${Helper.apiUrl}industry/single/${id}`, Helper.authHeaders)
        .then((response) => {
          const industryData = response.data.industry.industry_data
            ? JSON.parse(response.data.industry.industry_data)
            : {};
          console.log(industryData);
          console.log(response.data);
          // Destructure industry data and set the states
          setIndustry({
            ...response.data.industry,
            title: response.data.industry.industry_name,
            heading: response.data.industry.title,
            emailData: response.data.industry.email_data,
            description: industryData.heroSection?.description || "",
            contentIntro: {
              heading: industryData.contentIntro?.heading || "",
              content: industryData.contentIntro?.content || "",
            },
            image: response.data.industry.featured_image,
            emailImage: response.data.industry.email_image,
          });
          setSelectedUseCases(
            response.data.industry.use_case
              ? JSON.parse(response.data.industry.use_case)
              : []
          );

          // Set content sections (if any)
          setContentSections(
            industryData.contentSections?.map((section) => ({
              id: section.id,
              heading: section.heading,
              sectionsData: section.sectionsData,
              sectionsImage: section.sectionsImage,
              emailImage: section.emailImage,
              emailData: section.emailData,
              subsections: section.subsections || [],
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
      industry_name: industry.title, // industry_name is the same as industry.title
      industry_slug: slugify(industry.title), // industry_name is the same as industry.title
      title: industry.heading, // Title is set as industry.heading
      featured_image: industry.image, // Featured image to send as file
      email_image: industry.emailImage,
      email_data: industry.emailData, 
      use_case: selectedUseCases,
      industry_data: {
        heroSection: {
          heading: industry.heading,
        },
        contentSections: contentSections.map((section) => ({
          id: slugify(section.heading),
          heading: section.heading,
          sectionsData: section.sectionsData,
          sectionsImage: section.sectionsImage,
          subsections: section.subsections.map((subsection) => ({
            id: slugify(subsection.subheading),
            subheading: subsection.subheading,
            content: subsection.content,
            subsectionimage: subsection.subsectionimage,
          })),
        })),
      },
    };
    const formData = new FormData();

    // Add main fields
    formData.append("industry_name", industry.title);
    formData.append("industry_slug", slugify(industry.title));
    formData.append("title", industry.heading);
    formData.append("email_data", industry.emailData);
    formData.append("use_case", JSON.stringify(selectedUseCases));

    // Add images and JSON for `contentSections`
    const industryData = { ...data.industry_data, contentSections: [] };
    contentSections.forEach((section, sectionIndex) => {
      const sectionData = {
        id: slugify(section.heading),
        heading: section.heading,
        sectionsData: section.sectionsData,
        subsections: section.subsections.map((subsection, subIndex) => ({
          id: slugify(subsection.subheading),
          subheading: subsection.subheading,
          content: subsection.content,
          // Preserve existing subsection images
          subsectionimage:
            subsection.subsectionimage instanceof File
              ? null // Don't include the File object in JSON, it's sent in FormData
              : subsection.subsectionimage,
        })),
      };

      // Add section image if it's a File
      if (section.sectionsImage instanceof File) {
        formData.append(
          `contentSections[${sectionIndex}][sectionsImage]`,
          section.sectionsImage
        );
      } else {
        // Preserve existing image for the section
        sectionData.sectionsImage = section.sectionsImage;
      }

      // Add subsection images if they are Files
      section.subsections.forEach((subsection, subIndex) => {
        if (subsection.subsectionimage instanceof File) {
          formData.append(
            `contentSections[${sectionIndex}][subsections][${subIndex}][subsectionimage]`,
            subsection.subsectionimage
          );
        }
      });

      industryData.contentSections.push(sectionData);
    });

    formData.append("industry_data", JSON.stringify(industryData));

    // Add featured image if it's a File
    if (industry.image instanceof File) {
      formData.append("featured_image", industry.image);
    }

    if (industry.emailImage instanceof File) {
      formData.append("email_image", industry.emailImage);
    }

    // Include ID if updating
    if (id) {
      formData.append("id", id);
    }

    // Debug formData entries
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    // Send request
    setLoading(true);
    axios
      .post(`${Helper.apiUrl}industry/save`, formData, Helper.authFileHeaders)
      .then((response) => {
        Helper.toast("success", response.data.message);
        setCurrentStep(2);
        setIndustry(response.data.industry);
        setContentSections(response.data.sections);
        setErrors({});
      })
      .catch((error) => {
        Helper.toast("error", error.response.data.message);
        setErrors(error.response.data.errors || {});
      })
      .finally(() => setLoading(false));
  };

  const addSection = () => {
    setContentSections([
      ...contentSections,
      {
        id: contentSections.length + 1,
        heading: "",
        sectionsData: "",
        subsections: [],
      },
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
      subsectionimage: null,
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
      navigate("/user/industries");
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
                  <FullRow>
                    <MultiSelect
                      label="Select Use Cases"
                      placeholder="Use Cases"
                      value={selectedUseCases}
                      onChange={handleUseCaseChange}
                      options={useCases}
                      isObject={true}
                      optionValue="id"
                      optionLabel="name"
                    />

                    {/* <BasicSelect options={useCases} isObject={true} optionLabel="name" optionValue="id" label="Select Use Case" required={true} 
                                        value={selectedUseCase} onChange={e => setSelectedUseCase(e.target.value)} /> */}
                  </FullRow>
                  {/* <FullRow>
                    <QuillEditor
                      label="Email Data"
                      value={industry.emailData || ""}
                      isTextArea={true}
                      onChange={(content) =>
                        setIndustry({ ...industry, emailData: content })
                      }
                      required={false}
                    />

                    <ImageInput
                      value={industry.emailImage}
                      label="Email Section Image"
                      onChange={(file1) => {
                        setIndustry({ ...industry, emailImage: file1 })
                      }}
                      id={"email-image-icon"}
                    />
                  </FullRow> */}
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
                        <QuillEditor
                          label={`Section ${index + 1} Content`}
                          value={section.sectionsData || ""}
                          isTextArea={true}
                          onChange={(content) => {
                            let updatedSections = [...contentSections];
                            updatedSections[index].sectionsData = content;
                            setContentSections(updatedSections);
                          }}
                          required={true}
                          error={
                            errors.sections && errors.sections[index]?.content
                              ? errors.sections[index].content[0]
                              : ""
                          }
                        />

                        <ImageInput
                          value={section.sectionsImage}
                          error={errors.image ? errors.image[0] : ""}
                          label="Section Image"
                          id={`section-image-${index}`}
                          onChange={(file) => {
                            let updateSections = [...contentSections];
                            updateSections[index].sectionsImage = file;
                            setContentSections(updateSections);
                          }}
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
                            {/* <TextInput
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
                            /> */}
                            <QuillEditor
                              label={`Subsection ${subIndex + 1} Content`}
                              value={subsection.content || ""}
                              isTextArea={true}
                              onChange={(content) => {
                                let updatedSections = [...contentSections];
                                updatedSections[index].subsections[
                                  subIndex
                                ].content = content;
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
                            <ImageInput
                              value={subsection.subsectionimage}
                              error={errors.image ? errors.image[0] : ""}
                              label="Subsection Image"
                              id={`subsection-image-${index}-${subIndex}`}
                              onChange={(file) => {
                                let updatedSections = [...contentSections];
                                updatedSections[index].subsections[
                                  subIndex
                                ].subsectionimage = file;
                                setContentSections(updatedSections);
                              }}
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
