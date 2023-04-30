import React, { useEffect, useState } from "react";
import { db } from "./firebase-config";
import { collection, getDocs } from "firebase/firestore";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";

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
      name: "Mobile",
      selector: (row) => row.mobile_number,
    },
    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Govt Id",
      selector: (row) => row.govtId,
    },
    {
      name: "Gaurdian Details",
      selector: (row) => row.gaurdian_name,
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

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.Id })));
    };
    getUsers();
  }, [userCollectionRef]);

  return (
    <div>
      <DataTable
        title="User List"
        columns={columns}
        data={users}
        customStyles={customStyles}
      />
      <Link to="/">
        <button className="submit" style={{ marginTop: "20px" }}>
          Go Back
        </button>
      </Link>
    </div>
  );
};
export default UserDetails;
