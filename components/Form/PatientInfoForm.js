import React, { useState } from "react";
import styles from "./Form.module.css";
import { setCookie } from "../../lib/useCookies";
const PatientInfoForm = ({ userID, setPatientDataSubmit }) => {
  // console.log(userID, "hello");
  const [query, setQuery] = useState({
    name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    concern: "",
    illness: "",
  });
  const handleParam = () => (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await fetch(
        "http://3.135.218.54:8000/nxtapi/submit_user_data/",
        {
          method: "POST",
          body: JSON.stringify({
            user_id: userID,
            patient: {
              patient_name: query.name,
              patient_age: query.age,
              patient_gender: query.gender,
              patient_height: query.height,
              patient_weight: query.weight,
              patient_concern: query.concern,
              patient_previous_illness: query.illness === "true" ? true : false,
            },
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((t) => t.json());
      // console.log(data.status, data, "hello");
      if (data.status === true) {
        alert(data.message);
        setCookie("patientInfo", data.data.patient_id);
        setQuery({
          name: "",
          age: "",
          gender: "",
          height: "",
          weight: "",
          concern: "",
          illness: "",
        });
        setPatientDataSubmit(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className={styles.PatientForm} onSubmit={formSubmit}>
      <div className={styles.inputWrapper}>
        <label htmlFor="name">Patient name</label>
        <input
          type="text"
          name="name"
          required
          placeholder="Your full name"
          value={query.name}
          onChange={handleParam()}
        />
      </div>
      <div className={styles.doubleInput}>
        <div className={styles.inputWrapper}>
          <label htmlFor="age">Age</label>
          <input
            type="number"
            name="age"
            required
            placeholder="Your age"
            value={query.age}
            onChange={handleParam()}
          />
        </div>
        <div className={styles.inputWrapper}>
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            required
            value={query.gender}
            onChange={handleParam()}
            placeholder="Select gender"
          >
            <option value="male">Male</option>
            <option value="female">female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
      <div className={styles.doubleInput}>
        <div className={styles.inputWrapper}>
          <label htmlFor="height">Height</label>
          <input
            type="number"
            name="height"
            required
            placeholder="Your height"
            value={query.height}
            onChange={handleParam()}
          />
        </div>
        <div className={styles.inputWrapper}>
          <label htmlFor="weight">Weight</label>
          <input
            type="number"
            name="weight"
            required
            placeholder="Your weight"
            value={query.weight}
            onChange={handleParam()}
          />
        </div>
      </div>
      <div className={styles.inputWrapper}>
        <label htmlFor="concern">Concern</label>
        <input
          type="text"
          name="concern"
          required
          placeholder="Your concern"
          value={query.concern}
          onChange={handleParam()}
        />
      </div>
      <div className={styles.inputWrapper}>
        <label htmlFor="illness">Any Previous illness</label>
        <select
          name="illness"
          required
          value={query.illness}
          onChange={handleParam()}
          placeholder="Select a option"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>
      <button type="submit">submit</button>
    </form>
  );
};

export default PatientInfoForm;
