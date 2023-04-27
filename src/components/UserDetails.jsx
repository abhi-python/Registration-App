import React, { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import DataTable, { createTheme } from "react-data-table-component";

const UserDetails = () => {
  const [users, setUsers] = useState([]);
  const userCollectionRef = collection(db, "users");

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
    },
    {
      name: "Age",
      selector: (row) => row.age,
    },
    {
      name: "Sex",
      selector: (row) => row.sex,
    },
    {
      name: "Mobile Number",
      selector: (row) => row.mobile,
    },
    {
      name: "Govt Id",
      selector: (row) => row.govtId,
    },
    {
      name: "Gaurdian Name",
      selector: (row) => row.gaurdian_name,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Emergency Contact Number",
      selector: (row) => row.emergency_contact_number,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Country",
      selector: (row) => row.country,
    },
    {
      name: "State",
      selector: (row) => row.state,
    },
    {
      name: "City",
      selector: (row) => row.city,
    },
    {
      name: "Pincode",
      selector: (row) => row.pincode,
    },
    {
      name: "Occupation",
      selector: (row) => row.occupation,
    },
    {
      name: "Religion",
      selector: (row) => row.religion,
    },
    {
      name: "Marital Status",
      selector: (row) => row.marital_status,
    },
    {
      name: "Blood Group",
      selector: (row) => row.blood_group,
    },
    {
      name: "Nationality",
      selector: (row) => row.nationality,
    },
  ];

  const customStyles = {
    rows: {
      style: {
        fontSize: "14px",
      },
    },

    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "15px",
      },
    },
  };

  // createTheme(
  //   "solarized",
  //   {
  //     text: {
  //       primary: "#268bd2",
  //       secondary: "#2aa198",
  //     },
  //     background: {
  //       default: "#002b36",
  //     },
  //     context: {
  //       background: "#cb4b16",
  //       text: "#FFFFFF",
  //     },
  //     divider: {
  //       default: "#073642",
  //     },
  //     action: {
  //       button: "rgba(0,0,0,.54)",
  //       hover: "rgba(0,0,0,.08)",
  //       disabled: "rgba(0,0,0,.12)",
  //     },
  //   },
  //   "dark"
  // );

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.Id })));
    };
    getUsers();
  }, []);

  return (
    <div>
      {/* <h1>User Details</h1> */}
      {/* {users.map((user) => (
        <div>
          <h2>Name: {user.name}</h2>
          <h3>Age: {user.age}</h3>
        </div>
      ))} */}

      <DataTable
        title="User List"
        columns={columns}
        data={users}
        customStyles={customStyles}
        // theme="solarized"
      />
    </div>
  );
};
export default UserDetails;
