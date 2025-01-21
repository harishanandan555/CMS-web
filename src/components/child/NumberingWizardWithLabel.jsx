import React, { useState } from "react";
import axios from 'axios';

const NumberingWizardWithLabel = () => {

  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    //part1
    USCISOnlineAcctNumber: '',
    FamilyName: '',
    middleName: '',
    lastName: '',
    countryOfBirth: '',
    checkBox1: false,
    AttorneyStateBarNumber: '',
    Line4USCISOnlineAcctNumber: '',
    Pt1Line9Yes: false,
    Pt1Line9No: false,
    SSN: '',
    AlienNumber0: '',
    DateBecamePermanentResident: '',
    Pt1Line2aMiddleName: '',
    Pt1Line2aGivenName: '',
    Pt1Line2aFamilyName: '',
    Pt1Line2bMiddleName: '',
    Pt1Line2bGivenName: '',
    Pt1Line2bFamilyName: '',
    dateOfBirth: '',
    CountryOfNationality: '',
    StreetNumberName: '',
    Unit1: '',
    Unit2: '',
    Unit3: '',
    AptSteFlrNumber1: '',
    CityOrTown: '',
    State: '',
    ZipCode: '',
    Pt10Line1aCheckbox: false,
    Pt10Line1bCheckbox: false,
    Pt10Line1bLanguage: '',
    Part10Line2Checkbox: false,
    NameofRepresentative: '',
    Email: '',
    DaytimeTelephoneNumber: '',
    MobileTelephoneNumber: '',
    AlienNumber1: '',
    StreetNumberName2: '',
    Unit1_2: '',
    Unit2_2: '',

    //part2
    Pt10Line1a_Checkbox: false,
    Pt10Line1b_Checkbox: false,
    Pt10Line1b_language: '',
    Part10Line2_Checkbox: false,
    Pt10Line2_NameofRepresentative: '',
    Pt3Line4_DaytimeTelephoneNumber3: '',
    Pt3Line5_MobileTelephoneNumber3: '',
    Pt3Line6_Email: '',
    AlienNumber: '',
    P5Line1_SignatureApplicant: '',
    P5Line1_DateofSignature: '',
    familyMemberFirstName: '',
    familyMemberLastName: '',
    relation: '',
    maidenName: '',

    //part3
    Pt4Line1_InterpreterGivenName: '',
    Pt4Line1_InterpreterFamilyName: '',
    Pt4Line2_NameofBusinessorOrgName: '',
    Pt3Line3_StreetNumberName: '',
    Pt3Line3_Unit0: false,
    Pt3Line3_Unit1: false,
    Pt3Line3_Unit2: false,
    Pt3Line3_AptSteFlrNumber: '',
    Pt11Line3_CityOrTown: '',
    Pt3Line3_State: '',
    Pt3Line3_Country: '',
    Pt3Line3_ZipCode: '',
    Pt3Line3_Province: '',
    area4_AlienNumber3: '',
    Pt4Line4_DaytimeTelephoneNumber3: '',
    Pt4Line4_DaytimeTelephoneNumber31: '',
    Pt4Line5_EmailAddress: '',
    Pt4Line6a_NameOfLanguage: '',
    Pt4Line6b_Signature: '',
    Pt4Line6b_DateofSignature: '',

    //part4
    Pt5Line1_PreparerGivenName: '',
    Pt5Line1_PreparerFamilyName: '',
    Pt5Line2_NameofBusinessorOrgName: '',
    Pt12Line3_StreetNumberName: '',
    Pt12Line3_Unit0: false,
    Pt12Line3_Unit1: false,
    Pt12Line3_Unit2: false,
    Pt12Line3_AptSteFlrNumber: '',
    Pt12Line3_CityOrTown: '',
    Pt4Line3_Province: '',
    Pt4Line3_PostalCode: '',
    Pt4Line3_ZipCode: '',
    Pt4Line3_State: '',
    Pt4Line3_Country: '',
    area5_AlienNumber4: '',
    Pt5Line8_Signature: '',
    Pt5Line8_DateofSignature: '',
    Pt5Line6_EmailAddress: '',
    Pt5Line4_PrepDaytimeTelePhoneNumber: '',
    Pt5Line5_PrepMobilePhoneNumber: '',
    Pt4LineCheckbox7: false,
    Pt4LineCheckbox71: false,
    Pt4Checkbox7b_notextends: false,
    Pt4Checkbox7b_extends: false,

    //part5
    Pt1Line1_GivenName1: '',
    Pt1Line1_MiddleName1: '',
    AlienNumber5: '',
    Pt5Line3a_PageNumber: '',
    Pt5Line3b_PartNumber: '',
    Pt5Line3c_ItemNumber: '',
    Pt7Line3d_AdditionalInfo: '',
    Pt7Line4a_PageNumber2: '',
    Pt5Line4b_PartNumber: '',
    Pt5Line4c_ItemNumber: '',
    Pt7Line4d_AdditionalInfo2: '',
    Pt7Line4a_PageNumber1: '',
    Pt5Line5c_ItemNumber: '',
    Pt5Line5b_PartNumber: '',
    Pt7Line4d_AdditionalInfo: '',
    Pt7Line4a_PageNumber: '',
    Pt5Line6b_PartNumber: '',
    Pt5Line6c_ItemNumber: '',
  
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      
      const response = await axios.post('https://fourzerosconsulting-api.onrender.com/fill-pdf', formData, {
        responseType: 'blob',
      });

      // Check if the response is a valid PDF
      if (response.status === 200 && response.data instanceof Blob) {
        // Create a URL for the file and trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'N-300_filled_form.pdf');
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        throw new Error('Received invalid response');
      }

      nextStep();

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`An error occurred while generating the PDF: ${error.message || error}`);
    }
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (

    <div className='col-lg-12'>

      <div className='card'>

        <div className='card-body'>

          <h6 className='mb-4 text-xl'>Numbering wizard with label</h6>

          <p className='text-neutral-500'>
            Fill up your details and proceed next steps.
          </p>

          {/* Form Wizard Start */}
          <div className='form-wizard'>

            <form action='#' method='post'>
            {/* <form onSubmit={handleSubmit}> */}

              <div className='form-wizard-header overflow-x-auto scroll-sm pb-8 my-32'>

                <ul className='list-unstyled form-wizard-list'>

                  <li
                    className={`form-wizard-list__item
                    ${[2, 3, 4, 5, 6, 7].includes(currentStep) && "activated"}
                    ${currentStep === 1 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>1</span>
                    </div>

                    <span className='text text-xs fw-semibold'>
                      PART1{" "}
                    </span>

                  </li>

                  <li
                    className={`form-wizard-list__item
                    ${[3, 4, 5, 6, 7].includes(currentStep) && "activated"}
                    ${currentStep === 2 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>2</span>
                    </div>

                    <span className='text text-xs fw-semibold'>
                    PART2{" "}
                    </span>

                  </li>

                  <li
                    className={`form-wizard-list__item
                    ${[4, 5, 6, 7].includes(currentStep) && "activated"}
                    ${currentStep === 3 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>3</span>
                    </div>

                    <span className='text text-xs fw-semibold'>
                    PART3
                    </span>

                  </li>

                  <li
                    className={`form-wizard-list__item
                      ${[5, 6, 7].includes(currentStep) && "activated"}
                    ${currentStep === 4 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>4</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                    PART4
                    </span>
                  </li>

                  <li
                    className={`form-wizard-list__item
                      ${[6, 7].includes(currentStep) && "activated"}
                    ${currentStep === 5 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>5</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                    PART5
                    </span>
                  </li>

                  <li
                    className={`form-wizard-list__item
                      ${[7].includes(currentStep) && "activated"}
                    ${currentStep === 6 && "active"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>6</span>
                    </div>
                    <span className='text text-xs fw-semibold'>
                    PART6
                    </span>
                  </li>
                  
                  <li
                    className={`form-wizard-list__item

                    ${currentStep === 7 && "activated"} `}
                  >
                    <div className='form-wizard-list__line'>
                      <span className='count'>7</span>
                    </div>
                    <span className='text text-xs fw-semibold'>Completed</span>
                  </li>

                </ul>

              </div>

              {/* <!-- PART1 --> */}
              <fieldset className={`wizard-fieldset ${currentStep === 1 && "show"}`}>
                
                <h6 className='text-md text-neutral-500'>Information About You</h6>

                <div className="row gy-3">

                  <div className="col-sm-6">
                    <label className="form-label">Attorney State Bar Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="AttorneyStateBarNumber"
                      value={formData.AttorneyStateBarNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">USCIS Online Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="USCISOnlineAcctNumber"
                      value={formData.USCISOnlineAcctNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Alien Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="AlienNumber0"
                      value={formData.AlienNumber0}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Family Name (Last Name)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Given Name (First Name)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FamilyName"
                      value={formData.FamilyName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Middle Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="middleName"
                      value={formData.middleName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">U.S. Social Security Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="SSN"
                      value={formData.SSN}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">USCIS Online Account Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Line4USCISOnlineAcctNumber"
                      value={formData.Line4USCISOnlineAcctNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Date of Birth*</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Date You Became a Lawful Permanent Resident</label>
                    <input
                      type="date"
                      className="form-control"
                      name="DateBecamePermanentResident"
                      value={formData.DateBecamePermanentResident}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Country of Birth</label>
                    <input
                      type="text"
                      className="form-control"
                      name="countryOfBirth"
                      value={formData.countryOfBirth}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Country of Citizenship or Nationality</label>
                    <input
                      type="text"
                      className="form-control"
                      name="CountryOfNationality"
                      value={formData.CountryOfNationality}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Street Number and Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="StreetNumberName"
                      value={formData.StreetNumberName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Alien Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="AlienNumber1"
                      value={formData.AlienNumber1}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Name of Representative</label>
                    <input
                      type="text"
                      className="form-control"
                      name="NameofRepresentative"
                      value={formData.NameofRepresentative}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Daytime Telephone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="DaytimeTelephoneNumber"
                      value={formData.DaytimeTelephoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Mobile Telephone Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="MobileTelephoneNumber"
                      value={formData.MobileTelephoneNumber}
                      onChange={handleInputChange}
                    />
                  </div>



                  <div className="col-sm-6">
                    <label className="form-label">Street Number and Name 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="StreetNumberName2"
                      value={formData.StreetNumberName2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Apt/Ste/Flr Number 1</label>
                    <input
                      type="text"
                      className="form-control"
                      maxLength={7}
                      name="AptSteFlrNumber1"
                      value={formData.AptSteFlrNumber1}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">City or Town</label>
                    <input
                      type="text"
                      className="form-control"
                      name="CityOrTown"
                      value={formData.CityOrTown}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="State"
                      value={formData.State}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ZipCode"
                      value={formData.ZipCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Since you were admitted to the United States as a lawful permanent resident, have you been absent for a 
                    period of six months or longer?</label>
                    <label className="form-label">Yes</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="Pt10Line1aCheckbox"
                      checked={formData.Pt10Line1aCheckbox}
                      onChange={handleInputChange}
                    />
                    <label className="form-label">No</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="Pt10Line1bCheckbox"
                      checked={formData.Pt10Line1bCheckbox}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Pt10 Line 1b Language</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt10Line1bLanguage"
                      value={formData.Pt10Line1bLanguage}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Part 10 Line 2 Checkbox</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="Part10Line2Checkbox"
                      checked={formData.Part10Line2Checkbox}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Unit 1 (2)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Unit1_2"
                      value={formData.Unit1_2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Unit 2 (2)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Unit2_2"
                      value={formData.Unit2_2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Unit 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Unit1"
                      value={formData.Unit1}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Unit 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Unit2"
                      value={formData.Unit2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Unit 3</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Unit3"
                      value={formData.Unit3}
                      onChange={handleInputChange}
                    />
                  </div>

                </div>
                
                <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-3">
                  <button
                    onClick={nextStep}
                    type="button"
                    className="form-wizard-next-btn btn btn-primary-600 px-32"
                  >
                    Next
                  </button>
                </div>

              </fieldset>

              {/* <!-- PART2 --> */}
              <fieldset className={`wizard-fieldset ${currentStep === 2 && "show"}`}>

                <h6 className='text-md text-neutral-500'>Applicant's Statement, Contact Information, Declaration, Certification, and Signature</h6>

                <div className="row gy-3">

                  {/* Checkboxes */}
                  <div className="col-sm-6">
                    <label className="form-label">                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="Pt10Line1a_Checkbox"
                      checked={formData.Pt10Line1a_Checkbox}
                      onChange={handleInputChange}
                    />I can read and understand English, and I have read and understand every question and instruction on this application and 
                    my answer to every question. </label>
                  </div>

                  <div className="col-sm-6">

                    <label className="form-label">                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="Pt10Line1b_Checkbox"
                      checked={formData.Pt10Line1b_Checkbox}
                      onChange={handleInputChange}
                    />The interpreter named in Part 3. read to me every question and instruction on this application and my answer to every question in                    <input
                    type="text"
                    className="form-control"
                    name="Pt10Line1b_language"
                    value={formData.Pt10Line1b_language}
                    onChange={handleInputChange}
                    placeholder="Enter language"
                  /> a language in which I am fluent and I understood everything.</label>
                  </div>
                  
                  <div className="col-sm-6">
                    <label className="form-label">
                      <input
                      type="checkbox"
                      className="form-check-input"
                      name="Part10Line2_Checkbox"
                      checked={formData.Part10Line2_Checkbox}
                      onChange={handleInputChange}
                      />
                      At my request, the preparer named in Part 4.
                      <input
                      type="text"
                      className="form-control"
                      name="Pt10Line2_NameofRepresentative"
                      value={formData.Pt10Line2_NameofRepresentative}
                      onChange={handleInputChange}
                      placeholder="Enter representative name"
                    />
                    prepared this application for me based only upon information I provided or authorized.
                    </label>
                  </div>

                  {/* Phone Numbers */}
                  <div className="col-sm-6">
                    <label className="form-label">Daytime Telephone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt3Line4_DaytimeTelephoneNumber3"
                      value={formData.Pt3Line4_DaytimeTelephoneNumber3}
                      onChange={handleInputChange}
                      placeholder="Enter daytime telephone number"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Mobile Telephone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt3Line5_MobileTelephoneNumber3"
                      value={formData.Pt3Line5_MobileTelephoneNumber3}
                      onChange={handleInputChange}
                      placeholder="Enter mobile telephone number"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="Pt3Line6_Email"
                      value={formData.Pt3Line6_Email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Alien Number */}
                  <div className="col-sm-6">
                    <label className="form-label">Alien Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="AlienNumber"
                      value={formData.AlienNumber}
                      onChange={handleInputChange}
                      placeholder="Enter alien number"
                    />
                  </div>

                  {/* Signatures */}
                  <div className="col-sm-6">
                    <label className="form-label">Signature (Applicant)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="P5Line1_SignatureApplicant"
                      value={formData.P5Line1_SignatureApplicant}
                      onChange={handleInputChange}
                      placeholder="Enter signature"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Date of Signature</label>
                    <input
                      type="date"
                      className="form-control"
                      name="P5Line1_DateofSignature"
                      value={formData.P5Line1_DateofSignature}
                      onChange={handleInputChange}
                    />
                  </div>

                </div>
                
                <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-3">
                  <button
                    onClick={prevStep}
                    type="button"
                    className="form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    type="button"
                    className="form-wizard-next-btn btn btn-primary-600 px-32"
                  >
                    Next
                  </button>
                </div>

              </fieldset>

              {/* <!-- PART3 --> */}
              <fieldset className={`wizard-fieldset ${currentStep === 3 && "show"}`}>

                <h6 className='text-md text-neutral-500'>Interpreter's Contact Information, Certification, and Signature</h6>

                <div className="row gy-3">
                  {/* Family Member Info */}
                  <div className="col-sm-6">
                    <label className="form-label">Family Member Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="familyMemberLastName"
                      value={formData.familyMemberLastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                    />
                  </div>
                  
                  <div className="col-sm-6">
                    <label className="form-label">Family Member First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="familyMemberFirstName"
                      value={formData.familyMemberFirstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                    />
                  </div>



                  <div className="col-sm-6">
                    <label className="form-label">Relation</label>
                    <input
                      type="text"
                      className="form-control"
                      name="relation"
                      value={formData.relation}
                      onChange={handleInputChange}
                      placeholder="Enter relation"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Maiden Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="maidenName"
                      value={formData.maidenName}
                      onChange={handleInputChange}
                      placeholder="Enter maiden name"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Interpreter Given Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line1_InterpreterGivenName"
                      value={formData.Pt4Line1_InterpreterGivenName}
                      onChange={handleInputChange}
                      placeholder="Enter interpreter's given name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Interpreter Family Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line1_InterpreterFamilyName"
                      value={formData.Pt4Line1_InterpreterFamilyName}
                      onChange={handleInputChange}
                      placeholder="Enter interpreter's family name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Name of Business or Organization</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line2_NameofBusinessorOrgName"
                      value={formData.Pt4Line2_NameofBusinessorOrgName}
                      onChange={handleInputChange}
                      placeholder="Enter business or organization name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Street Number and Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt3Line3_StreetNumberName"
                      value={formData.Pt3Line3_StreetNumberName}
                      onChange={handleInputChange}
                      placeholder="Enter street number and name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Apartment, Suite, Floor</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt3Line3_AptSteFlrNumber"
                      value={formData.Pt3Line3_AptSteFlrNumber}
                      onChange={handleInputChange}
                      placeholder="Enter apartment, suite, or floor number"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">City or Town</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt11Line3_CityOrTown"
                      value={formData.Pt11Line3_CityOrTown}
                      onChange={handleInputChange}
                      placeholder="Enter city or town"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt3Line3_State"
                      value={formData.Pt3Line3_State}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt3Line3_Country"
                      value={formData.Pt3Line3_Country}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt3Line3_ZipCode"
                      value={formData.Pt3Line3_ZipCode}
                      onChange={handleInputChange}
                      placeholder="Enter zip code"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Province</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt3Line3_Province"
                      value={formData.Pt3Line3_Province}
                      onChange={handleInputChange}
                      placeholder="Enter province"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Daytime Telephone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line4_DaytimeTelephoneNumber3"
                      value={formData.Pt4Line4_DaytimeTelephoneNumber3}
                      onChange={handleInputChange}
                      placeholder="Enter daytime telephone number"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="Pt4Line5_EmailAddress"
                      value={formData.Pt4Line5_EmailAddress}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Language</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line6a_NameOfLanguage"
                      value={formData.Pt4Line6a_NameOfLanguage}
                      onChange={handleInputChange}
                      placeholder="Enter language"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Signature</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line6b_Signature"
                      value={formData.Pt4Line6b_Signature}
                      onChange={handleInputChange}
                      placeholder="Enter signature"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Date of Signature</label>
                    <input
                      type="date"
                      className="form-control"
                      name="Pt4Line6b_DateofSignature"
                      value={formData.Pt4Line6b_DateofSignature}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-3">
                  <button
                    onClick={prevStep}
                    type="button"
                    className="form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    type="button"
                    className="form-wizard-next-btn btn btn-primary-600 px-32"
                  >
                    Next
                  </button>
                </div>
              </fieldset>

              {/* <!-- PART4 --> */}
              <fieldset className={`wizard-fieldset ${currentStep === 4 && "show"}`}>
                <h6 className='text-md text-neutral-500'>Contact Information, Declaration, and Signature of the Person Preparing this Application, if 
                Other Than the Applicant</h6>

                <div className="row gy-3">
                  {/* Preparer Name */}
                  <div className="col-sm-6">
                    <label className="form-label">Preparer Given Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line1_PreparerGivenName"
                      value={formData.Pt5Line1_PreparerGivenName}
                      onChange={handleInputChange}
                      placeholder="Enter preparer given name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Preparer Family Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line1_PreparerFamilyName"
                      value={formData.Pt5Line1_PreparerFamilyName}
                      onChange={handleInputChange}
                      placeholder="Enter preparer family name"
                    />
                  </div>
                  
                  {/* Name of Business or Organization */}
                  <div className="col-sm-6">
                    <label className="form-label">Name of Business or Organization</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line2_NameofBusinessorOrgName"
                      value={formData.Pt5Line2_NameofBusinessorOrgName}
                      onChange={handleInputChange}
                      placeholder="Enter name of business or organization"
                    />
                  </div>
                  
                  {/* Address Fields */}
                  <div className="col-sm-6">
                    <label className="form-label">Street Number and Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt12Line3_StreetNumberName"
                      value={formData.Pt12Line3_StreetNumberName}
                      onChange={handleInputChange}
                      placeholder="Enter street number and name"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Unit 0</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt12Line3_Unit0"
                      value={formData.Pt12Line3_Unit0}
                      onChange={handleInputChange}
                      placeholder="Enter unit 0"
                    />
                  </div>
                  
                  {/* Additional Address Details */}
                  <div className="col-sm-6">
                    <label className="form-label">Apartment/Ste/Floor Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt12Line3_AptSteFlrNumber"
                      value={formData.Pt12Line3_AptSteFlrNumber}
                      onChange={handleInputChange}
                      placeholder="Enter apartment/ste/floor number"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">City or Town</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt12Line3_CityOrTown"
                      value={formData.Pt12Line3_CityOrTown}
                      onChange={handleInputChange}
                      placeholder="Enter city or town"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Province</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line3_Province"
                      value={formData.Pt4Line3_Province}
                      onChange={handleInputChange}
                      placeholder="Enter province"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line3_PostalCode"
                      value={formData.Pt4Line3_PostalCode}
                      onChange={handleInputChange}
                      placeholder="Enter postal code"
                    />
                  </div>
                  
                  {/* Zip Code, State, Country */}
                  <div className="col-sm-6">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line3_ZipCode"
                      value={formData.Pt4Line3_ZipCode}
                      onChange={handleInputChange}
                      placeholder="Enter zip code"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line3_State"
                      value={formData.Pt4Line3_State}
                      onChange={handleInputChange}
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt4Line3_Country"
                      value={formData.Pt4Line3_Country}
                      onChange={handleInputChange}
                      placeholder="Enter country"
                    />
                  </div>
                  
                  {/* Contact Information */}
                  <div className="col-sm-6">
                    <label className="form-label">Alien Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="area5_AlienNumber4"
                      value={formData.area5_AlienNumber4}
                      onChange={handleInputChange}
                      placeholder="Enter alien number"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Signature</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line8_Signature"
                      value={formData.Pt5Line8_Signature}
                      onChange={handleInputChange}
                      placeholder="Enter signature"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Date of Signature</label>
                    <input
                      type="date"
                      className="form-control"
                      name="Pt5Line8_DateofSignature"
                      value={formData.Pt5Line8_DateofSignature}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="Pt5Line6_EmailAddress"
                      value={formData.Pt5Line6_EmailAddress}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Daytime Telephone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line4_PrepDaytimeTelePhoneNumber"
                      value={formData.Pt5Line4_PrepDaytimeTelePhoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter daytime telephone number"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Mobile Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line5_PrepMobilePhoneNumber"
                      value={formData.Pt5Line5_PrepMobilePhoneNumber}
                      onChange={handleInputChange}
                      placeholder="Enter mobile phone number"
                    />
                  </div>
                  
                  {/* Checkbox Section */}
                  <div className="col-sm-6">
                    <label className="form-label">Checkbox 7</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="Pt4LineCheckbox7"
                      checked={formData.Pt4LineCheckbox7}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Checkbox 71</label>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      name="Pt4LineCheckbox71"
                      checked={formData.Pt4LineCheckbox71}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-3">
                  <button
                    onClick={prevStep}
                    type="button"
                    className="form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    type="button"
                    className="form-wizard-next-btn btn btn-primary-600 px-32"
                  >
                    Next
                  </button>
                </div>
              </fieldset>

              {/* <!-- PART5 --> */}
              <fieldset className={`wizard-fieldset ${currentStep === 5 && "show"}`}>

                <h6 className='text-md text-neutral-500'>Additional Information</h6>

                <div className="row gy-3">
                  {/* New Fields */}
                  <div className="col-sm-6">
                    <label className="form-label">Given Name 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt1Line1_GivenName1"
                      value={formData.Pt1Line1_GivenName1}
                      onChange={handleInputChange}
                      placeholder="Enter Given Name 1"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Middle Name 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt1Line1_MiddleName1"
                      value={formData.Pt1Line1_MiddleName1}
                      onChange={handleInputChange}
                      placeholder="Enter Middle Name 1"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Alien Number 5</label>
                    <input
                      type="text"
                      className="form-control"
                      name="AlienNumber5"
                      value={formData.AlienNumber5}
                      onChange={handleInputChange}
                      placeholder="Enter Alien Number 5"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Page Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line3a_PageNumber"
                      value={formData.Pt5Line3a_PageNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Page Number"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Part Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line3b_PartNumber"
                      value={formData.Pt5Line3b_PartNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Part Number"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Item Number</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line3c_ItemNumber"
                      value={formData.Pt5Line3c_ItemNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Item Number"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Additional Information</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt7Line3d_AdditionalInfo"
                      value={formData.Pt7Line3d_AdditionalInfo}
                      onChange={handleInputChange}
                      placeholder="Enter Additional Information"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Page Number 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt7Line4a_PageNumber2"
                      value={formData.Pt7Line4a_PageNumber2}
                      onChange={handleInputChange}
                      placeholder="Enter Page Number 2"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Part Number 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line4b_PartNumber"
                      value={formData.Pt5Line4b_PartNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Part Number 2"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Item Number 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line4c_ItemNumber"
                      value={formData.Pt5Line4c_ItemNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Item Number 2"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Additional Information 2</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt7Line4d_AdditionalInfo2"
                      value={formData.Pt7Line4d_AdditionalInfo2}
                      onChange={handleInputChange}
                      placeholder="Enter Additional Information 2"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Page Number 1</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt7Line4a_PageNumber1"
                      value={formData.Pt7Line4a_PageNumber1}
                      onChange={handleInputChange}
                      placeholder="Enter Page Number 1"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Item Number 3</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line5c_ItemNumber"
                      value={formData.Pt5Line5c_ItemNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Item Number 3"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Part Number 3</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line5b_PartNumber"
                      value={formData.Pt5Line5b_PartNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Part Number 3"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Additional Information 3</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt7Line4d_AdditionalInfo"
                      value={formData.Pt7Line4d_AdditionalInfo}
                      onChange={handleInputChange}
                      placeholder="Enter Additional Information 3"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Page Number 3</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt7Line4a_PageNumber"
                      value={formData.Pt7Line4a_PageNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Page Number 3"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Part Number 4</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line6b_PartNumber"
                      value={formData.Pt5Line6b_PartNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Part Number 4"
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="form-label">Item Number 4</label>
                    <input
                      type="text"
                      className="form-control"
                      name="Pt5Line6c_ItemNumber"
                      value={formData.Pt5Line6c_ItemNumber}
                      onChange={handleInputChange}
                      placeholder="Enter Item Number 4"
                    />
                  </div>
                </div>

                <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-3">
                  <button
                    onClick={prevStep}
                    type="button"
                    className="form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    type="button"
                    className="form-wizard-next-btn btn btn-primary-600 px-32"
                  >
                    Next
                  </button>
                </div>
                
              </fieldset>

              {/* <!-- PART6 --> */}
              <fieldset className={`wizard-fieldset ${currentStep === 6 && "show"}`}>
                <h6 className='text-md text-neutral-500'>Declaration of Intention</h6>
                <div className='row gy-3'>
                  <div className='col-sm-6'>
                    <label className='form-label'>Receipt Number*</label>
                    <input type='text' className='form-control wizard-required' placeholder='Enter Receipt Number' required='' value="IOE1234567890" />
                  </div>
                  <div className='col-sm-6'>
                    <label className='form-label'>Receipt Numbers*</label>
                    <input type='text' className='form-control wizard-required' placeholder='Enter Receipt Numbers' required='' value="ABC1234567890, efg1234567890" />
                  </div>
                </div>
                <div className="form-group d-flex align-items-center justify-content-end gap-8 mt-3">
                  <button
                    onClick={prevStep}
                    type="button"
                    className="form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    // onClick={nextStep}
                    type="button"
                    className="form-wizard-next-btn btn btn-primary-600 px-32"
                  >
                    submit
                  </button>
                </div>
              </fieldset>

              {/* <!-- COMPLETED --> */}
              <fieldset className={`wizard-fieldset ${currentStep === 7 && "show"} `}>

                <div className='text-center mb-40'>
                  <img
                    src='assets/images/gif/success-img3.gif'
                    alt=''
                    className='gif-image mb-24'
                  />
                  <h6 className='text-md text-neutral-600'>PDF successfully created</h6>
                  <p className='text-neutral-400 text-sm mb-0'>
                    Well done! You have successfully completed.
                  </p>
                  <button
                    onClick={prevStep}
                    type="button"
                    className="form-wizard-previous-btn btn btn-neutral-500 border-neutral-100 px-32"
                  >
                    Back
                  </button>
                </div>
              </fieldset>  

            </form>

          </div>
          {/* Form Wizard End */}

        </div>
      </div>
    </div>
  );
};

export default NumberingWizardWithLabel;
 
