import React, { useState, useEffect } from "react";
import styles from "../styles/dashboard.module.css";
import { withAuthSync } from "../../lib/auth";
import { logout } from "../../lib/auth";
import {
  MdKeyboardArrowDown,
  MdNotifications,
  MdInsertChart,
  MdStickyNote2,
  MdWorkHistory,
} from "react-icons/md";
import { useRouter } from "next/router";
import { BsInfoLg } from "react-icons/bs";
import { BiSolidUserCircle } from "react-icons/bi";
import UploadData from "../../components/UploadData/UploadData";
import DataSummery from "../../components/DataSummery/DataSummery";
import { getCookie, setCookie } from "../../lib/useCookies";
import Result from "../../components/Result/Result";

const dashboard = (props) => {
  const router = useRouter();
  console.log(props.token.token.data, "in dashboard");

  const [showProfile, setShowProfile] = useState(false);
  const [uploadData, setUploadData] = useState(true);
  const [uploadSummery, setUploadSummery] = useState(false);
  const [result, setResult] = useState(false);
  const [activeMenu, setActiveMenu] = useState({
    Dashboard: true,
    History: false,
    Report: false,
    Help: false,
  });

  useEffect(() => {
    const uploadOn = getCookie("disableUpload");
    const summeryOn = getCookie("goToSummery");

    if (summeryOn === false || summeryOn === true) {
      setUploadSummery(summeryOn);
    } else {
      setUploadSummery(false);
    }
    if (uploadOn === false || uploadOn === true) {
      setUploadData(uploadOn);
    } else {
      setUploadData(true);
    }
  }, []);

  const goToResult = (data) => {
    setResult(data);
  };
  const goToSummery = (data) => {
    setUploadSummery(data);
    setCookie("goToSummery", data);
  };
  const disableUpload = (data) => {
    setUploadData(data);
    setCookie("disableUpload", data);
  };
  // const username = props.token.token.email.split("@");
  return (
    <div className={styles.navWrap}>
      <nav className={styles.nav} style={{ backgroundColor: "white" }}>
        <p className={styles.logo}>NextQ pvt ltd.</p>
        <div className={styles.profile}>
          <div
            className={styles.profileWrap}
            onClick={() => setShowProfile(true)}
            onMouseEnter={() => setShowProfile(true)}
          >
            <BiSolidUserCircle className={styles.profileIcon} />
            <p>{props.token.token.data.first_name}</p>
            <MdKeyboardArrowDown className={styles.icon} />
          </div>
          {showProfile ? (
            <div
              className={styles.profileSet}
              onMouseEnter={() => setShowProfile(true)}
              onMouseLeave={() => setShowProfile(false)}
            >
              <span>My Account</span>
              <span>setting</span>
              <span onClick={logout}>logout</span>
            </div>
          ) : (
            ""
          )}
          <MdNotifications className={styles.icon} />
        </div>
      </nav>
      <div className={styles.dashboardWrap}>
        <div className={styles.leftBar}>
          <div className={styles.stickyWrap}>
            <div className={styles.menu}>
              <span
                onClick={() => {
                  setActiveMenu({
                    Dashboard: true,
                    History: false,
                    Report: false,
                    Help: false,
                  });
                  router.push("/dashboard").then(() => router.reload());
                }}
                className={
                  activeMenu.Dashboard ? styles.activeSpan : styles.inActiveSpan
                }
              >
                <MdInsertChart
                  className={
                    activeMenu.Dashboard
                      ? styles.activeIcon
                      : styles.inActiveIcon
                  }
                />{" "}
                <p>Dashboard</p>
              </span>
              <span
                className={
                  activeMenu.History ? styles.activeSpan : styles.inActiveSpan
                }
                onClick={() =>
                  setActiveMenu({
                    Dashboard: false,
                    History: true,
                    Report: false,
                    Help: false,
                  })
                }
              >
                <MdWorkHistory
                  className={
                    activeMenu.History ? styles.activeIcon : styles.inActiveIcon
                  }
                />{" "}
                <p> History</p>
              </span>
              <span
                className={
                  activeMenu.Report ? styles.activeSpan : styles.inActiveSpan
                }
                onClick={() =>
                  setActiveMenu({
                    Dashboard: false,
                    History: false,
                    Report: true,
                    Help: false,
                  })
                }
              >
                <MdStickyNote2
                  className={
                    activeMenu.Report ? styles.activeIcon : styles.inActiveIcon
                  }
                />
                <p> Report</p>
              </span>
              <span
                className={
                  activeMenu.Help ? styles.activeSpan : styles.inActiveSpan
                }
                onClick={() =>
                  setActiveMenu({
                    Dashboard: false,
                    History: false,
                    Report: false,
                    Help: true,
                  })
                }
              >
                <BsInfoLg
                  className={
                    activeMenu.Help ? styles.activeIcon : styles.inActiveIcon
                  }
                />
                <p> Help</p>
              </span>
            </div>
          </div>
        </div>
        <div className={styles.dashboardItem}>
          {uploadData ? (
            <UploadData
              userID={props.token.token.data.user_id}
              patientId={props.token.token.data.patients}
              setUploadSummery={goToSummery}
              setUploadData={disableUpload}
              uploadData={uploadData}
            />
          ) : (
            ""
          )}
          {uploadSummery ? (
            <DataSummery
              userID={props.token.token.data.user_id}
              setUploadData={disableUpload}
              setUploadSummery={goToSummery}
              setResult={goToResult}
            />
          ) : (
            ""
          )}
          {result ? <Result userID={props.token.token.data.user_id} /> : ""}
        </div>
      </div>
    </div>
  );
};

export default withAuthSync(dashboard);
