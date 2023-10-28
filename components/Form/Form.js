import React, { useState } from "react";
import styles from "./Form.module.css";
import { useRouter } from "next/router";
import loginUser from "../../lib/auth";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
const Form = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    password: false,
    user: false,
  });
  const [register, setRegister] = useState(false);
  const [query, setQuery] = useState({
    name: "",
    email: "",
    password: "",
    role: 1,
  });
  const handleParam = () => (e) => {
    setError({ user: false, password: false });
    const name = e.target.name;
    const value = e.target.value;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetch(
        register
          ? "http://3.139.243.94:8000/nxtapi/register/"
          : "http://3.139.243.94:8000/nxtapi/login/",
        {
          method: "POST",
          body: register
            ? JSON.stringify({
                username: query.email,
                password: query.password,
                first_name: query.name,
                last_name: query.email,
                role: query.role,
              })
            : JSON.stringify({
                username: query.email,
                password: query.password,
              }),
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((t) => t.json());

      if (data.status === true) {
        setLoading(false);
        loginUser({ data }, true);

        setQuery({
          name: "",
          email: "",
          password: "",
          role: 1,
        });
      }
      if (data.status === false) {
        setLoading(false);
        if (data.message === "User/Username already exists") {
          setError({ user: true, password: false });
        } else setError({ user: false, password: true });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form className={styles.form} onSubmit={formSubmit}>
      {register ? (
        <div className={styles.inputWrapper}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Your full name"
            value={query.name}
            onChange={handleParam()}
          />
        </div>
      ) : (
        ""
      )}

      <div className={styles.inputWrapper}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          value={query.email}
          onChange={handleParam()}
        />
        {error.user === true ? (
          <p style={{ fontSize: "14px", color: "red" }}>
            Email Id Already in Use
          </p>
        ) : (
          ""
        )}
      </div>

      <div className={styles.inputWrapper}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          required
          placeholder="Your password"
          value={query.password}
          onChange={handleParam()}
        />
        {error.password === true ? (
          <p style={{ fontSize: "14px", color: "red" }}>Invalid Credentials</p>
        ) : (
          ""
        )}
      </div>
      {register ? (
        <div className={styles.inputWrapperS}>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleToggle}
            />
            <span className={styles.slider}></span>
          </label>
          <p>Remember me</p>
        </div>
      ) : (
        ""
      )}
      {loading ? (
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
        <button type="submit"> {register ? "SIGN UP" : "SIGN IN"}</button>
      )}

      <div className={styles.bottom}>
        <p className={styles.normalText}>
          {register ? "Already have an account?" : "Don't have an account? "}
        </p>
        <p
          className={styles.hyperText}
          onClick={() => {
            setQuery({
              name: "",
              email: "",
              password: "",
              role: 1,
            });
            setError({ user: false, password: false });
            setRegister(!register);
          }}
        >
          {register ? "Sign in" : "Sign up"}
        </p>
      </div>
    </form>
  );
};

export default Form;
