import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { db } from "./firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const schema = yup.object().shape({
    name: yup.string().required("Please enter name"),
    dob: yup.string().required("Date of birth required"),
    sex: yup.string().required("Please select sex"),
    mobileNumber: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        "Mobile number must be a valid Indian mobile number"
      )
      .nullable(),

    idType: yup.string().required("ID type is required"),

    emergencyNumber: yup
      .string()
      .matches(
        /^[6-9]\d{9}$/,
        "Emergency Contact Number must be a valid Indian mobile number"
      )
      .nullable(),
  });
  const [countries, setCountries] = useState([]);
  const [, setCountryName] = useState("");
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const userCollectionRef = collection(db, "users");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    console.log(data);
    navigate("/userdetails");
    return addDoc(userCollectionRef, {
      name: data.name,
      age: data.dob,
      sex: data.sex,
      mobile_number: data.mobileNumber || "",
      govtId: data.idType || "",
      gaurdian_name: data.gaurdianName || "",
      email: data.email || "",
      emergency_contact_number: data.emergencyNumber || "",
      address: data.address || "",
      country: data.country || "",
      state: data.state || "",
      city: data.city || "",
      pincode: data.pincode || "",
      occupation: data.occupation || "",
      religion: data.religion || "",
      marital_status: data.maritalStatus || "",
      blood_group: data.bloodGroup || "",
      nationality: data.nationality || "",
    });
  };

  useEffect(() => {
    let newCountryList = Country.getAllCountries();
    const updateCountries = newCountryList.map((country) => ({
      label: country.name,
      value: country.isoCode,
      ...country,
    }));
    setCountries(updateCountries);
  }, []);

  const handleCountryChange = (selectedCountry) => {
    console.log("country", selectedCountry.name);
    setCountryName(selectedCountry.name);
    let states = State.getStatesOfCountry(selectedCountry.value);
    if (states.length === 0) {
      states = State.getStatesOfCountry(selectedCountry.isoCode);
    }
    setStates(
      states.map((state) => ({
        label: state.name,
        value: state.value || state.isoCode,
        isoCode: selectedCountry.isoCode,
      }))
    );
    setCities([]);
  };

  const handleStateChange = (selectedState) => {
    const cities = City.getCitiesOfState(
      selectedState.isoCode,
      selectedState.value
    );

    setCities(cities.map((city) => ({ label: city.name, value: city.name })));
    console.log("city", cities);
  };

  const handleCityChange = () => {};

  const addRecord = async () => {};
  return (
    <div className="user-form">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="head-section">Personal Details</label>
        <div className="personal-details">
          <div className="input-field">
            <label>
              Name<sup className="required">*</sup>
            </label>
            <input
              type="text"
              placeholder="Enter name"
              {...register("name", {
                required: true,
                max: 20,
                min: 1,
                maxLength: 80,
              })}
            />
            {errors.name && (
              <span className="errors">{errors.name?.message}</span>
            )}
          </div>
          <div className="input-field">
            <label>
              Date of Birth or Age<sup className="required">*</sup>
            </label>
            <input
              type="date"
              placeholder="Date of Birth"
              {...register("dob", { required: true })}
            />
            <span className="errors">{errors.dob?.message}</span>
          </div>
          <div className="input-field">
            <label>
              Sex<sup className="required">*</sup>
            </label>
            <select {...register("sex", { required: true })}>
              <option value="">---Select Sex---</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
            <span className="errors">{errors.sex?.message}</span>
          </div>
        </div>
        <div className="personal-details">
          <div className="input-field">
            <label>Mobile</label>
            <input
              type="tel"
              placeholder="Mobile number"
              {...register("mobileNumber", { required: true, maxLength: 10 })}
            />
            {errors.mobileNumber && (
              <span className="errors">{errors.mobileNumber?.message}</span>
            )}
          </div>
          <div className="input-field">
            <label htmlFor="idType">Card Type:</label>
            <select {...register("idType")}>
              <option value="">--Select--</option>
              <option value="Aadhar">Aadhar</option>
              <option value="Pan">PAN</option>
            </select>
            {errors.idType && <p className="errors">{errors.idType.message}</p>}
            <label htmlFor="cardNumber">Card Number:</label>
            <input
              type="text"
              {...register("id")}
              placeholder={
                watch("idType") === ""
                  ? "select card Type"
                  : watch("idType") === "Aadhar"
                  ? "Enter Aadhar card number"
                  : "Enter Pan card number"
              }
            />
            {errors.id && <p className="errors">{errors.id.message}</p>}
          </div>
        </div>
        <label className="head-section">Contact Details</label>
        <div className="personal-details">
          <div className="input-field">
            <label>Guardian Details</label>
            <select {...register("gaurdianLabel", { required: true })}>
              <option value="">Select Label</option>
              <option value="mr">Mr</option>
              <option value="mrs">Mrs</option>
              <option value="miss">Miss</option>
              <option value="dr">Dr</option>
            </select>

            <input
              type="text"
              placeholder="Enter Guardian Name"
              {...register("gaurdianName", {
                required: true,
                max: 20,
                min: 1,
                maxLength: 80,
              })}
            />
          </div>
          <div className="input-field">
            <label>Email</label>
            <input
              type="text"
              placeholder="Email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            />
          </div>
          <div className="input-field">
            <label>Emergency Contact Number</label>
            <input
              type="tel"
              placeholder="Emergency Contact Number"
              {...register("emergencyNumber", {
                required: true,
                maxLength: 10,
              })}
            />
            {errors.emergencyNumber && (
              <span className="errors">{errors.emergencyNumber?.message}</span>
            )}
          </div>
        </div>
        <label className="head-section">Address Details</label>
        <div className="personal-details">
          <div className="input-field">
            <label>Address</label>
            <input
              type="text"
              placeholder="Enter Address"
              {...register("address", { required: true })}
            />
          </div>
          <div className="input-field">
            <label>State</label>
            <Select
              {...register("state", { required: true })}
              id="state"
              name="state"
              label="state"
              options={states}
              value={watch("state")}
              onChange={handleStateChange}
            />
          </div>
          <div className="input-field">
            <label>City</label>
            <Select
              {...register("city", { required: true })}
              id="city"
              name="city"
              label="city"
              value={watch("city")}
              options={cities}
              onChange={handleCityChange}
            />
          </div>
          <div className="input-field">
            <label>Country</label>
            <Select
              {...register("country", { required: true })}
              id="country"
              name="country"
              label="country"
              options={countries}
              value={watch("country")}
              onChange={handleCountryChange}
            />
          </div>
          <div className="input-field">
            <label>Pincode</label>
            <input
              type="text"
              placeholder="Pincode"
              {...register("pincode", { required: true, max: 6 })}
            />
          </div>
        </div>

        <label className="head-section">Other Details</label>
        <div className="personal-details">
          <div className="input-field">
            <label>Occupation</label>
            <input
              type="text"
              placeholder="Enter Occupation"
              {...register("occupation", { required: true })}
            />
          </div>
          <div className="input-field">
            <label>Religion</label>
            <select {...register("religion", { required: true })}>
              <option value="">---Select Religion---</option>
              <option value="hindu">Hindu</option>
              <option value="muslim">Muslim</option>
              <option value="crishtian">Crishtian</option>
            </select>
          </div>
          <div className="input-field">
            <label>Marital Status</label>
            <select {...register("maritalStatus", { required: true })}>
              <option value="">---Select Marital Status---</option>
              <option value="married">Married</option>
              <option value="unmarried">Unmarried</option>
            </select>
          </div>
          <div className="input-field">
            <label>Blood Group</label>
            <select {...register("bloodGroup", { required: true })}>
              <option value="">---Select Group---</option>
              <option value="A+">A+</option>
              <option value="B+">B+</option>
              <option value="O+">O+</option>
              <option value="AB+">AB+</option>
              <option value="A-">A-</option>
              <option value="B-">B-</option>
              <option value="O-">O-</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>
        <div className="input-field">
          <label>Nationality</label>
          <select {...register("nationality", { required: true })}>
            <option value="">---Select Nationality---</option>
            <option value="afghan">Afghan</option>
            <option value="albanian">Albanian</option>
            <option value="algerian">Algerian</option>
            <option value="american">American</option>
            <option value="andorran">Andorran</option>
            <option value="angolan">Angolan</option>
            <option value="antiguans">Antiguans</option>
            <option value="argentinean">Argentinean</option>
            <option value="armenian">Armenian</option>
            <option value="australian">Australian</option>
            <option value="austrian">Austrian</option>
            <option value="azerbaijani">Azerbaijani</option>
            <option value="bahamian">Bahamian</option>
            <option value="bahraini">Bahraini</option>
            <option value="bangladeshi">Bangladeshi</option>
            <option value="barbadian">Barbadian</option>
            <option value="barbudans">Barbudans</option>
            <option value="batswana">Batswana</option>
            <option value="belarusian">Belarusian</option>
            <option value="belgian">Belgian</option>
            <option value="belizean">Belizean</option>
            <option value="beninese">Beninese</option>
            <option value="bhutanese">Bhutanese</option>
            <option value="bolivian">Bolivian</option>
            <option value="bosnian">Bosnian</option>
            <option value="brazilian">Brazilian</option>
            <option value="british">British</option>
            <option value="bruneian">Bruneian</option>
            <option value="bulgarian">Bulgarian</option>
            <option value="burkinabe">Burkinabe</option>
            <option value="burmese">Burmese</option>
            <option value="burundian">Burundian</option>
            <option value="cambodian">Cambodian</option>
            <option value="cameroonian">Cameroonian</option>
            <option value="canadian">Canadian</option>
            <option value="cape verdean">Cape Verdean</option>
            <option value="central african">Central African</option>
            <option value="chadian">Chadian</option>
            <option value="chilean">Chilean</option>
            <option value="chinese">Chinese</option>
            <option value="colombian">Colombian</option>
            <option value="comoran">Comoran</option>
            <option value="congolese">Congolese</option>
            <option value="costa rican">Costa Rican</option>
            <option value="croatian">Croatian</option>
            <option value="cuban">Cuban</option>
            <option value="cypriot">Cypriot</option>
            <option value="czech">Czech</option>
            <option value="danish">Danish</option>
            <option value="djibouti">Djibouti</option>
            <option value="dominican">Dominican</option>
            <option value="dutch">Dutch</option>
            <option value="east timorese">East Timorese</option>
            <option value="ecuadorean">Ecuadorean</option>
            <option value="egyptian">Egyptian</option>
            <option value="emirian">Emirian</option>
            <option value="equatorial guinean">Equatorial Guinean</option>
            <option value="eritrean">Eritrean</option>
            <option value="estonian">Estonian</option>
            <option value="ethiopian">Ethiopian</option>
            <option value="fijian">Fijian</option>
            <option value="filipino">Filipino</option>
            <option value="finnish">Finnish</option>
            <option value="french">French</option>
            <option value="gabonese">Gabonese</option>
            <option value="gambian">Gambian</option>
            <option value="georgian">Georgian</option>
            <option value="german">German</option>
            <option value="ghanaian">Ghanaian</option>
            <option value="greek">Greek</option>
            <option value="grenadian">Grenadian</option>
            <option value="guatemalan">Guatemalan</option>
            <option value="guinea-bissauan">Guinea-Bissauan</option>
            <option value="guinean">Guinean</option>
            <option value="guyanese">Guyanese</option>
            <option value="haitian">Haitian</option>
            <option value="herzegovinian">Herzegovinian</option>
            <option value="honduran">Honduran</option>
            <option value="hungarian">Hungarian</option>
            <option value="icelander">Icelander</option>
            <option value="indian">Indian</option>
            <option value="indonesian">Indonesian</option>
            <option value="iranian">Iranian</option>
            <option value="iraqi">Iraqi</option>
            <option value="irish">Irish</option>
            <option value="israeli">Israeli</option>
            <option value="italian">Italian</option>
            <option value="ivorian">Ivorian</option>
            <option value="jamaican">Jamaican</option>
            <option value="japanese">Japanese</option>
            <option value="jordanian">Jordanian</option>
            <option value="kazakhstani">Kazakhstani</option>
            <option value="kenyan">Kenyan</option>
            <option value="kittian and nevisian">Kittian and Nevisian</option>
            <option value="kuwaiti">Kuwaiti</option>
            <option value="kyrgyz">Kyrgyz</option>
            <option value="laotian">Laotian</option>
            <option value="latvian">Latvian</option>
            <option value="lebanese">Lebanese</option>
            <option value="liberian">Liberian</option>
            <option value="libyan">Libyan</option>
            <option value="liechtensteiner">Liechtensteiner</option>
            <option value="lithuanian">Lithuanian</option>
            <option value="luxembourger">Luxembourger</option>
            <option value="macedonian">Macedonian</option>
            <option value="malagasy">Malagasy</option>
            <option value="malawian">Malawian</option>
            <option value="malaysian">Malaysian</option>
            <option value="maldivan">Maldivan</option>
            <option value="malian">Malian</option>
            <option value="maltese">Maltese</option>
            <option value="marshallese">Marshallese</option>
            <option value="mauritanian">Mauritanian</option>
            <option value="mauritian">Mauritian</option>
            <option value="mexican">Mexican</option>
            <option value="micronesian">Micronesian</option>
            <option value="moldovan">Moldovan</option>
            <option value="monacan">Monacan</option>
            <option value="mongolian">Mongolian</option>
            <option value="moroccan">Moroccan</option>
            <option value="mosotho">Mosotho</option>
            <option value="motswana">Motswana</option>
            <option value="mozambican">Mozambican</option>
            <option value="namibian">Namibian</option>
            <option value="nauruan">Nauruan</option>
            <option value="nepalese">Nepalese</option>
            <option value="new zealander">New Zealander</option>
            <option value="ni-vanuatu">Ni-Vanuatu</option>
            <option value="nicaraguan">Nicaraguan</option>
            <option value="nigerien">Nigerien</option>
            <option value="north korean">North Korean</option>
            <option value="northern irish">Northern Irish</option>
            <option value="norwegian">Norwegian</option>
            <option value="omani">Omani</option>
            <option value="pakistani">Pakistani</option>
            <option value="palauan">Palauan</option>
            <option value="panamanian">Panamanian</option>
            <option value="papua new guinean">Papua New Guinean</option>
            <option value="paraguayan">Paraguayan</option>
            <option value="peruvian">Peruvian</option>
            <option value="polish">Polish</option>
            <option value="portuguese">Portuguese</option>
            <option value="qatari">Qatari</option>
            <option value="romanian">Romanian</option>
            <option value="russian">Russian</option>
            <option value="rwandan">Rwandan</option>
            <option value="saint lucian">Saint Lucian</option>
            <option value="salvadoran">Salvadoran</option>
            <option value="samoan">Samoan</option>
            <option value="san marinese">San Marinese</option>
            <option value="sao tomean">Sao Tomean</option>
            <option value="saudi">Saudi</option>
            <option value="scottish">Scottish</option>
            <option value="senegalese">Senegalese</option>
            <option value="serbian">Serbian</option>
            <option value="seychellois">Seychellois</option>
            <option value="sierra leonean">Sierra Leonean</option>
            <option value="singaporean">Singaporean</option>
            <option value="slovakian">Slovakian</option>
            <option value="slovenian">Slovenian</option>
            <option value="solomon islander">Solomon Islander</option>
            <option value="somali">Somali</option>
            <option value="south african">South African</option>
            <option value="south korean">South Korean</option>
            <option value="spanish">Spanish</option>
            <option value="sri lankan">Sri Lankan</option>
            <option value="sudanese">Sudanese</option>
            <option value="surinamer">Surinamer</option>
            <option value="swazi">Swazi</option>
            <option value="swedish">Swedish</option>
            <option value="swiss">Swiss</option>
            <option value="syrian">Syrian</option>
            <option value="taiwanese">Taiwanese</option>
            <option value="tajik">Tajik</option>
            <option value="tanzanian">Tanzanian</option>
            <option value="thai">Thai</option>
            <option value="togolese">Togolese</option>
            <option value="tongan">Tongan</option>
            <option value="trinidadian or tobagonian">
              Trinidadian or Tobagonian
            </option>
            <option value="tunisian">Tunisian</option>
            <option value="turkish">Turkish</option>
            <option value="tuvaluan">Tuvaluan</option>
            <option value="ugandan">Ugandan</option>
            <option value="ukrainian">Ukrainian</option>
            <option value="uruguayan">Uruguayan</option>
            <option value="uzbekistani">Uzbekistani</option>
            <option value="venezuelan">Venezuelan</option>
            <option value="vietnamese">Vietnamese</option>
            <option value="welsh">Welsh</option>
            <option value="yemenite">Yemenite</option>
            <option value="zambian">Zambian</option>
            <option value="zimbabwean">Zimbabwean</option>
          </select>
        </div>
        <div className="buttons">
          <Link to="/userdetails">
            <button className="submit">Show Data</button>
          </Link>
          <button className="delete" onClick={() => reset()}>
            Cancel
          </button>
          <button type="submit" onClick={addRecord} className="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
