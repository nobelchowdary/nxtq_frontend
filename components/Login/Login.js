import React from "react";
import Image from "next/image";
import styles from "./Login.module.css";
import Form from "../Form/Form";

const Login = () => {
  return (
    <>
      <div className={styles.loginWrapper}>
        <div className="bgWrap">
          <Image
            src="/images/nexq-login-background.png"
            alt="nextQ Login background"
            fill={true}
          />
        </div>
        <h2>Welcome!</h2>
        <p>
          Use these awesome forms to login or create <br />
          new account in your project for free
        </p>
      </div>
      <div className={styles.formWrapper}>
        <div className={styles.formSet}>
          <Form />
        </div>
      </div>
    </>
  );
};

export default Login;
