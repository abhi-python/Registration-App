import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import { db } from "./firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import UserDetails from "./UserDetails";

const UserRegistrationForm = () => {
  const panReg =
    /(^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$)|(^([0-9]){4}([a-zA-Z]){3}?$)/;
  const adharReg = /^\d{12}$/;
  const schema = yup
    .object()
    .shape({
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
      // id: yup.string().when("idType", {
      //   is: "Aadhar",
      //   then: yup
      //     .string()
      //     .matches(
      //       /^\d{12}$/,
      //       "Govt Id must be a valid 12-digit numeric string"
      //     ),
      //   otherwise: yup
      //     .string()
      //     .matches(
      //       /^[A-Za-z]{5}\d{4}[A-Za-z]{1}$/,
      //       "Govt Id must be a valid 10-digit alpha-numeric string"
      //     ),
      // }),
      emergencyNumber: yup
        .string()
        .matches(
          /^[6-9]\d{9}$/,
          "Emergency Contact Number must be a valid Indian mobile number"
        )
        .nullable(),

    });
  const [countries, setCountries] = useState([]);
  const [countryName, setCountryName] = useState("");
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
    return addDoc(userCollectionRef, {
      name: data.name,
      age: data.dob,
      sex: data.sex,
      mobile_number: data.mobileNumber || "",
      govtId: data.govtIdValue || "",
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
    if (states.length == 0) {
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
  // console.log("tabke",countries.name);
  // console.log("stateTable", states);
  const handleStateChange = (selectedState) => {
    // console.log("state", selectedState);
    // console.log(City.getCitiesOfCountry("IN"));
    // console.log(City.getCitiesOfState(selectedState.isoCode,selectedState.value));
    const cities = City.getCitiesOfState(
      selectedState.isoCode,
      selectedState.value
    );
    // console.log("cities",newCities);
    setCities(cities.map((city) => ({ label: city.name, value: city.name })));
    console.log("city", cities);
    // console.log(selectedState)
  };
  // console.log("city",cities);
  // console.table(countries)
  const handleCityChange = (selectedCity, selectedState) => {};

  // const { values, setValues} = useFormState({
  //   control
  // });
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
              <option value="">Select Sex</option>
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
              // const selectedCountry = watch("country");
              id="country"
              name="country"
              label="country"
              options={countries}
              value={watch("country")}
              onChange={handleCountryChange}

              //     => {
              //   setValues({ country: value, state: null, city: null }, false);
              // }}
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
              <option value="">Select Religion</option>
              <option value="hindu">Hindu</option>
              <option value="muslim">Muslim</option>
              <option value="crishtian">Crishtian</option>
            </select>
          </div>
          <div className="input-field">
            <label>Marital Status</label>
            <select {...register("maritalStatus", { required: true })}>
              <option value="">Select Marital Status</option>
              <option value="married">Married</option>
              <option value="unmarried">Unmarried</option>
            </select>
          </div>
          <div className="input-field">
            <label>Blood Group</label>
            <select {...register("bloodGroup", { required: true })}>
              <option value="">Select Group</option>
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
            <option value="">Select Nationality</option>
            <option value="inidan">Inidan</option>
            <option value="bangaldeshi">Bangladesi</option>
            <option value="russian">Russian</option>
          </select>
        </div>
        <div className="buttons">
          <Link to='/userdetails'>
            <button className="submit">
              Show Data
            </button>
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
