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
        <h2>movement form</h2>
        <p>
          Movement is Sixth sense and we help <br />
          bring it back to humanity.
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
