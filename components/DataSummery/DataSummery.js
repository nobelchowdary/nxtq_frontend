import React, { useEffect, useState } from "react";
import styles from "../UploadData/upload.module.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import { getCookie } from "../../lib/useCookies";

const DataSummery = ({ userID }) => {
  const patentID = getCookie("patientInfo");
  const [fileData, setFileData] = useState("");
  const [dataError, setDataError] = useState(false);
  useEffect(() => {
    console.log("inside");
    const getSummery = async () => {
      try {
        const data = await fetch(
          "http://18.191.200.118:8000/nxtapi/input_files_summary/",
          {
            method: "POST",
            body: JSON.stringify({
              patient_id: patentID,
              user_id: userID,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((t) => t.json());

        if (data.status === true) {
          setFileData(data.data);
          console.log(JSON.parse(fileData.summary));
          const checkError = () => {
            JSON.parse(fileData.summary).data.map((data, index) => {
              const check = data.includes(null);
              if (check) {
                setDataError(true);
              } else setDataError(true);
              console.log(dataError);
            });
          };
          checkError();
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSummery();
  }, []);

  return (
    <div className={styles.uploadSummery}>
      <div className={styles.headWrap}>
        <h2>Upload Data Summery</h2>
        <span className={dataError ? styles.redBox : styles.greenBox}></span>
      </div>

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
        <div className={styles.uploadRightSummery}>
          <div className={styles.row}>
            <span className={dataError ? styles.errorSpan : styles.span}>
              Number of files
            </span>
            <div className={styles.boxWrap}>
              <div className={styles.box}>
                {fileData === ""
                  ? ""
                  : JSON.parse(fileData.summary).index.length}
              </div>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
            </div>
          </div>
          <div className={styles.row}>
            <span className={dataError ? styles.errorSpan : styles.span}>
              Meta data
            </span>
            <div className={styles.boxWrap}>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
            </div>
          </div>
          <div className={styles.row}>
            <span className={dataError ? styles.errorSpan : styles.span}>
              Initial Analysis
            </span>
            <div className={styles.boxWrap}>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
            </div>
          </div>
          <div className={styles.row}>
            <span className={dataError ? styles.errorSpan : styles.span}>
              Initial Analysis
            </span>
            <div className={styles.boxWrap}>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
              <div className={styles.box}></div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.continue1}>
        {dataError ? (
          <button>
            Discard & Reupload
            <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
          </button>
        ) : (
          ""
        )}
        <button>
          {dataError ? "Proceed as it is" : "Continue"}
          <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
        </button>
      </div>
    </div>
  );
};

export default DataSummery;
