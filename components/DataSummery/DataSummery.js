import React, { useEffect, useState } from "react";
import styles from "../UploadData/upload.module.css";
import { MdKeyboardArrowRight } from "react-icons/md";
import { getCookie, setCookie } from "../../lib/useCookies";

const DataSummery = ({
  userID,
  setUploadData,
  setUploadSummery,
  setResult,
}) => {
  const patentID = getCookie("patientInfo");
  const [fileData, setFileData] = useState("");
  const [dataError, setDataError] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  useEffect(() => {
    console.log("inside");
    const getSummery = async () => {
      setShowLoading(true);
      try {
        const data = await fetch(
          "http://3.139.243.94:8000/nxtapi/input_files_summary/",
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

          const checkError = () => {
            JSON.parse(fileData.summary).data.map((data, index) => {
              console.log(data, "summery data");

              const check = data.includes("Bad");
              if (check) {
                setDataError(true);
              }
            });
          };
          checkError();
          setShowLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSummery();
  }, [fileData.summary]);

  return (
    <div className={styles.uploadSummery}>
      <div className={styles.headWrap}>
        {showLoading ? (
          <h2>Analyzing files please wait</h2>
        ) : (
          <>
            {" "}
            <h2>Upload Data Summery</h2>
            <span
              className={dataError ? styles.redBox : styles.greenBox}
            ></span>
          </>
        )}
      </div>
      {showLoading ? (
        <div className="lds-roller">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <>
          {" "}
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
                    {fileData === "" ? "" : fileData.total_csv_files}
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
              <button
                onClick={() => {
                  setUploadSummery(false);
                  setUploadData(true);
                }}
              >
                Discard & Reupload
                <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
              </button>
            ) : (
              ""
            )}
            <button
              disabled={fileData === "" ? true : false}
              onClick={() => {
                setUploadData(false);
                setUploadSummery(false);
                setResult(true);
                setCookie("ResultPage", true);
              }}
            >
              {dataError ? "Proceed as it is" : "Continue"}
              <MdKeyboardArrowRight style={{ fontSize: "20px" }} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DataSummery;
