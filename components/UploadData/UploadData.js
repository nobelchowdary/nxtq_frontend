import React, { useState, useRef, useEffect } from "react";
import styles from "./upload.module.css";
import { BsCloudUpload, BsFolderCheck } from "react-icons/bs";
import { AiOutlineFileExcel } from "react-icons/ai";
import Measurement from "../Measurement/Measurement";
import { MdKeyboardArrowRight } from "react-icons/md";
import { getCookie, setCookie } from "../../lib/useCookies";

const UploadData = ({
  userID,
  setUploadSummery,
  setUploadData,
  patientId,
  uploadData,
}) => {
  const [patientDetails, setPatientDetails] = useState([]);
  // const patentID = getCookie("patientInfo");
  const [nextSummery, setNextSummery] = useState(false);
  const [query, setQuery] = useState({
    user_id: userID,
    patient_id: "",
  });

  // const getPatient = patientId.sort(function (a, b) {
  //   return a - b;
  // });
  const handleParam = () => (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [patientData, setPatientData] = useState("");

  const [measurement, setMeasurement] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  console.log(patientId, uploadData, patientDetails.length);
  //for getting patient info
  useEffect(() => {
    const getPatientInfo = async () => {
      try {
        const data = await fetch(
          "http://3.135.218.54:8000/nxtapi/get_user_patients/",
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
          console.log(data);
          setPatientDetails(data.data);
        }
      } catch (error) {}
    };
    getPatientInfo();
  }, [patientId, uploadData, patientDetails.length, query.patient_id]);
  // useEffect(() => {
  //   console.log("inside fetch");
  //   const fetchPatientDetails = async () => {
  //     try {
  //       const data = await fetch(
  //         "http://3.135.218.54:8000/get_patient_info/",
  //         {
  //           method: "POST",
  //           body: JSON.stringify({
  //             patient_id: getPatient[getPatient.length - 1],
  //           }),
  //           redirect: "follow",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       ).then((t) => t.json());
  //       if (data.status === true) {
  //         setCheckMeasurement(true);
  //       }
  //     } catch (error) {}
  //   };
  //   fetchPatientDetails();
  // }, []);

  //fetch folder data
  useEffect(() => {
    const getFolderData = async () => {
      console.log("patientId is there");
      try {
        const data = await fetch(
          "http://3.135.218.54:8000/nxtapi/fetch_user_s3_folders/",
          {
            method: "POST",
            body: JSON.stringify({
              patient_id: query.patient_id,
              user_id: userID,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((t) => t.json());
        if (data.status === true) {
          console.log(data);
          setPatientData({
            message: data.message,
            data: data.data,
          });
        }
      } catch (error) {}
    };
    getFolderData();
    setCookie("patientInfo", query.patient_id);
  }, [selectedFiles, query.patient_id]);
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);

    // Filter out files that are not CSV
    const csvFiles = files.filter(
      (file) => file.type === "application/csv" || file.type === "text/csv"
    );

    setSelectedFiles(csvFiles);
  };
  const sendRequestToApi = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select one or more CSV files.");
      return;
    }
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append(`csv_files`, file);
    });
    Object.entries(query).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const data = await fetch(
        "http://3.135.218.54:8000/nxtapi/upload_csv_file/",
        {
          method: "POST",
          body: formData,
        }
      ).then((t) => t.json());
      if (data.status === true) {
        alert(data.message);
        setSelectedFiles([]);
        setNextSummery(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCustomButtonClick = () => {
    if (patientDetails.length === 0)
      alert("Please submit patient data and measurement data first");
    else fileInputRef.current.click();
  };
  const showHideMeasurement = (data) => {
    setMeasurement(data);
  };
  return measurement ? (
    <Measurement userID={userID} setMeasurement={showHideMeasurement} />
  ) : (
    <div style={{ width: "100%" }}>
      <div className={styles.uploadWrap}>
        <div className={styles.uploadLeft}>
          <div className={styles.uploadInner}>
            <h2 className={styles.head}>Data Collection</h2>
            <form>
              <textarea
                placeholder="Data collection environment information. 
(To be entered via text)"
              />

              <button>Submit</button>
            </form>
          </div>
        </div>
        <div className={styles.uploadRight}>
          <div className={styles.patientDetails}>
            {patientDetails.length === 0 ? (
              <p>There is no patient associated. Upload new Patients Data</p>
            ) : (
              <>
                <p>
                  Please select a patient to See the Details or Go to Upload New
                  Measurements for new patient
                </p>
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
              </>
            )}
          </div>
          {patientData === "" ? (
            ""
          ) : patientData.data.length === 0 ? (
            <p>No folder uploaded for this user</p>
          ) : (
            <>
              <p>{patientData.message}</p>
              <div className={styles.container}>
                {patientData.data.map((data, i) => {
                  return (
                    <span className={styles.patientDataFolder} key={i}>
                      <BsFolderCheck />
                      {data}
                    </span>
                  );
                })}
              </div>
            </>
          )}

          <input
            type="file"
            accept=".csv"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the default file input
          />
          <button
            onClick={() => {
              setMeasurement(true);
            }}
          >
            Upload {patientId === undefined ? "" : "New "}Measurements
            <BsCloudUpload />
          </button>
          <div className={styles.btnWrapper}>
            <button onClick={handleCustomButtonClick}>
              Select Files to Upload
              <AiOutlineFileExcel />
            </button>

            <div>
              <p className={styles.selectedFiles}>
                {selectedFiles.map((file, index) => (
                  <span key={file.name}>"{file.name}", </span>
                ))}
              </p>
            </div>
          </div>
          {selectedFiles.length > 0 ? (
            <button onClick={sendRequestToApi}>
              Upload Data <BsCloudUpload />
            </button>
          ) : (
            ""
          )}
          {/* <button>
            Upload Data <BsCloudUpload />
          </button> */}
        </div>
      </div>
      <div className={styles.continue}>
        <button
          disabled={!nextSummery}
          onClick={() => {
            setUploadData(false);
            setUploadSummery(true);
          }}
        >
          Continue <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
        </button>
      </div>
    </div>
  );
};

export default UploadData;
