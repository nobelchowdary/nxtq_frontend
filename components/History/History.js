import React, { useState, useEffect } from "react";
import { getCookie, setCookie } from "../../lib/useCookies";
import { AiOutlineCloudDownload } from "react-icons/ai";
import styles from "./History.module.css";
import Link from "next/link";
const History = ({ userID }) => {
  const patentID = getCookie("patientInfo");
  const [query, setQuery] = useState({
    user_id: userID,
    patient_id: patentID,
  });

  const [patientDetails, setPatientDetails] = useState([]);
  const [fileArray, setFileArray] = useState([]);
  useEffect(() => {
    const getPatientInfo = async () => {
      try {
        const data = await fetch(
          "http://3.139.243.94:8000/nxtapi/get_user_patients/",
          {
            method: "POST",
            body: JSON.stringify({
              user_id: userID,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((t) => t.json());
        if (data.status === true) {
          // console.log(data);
          setPatientDetails(data.data);
        }
      } catch (error) {}
    };
    getPatientInfo();
  }, [patientDetails.length, query.patient_id]);
  useEffect(() => {
    const getMotInfo = async () => {
      try {
        const data = await fetch(
          "http://3.139.243.94:8000/nxtapi/fetch_mot_history/",
          {
            method: "POST",
            body: JSON.stringify({
              user_id: userID,
              patient_id: query.patient_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((t) => t.json());
        if (data.status === true) {
          console.log(data.data);
          setFileArray(data.data);
          // setPatientDetails(data.data);
        }
      } catch (error) {}
    };
    getMotInfo();
  }, [patientDetails.length, query.patient_id]);
  const handleParam = () => (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className={styles.History}>
      <p>Please select a patient</p>
      <div className={styles.customDropdown}>
        <select
          name="patient_id"
          required
          value={query.patient_id}
          onChange={handleParam()}
          placeholder="Select a patient"
        >
          <option value="">Select a patient</option>
          {patientDetails.map((data, index) => {
            return (
              <option value={data.id} key={index}>
                {data.patient_name}
              </option>
            );
          })}
        </select>
        <div className={styles.customArrow}>⌄</div>
      </div>
      <p>All the files for patient ID {query.patient_id}</p>
      <div className={styles.box}>
        {fileArray.length === 0 ? (
          <p>No Mot Files exist fot the user</p>
        ) : (
          fileArray.map((data, i) => {
            return (
              <Link href={data} key={i}>
                <p>
                  <AiOutlineCloudDownload />
                  {data}
                </p>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
