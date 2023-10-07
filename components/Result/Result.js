import React, { useState, useEffect } from "react";
import styles from "../UploadData/upload.module.css";
import Image from "next/image";
import { getCookie } from "../../lib/useCookies";
import { AiFillCloseCircle } from "react-icons/ai";
import { BsCloudUpload } from "react-icons/bs";
import Link from "next/link";
const Result = ({ userID }) => {
  const patentID = getCookie("patientInfo");
  const [plots, setPlots] = useState([[]]);
  const [showPopup, setShowPopup] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);
  const [motUrl, setMotUrl] = useState("");
  const [Src, setSrc] = useState([]);
  const [fetchImage, setFetchImage] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showPlots, setShowPlots] = useState(false);

  const fetchData = async () => {
    setShowLoading(true);

    try {
      const getMot = async () => {
        const reqData = await fetch(
          "http://3.139.243.94:8000/nxtapi/generate_mot_result/",
          {
            method: "POST",
            body: JSON.stringify({
              patient_id: patentID,
              user_id: userID,
            }),
            redirect: "follow",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((t) => t.json());
        if (reqData.status === true) {
          setPlots(reqData.data.columns);
          setMotUrl(reqData.data.mot_url);
          reqData.data.columns.map((data, i) => {
            return setCheckboxes((prevCheckboxes) => [
              ...prevCheckboxes,
              { checkbox: false, value: data, id: i },
            ]);
            // const imageUrl = `https://nxtq.s3.us-east-2.amazonaws.com/patients_summary/${userID}/${patentID}/${data}.png`;
            // return setPlots(...plots, { name: data, img: imageUrl });
          });
          setShowLoading(false);
          setShowPlots(true);
        }
      };
      const data = await fetch(
        "http://3.139.243.94:8000/nxtapi/generate_sto/",
        {
          method: "POST",
          body: JSON.stringify({
            patient_id: patentID,
            user_id: userID,
          }),
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((t) => t.json());
      if (data.status === true) {
        setTimeout(() => {
          getMot();
        }, 1000);
      }
    } catch (error) {}
  };
  const handleCheckboxChange = (index) => {
    const updatedCheckbox = [...checkboxes]; // Create a copy of the state array
    updatedCheckbox[index].checkbox = !updatedCheckbox[index].checkbox; // Toggle the checkbox
    setCheckboxes(updatedCheckbox);

    console.log(checkboxes);
  };
  const generateImage = async () => {
    // const trueIndices = checkboxes
    //   .map((item, index) => (item.checkbox ? index : -1)) // Map true checkboxes to their indices, others to -1
    //   .filter((index) => index !== -1);
    // console.log(trueIndices);
    // const uniqueIndices = new Set();

    // trueIndices.forEach((index) => {
    //   plots.forEach((data) => {
    //     data.forEach((plotData, plotIndex) => {
    //       if (index === plotIndex && !uniqueIndices.has(index)) {
    //         console.log(plotData);
    //         setSrc((prevSrc) => [...prevSrc, plotData]);
    //         // Add the index to the Set to prevent duplicates
    //         uniqueIndices.add(index);
    //       }
    //     });
    //   });
    // });
    const selectedCheckboxes = checkboxes.filter(
      (checkbox) => checkbox.checkbox
    );

    reqFetchImage(selectedCheckboxes);
  };

  const reqFetchImage = async (selectedCheckboxes) => {
    let selectedImage = [];
    selectedCheckboxes.map((data, i) => {
      selectedImage.push(data.value);
    });
    setTimeout(async () => {
      try {
        const selectedCheck = Array.from(new Set(selectedImage));
        console.log(selectedCheck);
        const fetchImage = await fetch(
          "http://3.139.243.94:8000/nxtapi/fetch_multi_plots/",
          {
            method: "POST",
            body: JSON.stringify({
              user_id: userID,
              patient_id: patentID,
              plot_columns: selectedCheck,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((t) => t.json());
        if (fetchImage.status === true) {
          setSrc([]);
          setFetchImage(fetchImage.data);
        }
      } catch (error) {}
      setShowPopup(true);
    }, 3000);
  };

  return (
    <div className={styles.table}>
      {showPlots ? "" : <button onClick={fetchData}>Generate Result</button>}

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
        ""
      )}
      <div className={styles.colWrap}>
        {showPlots
          ? plots.map((data, i) => {
              const imageUrl = `https://nxtq.s3.us-east-2.amazonaws.com/patients_summary/${userID}/${patentID}/${data}.png`;

              return (
                <span className={styles.plotBox} key={i}>
                  <label>
                    <input
                      type="checkbox"
                      name="checkbox"
                      checked={checkboxes[i].checkbox}
                      onChange={() => handleCheckboxChange(i)}
                    />
                    {data}
                  </label>
                </span>
              );
            })
          : ""}
      </div>
      {checkboxes.length > 0 ? (
        <>
          <button onClick={generateImage}>Generate Plot</button>
          <Link href={motUrl}>
            <button
              style={{ display: "flex", alignItems: "center", gap: "5px" }}
            >
              <BsCloudUpload />
              Download Latest Mot
            </button>
          </Link>
        </>
      ) : (
        ""
      )}
      {showPopup ? (
        <div className={styles.popup}>
          <div className={styles.inPopup}>
            <AiFillCloseCircle
              className={styles.icon}
              onClick={() => setShowPopup(false)}
            />

            <div className="imgWrapper">
              <Image
                src={`https://nxtq.s3.us-east-2.amazonaws.com/patients_summary/${userID}/${patentID}/${fetchImage}`}
                width={205}
                height={474}
                className={styles.img}
                alt="measurement"
              />
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {/* {showPlots ? (
        <div className="imgWrapper">
          <Image
            src={Src}
            width={205}
            height={474}
            className={styles.img}
            alt="measurement"
          />
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default Result;
