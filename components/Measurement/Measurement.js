import React, { useState } from "react";
import styles from "../UploadData/upload.module.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import PatientInfoForm from "../Form/PatientInfoForm";
import { BsCheckCircleFill } from "react-icons/bs";
import Image from "next/image";
import { getCookie } from "../../lib/useCookies";

const Measurement = ({ userID, setMeasurement }) => {
  const [patientDataSubmit, setPatientDataSubmit] = useState(false);
  const [query, setQuery] = useState({
    buttock_heigh: 0,
    buttock_popliteal_length: 0,
    buttock_popliteal_length_1: 0,
    buttock_popliteal_length_2: 0,
    buttock_popliteal_length_3: 0,
    buttock_popliteal_length_4: 0,
    buttock_popliteal_length_5: 0,
    elbow_centre_grip_length: 0,
  });
  const handleParam = () => (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const unlockMeasurement = (data) => {
    setPatientDataSubmit(data);
  };

  const patientData = getCookie("patientInfo");
  // console.log(patientData.data.patient_id, "cache");

  const formSubmit = async () => {
    if (patientDataSubmit) {
      try {
        const data = await fetch(
          "http://3.135.218.54:8000/nxtapi/submit_measurement/",
          {
            method: "POST",
            body: JSON.stringify({
              patient_id: patientData,
              measurements: {
                buttock_height: query.buttock_heigh,
                buttock_popliteal_length: query.buttock_popliteal_length,
                elbow_centre_grip_length: query.elbow_centre_grip_length,
                buttock_popliteal_length_1: query.buttock_popliteal_length_1,
                buttock_popliteal_length_2: query.buttock_popliteal_length_2,
                buttock_popliteal_length_3: query.buttock_popliteal_length_3,
                buttock_popliteal_length_4: query.buttock_popliteal_length_4,
                buttock_popliteal_length_5: query.buttock_popliteal_length_5,
              },
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((t) => t.json());
        console.log(data.status, data, "hello");
        if (data.status === true) {
          alert(data.message);
          setPatientDataSubmit(false);
        }
      } catch (error) {
        console.log(error);
      }
    } else alert("please submit patient info first");
  };
  return (
    <div className={styles.uploadSummery}>
      <div className={styles.uploadWrapMeasurement}>
        <div className={styles.uploadLeft}>
          <div className={styles.uploadInner}>
            <h2 className={styles.head}>Insights / Results</h2>
            <div className={styles.userSummery}>
              <p className={styles.summeryPara}>user summery</p>
            </div>
          </div>
        </div>
        <div className={styles.uploadRightMeasurement}>
          <div className={styles.formMeasurement}>
            <p className={styles.measurementHeading}>
              <HiOutlineDocumentText /> Patient info
            </p>
            <PatientInfoForm
              userID={userID}
              setPatientDataSubmit={unlockMeasurement}
            />
          </div>
        </div>
      </div>
      <div className={styles.measurementDetails}>
        <div className={styles.tableWrap}>
          <p>Anthropomorphic measurements</p>
          <div className={styles.table}>
            <table>
              <tbody>
                <tr>
                  <th>Measurement type</th>
                  <th>IDEAL</th>
                  <th>PATIENT</th>
                </tr>
                <tr>
                  <td>
                    <p>Buttock Height</p>
                  </td>
                  <td>150 cm</td>
                  <td>
                    <input
                      type="number"
                      name="buttock_heigh"
                      required
                      disabled={!patientDataSubmit}
                      placeholder=""
                      value={query.buttock_heigh}
                      onChange={handleParam()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Buttock-Popliteal length</p>
                  </td>
                  <td>60 kg</td>
                  <td>
                    <input
                      type="number"
                      name="buttock_popliteal_length"
                      required
                      disabled={!patientDataSubmit}
                      placeholder=""
                      value={query.buttock_popliteal_length}
                      onChange={handleParam()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Elbow- Centre of grip length</p>
                  </td>
                  <td>120/80 mmHg</td>
                  <td>
                    <input
                      type="number"
                      name="elbow_centre_grip_length"
                      required
                      disabled={!patientDataSubmit}
                      placeholder=""
                      value={query.elbow_centre_grip_length}
                      onChange={handleParam()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Buttock-Popliteal length</p>
                  </td>
                  <td>70 bpm</td>
                  <td>
                    <input
                      type="number"
                      name="buttock_popliteal_length_1"
                      required
                      disabled={!patientDataSubmit}
                      placeholder=""
                      value={query.buttock_popliteal_length_1}
                      onChange={handleParam()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Buttock-Popliteal length</p>
                  </td>
                  <td>200 mg/dL</td>
                  <td>
                    <input
                      type="number"
                      name="buttock_popliteal_length_2"
                      required
                      disabled={!patientDataSubmit}
                      placeholder=""
                      value={query.buttock_popliteal_length_2}
                      onChange={handleParam()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Buttock-Popliteal length</p>
                  </td>
                  <td>90 mg/dL</td>
                  <td>
                    <input
                      type="number"
                      name="buttock_popliteal_length_3"
                      required
                      disabled={!patientDataSubmit}
                      placeholder=""
                      value={query.buttock_popliteal_length_3}
                      onChange={handleParam()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Buttock-Popliteal length</p>
                  </td>
                  <td>98.6°F</td>
                  <td>
                    <input
                      type="number"
                      name="buttock_popliteal_length_4"
                      required
                      disabled={!patientDataSubmit}
                      placeholder=""
                      value={query.buttock_popliteal_length_4}
                      onChange={handleParam()}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <p>Buttock-Popliteal length</p>
                  </td>
                  <td>12 breaths/min</td>
                  <td>
                    <input
                      type="number"
                      name="buttock_popliteal_length_5"
                      required
                      disabled={!patientDataSubmit}
                      placeholder=""
                      value={query.buttock_popliteal_length_5}
                      onChange={handleParam()}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.imgWrap}>
          <div className="imgWrapper">
            <Image
              src="/images/measurement-icon.png"
              width={205}
              height={474}
              className={styles.img}
              alt="measurement"
            />
          </div>
          <button
            onClick={formSubmit}
            className={patientDataSubmit ? styles.btn : styles.disBtn}
          >
            Freeze Measurement <MdKeyboardArrowRight />
          </button>
        </div>
      </div>

      <div className={styles.continue1}>
        <button
          disabled={patientDataSubmit}
          onClick={() => {
            setMeasurement(false);
          }}
        >
          Continue <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
        </button>
      </div>
    </div>
  );
};

export default Measurement;
