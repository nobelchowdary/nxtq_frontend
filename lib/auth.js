import React, { useEffect } from "react";
import jsCookie from "js-cookie";
import Router from "next/router";
import nextCookies from "next-cookies";

const loginUser = ({ data }, remember) => {
  // console.log(data, "from auth");
  const userData = {
    token: data,
  };
  remember
    ? jsCookie.set("token", JSON.stringify(userData), {
        expires: 1,
        secure: false,
      })
    : jsCookie.set("token", token, {
        secure: false,
      });

  Router.push("/dashboard");
};
export default loginUser;
export const logout = () => {
  jsCookie.remove("token");

  // Log out from all windows
  window.localStorage.setItem("logout", Date.now());

  Router.push("/");
};

export const auth = (ctx) => {
  const { token } = nextCookies(ctx);

  if (!token) {
    if (typeof window === "undefined") {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
    } else {
      Router.push("/dashboard");
    }
  }

  return token;
};

export const withAuthSync = (WrappedComponent) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <WrappedComponent {...props} />;
  };

  Wrapper.getInitialProps = async (ctx) => {
    const token = auth(ctx);

    const componentProps =
      WrappedComponent.getInitialProps &&
      (await WrappedComponent.getInitialProps(ctx));

    return { ...componentProps, token };
  };

  return Wrapper;
};
