import React,{useEffect,useState} from "react";
import { useForm,useFormState,useWatch } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { Country, State, City } from "country-state-city";

const UserRegistrationForm = () => {
  const schema = yup.object({
    name: yup.string().required("Please enter name"),
    dob: yup.string().required("Date of birth required"),
    sex: yup.string().required("Please select sex")
  }).required();
  const [countries, setCountries] = useState([]);
  const [countryName, setCountryName] = useState("")
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    initialValues: {
      country: "India",
      state: null,
      city: null
    },
    resolver: yupResolver(schema)
  });
  const onSubmit = (data) => console.log(data);

  useEffect(() => {
    let newCountryList = Country.getAllCountries();
    const updateCountries = newCountryList.map((country) => ({
      label: country.name,
      value: country.isoCode,
      ...country
    }));
    setCountries(updateCountries);
  }, []);


  const handleCountryChange = (selectedCountry) => {
    console.log("country", selectedCountry.name);
    setCountryName(selectedCountry.name); 
    let states = State.getStatesOfCountry(selectedCountry.value);
    if(states.length == 0){
      states= State.getStatesOfCountry(selectedCountry.isoCode);
    }
    setStates(states.map((state) => ({ label: state.name, value: state.value||state.isoCode, isoCode: selectedCountry.isoCode})));
  };
  // console.log("tabke",countries.name);
  // console.log("stateTable", states);
  const handleStateChange = (selectedState) => {
    // console.log("state", selectedState);
    // console.log(City.getCitiesOfCountry("IN"));
    // console.log(City.getCitiesOfState(selectedState.isoCode,selectedState.value));
    const cities = City.getCitiesOfState(selectedState.isoCode,selectedState.value);
    // console.log("cities",newCities);
    setCities(cities.map((city) => ({ label: city.name, value: city.name })));
    console.log("city",cities);
    // console.log(selectedState)
  };
  // console.log("city",cities);
  // console.table(countries)
  const handleCityChange = (selectedCity,selectedState) => {
  };


  // const { values, setValues} = useFormState({
  //   control
  // });
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
              <option value="">
                Select Sex
              </option>
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
          </div>
          <div className="input-field">
            <label>Govt Issued Id</label>
            <select {...register("idType", { required: true })}>
              <option value="">
                Id Type
              </option>
              <option value="adhar">Adhar</option>
              <option value="pan">Pan</option>
            </select>
            <input
              type="tel"
              placeholder="Enter govt Id"
              {...register("govtIdValue", { required: true, maxLength: 10 })}
            />
          </div>
        </div>
        <label className="head-section">Contact Details</label>
        <div className="personal-details">
          <div className="input-field">
            <label>Guardian Details</label>
            <select {...register("gaurdianLabel", { required: true })}>
              <option value="">
                Select Label
              </option>
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
          <Select {...register("state", { required: true })}
            id= "state"
            name= "state"
            label="state"
            options={states}
            value={states.name}
            onChange={handleStateChange}
          />
          </div>
          <div className="input-field">
          <label>City</label>
          <Select {...register("city", { required: true })}
            id="city"
            name="city"
            label="city"
            value={cities.name}
            options={cities}
            onChange={handleCityChange}
          />
          </div>
          <div className="input-field">
          <label>Country</label>
          <Select {...register("country", { required: true })}
            id= "country"
            name= "country"
            label="country"
            options={countries}
            value={countryName}
            onChange={(selectedCountry) => handleCountryChange(selectedCountry)}

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
            <option value="">
                Select Religion
              </option>
              <option value="hindu">Hindu</option>
              <option value="muslim">Muslim</option>
              <option value="crishtian">Crishtian</option>
            </select>
          </div>
          <div className="input-field">
            <label>Marital Status</label>
            <select {...register("maritalStatus", { required: true })}>
            <option value="">
                Select Marital Status
              </option>
              <option value="married">Married</option>
              <option value="unmarried">Unmarried</option>
            </select>
          </div>
          <div className="input-field">
            <label>Blood Group</label>
            <select {...register("bloodGroup", { required: true })}>
            <option value="">
                Select Group
              </option>
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
          <option value="">
                Select Nationality
              </option>
            <option value="inidan">Inidan</option>
            <option value="bangaldeshi">Bangladesi</option>
            <option value="russian">Russian</option>
          </select>
        </div>
        <div className="buttons">
          <button className="delete" onClick={()=> reset()}>Cancel</button>
          <button type="submit" className="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default UserRegistrationForm;
