import React, { useState } from "react";
import Navbar from "./Navbar";
import { useFormik } from "formik";
import FormHelperText from "@material-ui/core/FormHelperText";
import * as Yup from "yup";
import Container from "react-bootstrap/Container";
import axios from "axios";
import Checkbox from "@material-ui/core/Checkbox";

import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";

import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";

import FormControl from "@material-ui/core/FormControl";
import GoogleButton from "react-google-button";

import GoogleLogin from "react-google-login";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { useHistory } from "react-router";
import ResetEmailBox from "./ResetEmailBox";
import FacebookLogin from "react-facebook-login";

const responsefailureGoogle = (response) => {
  console.log("google", response);
};

function Login() {
  const [success, setsuccess] = useState(true);
  const [message, setmessage] = useState();
  //const [loggedin, setloggedin] = useState(false);

  const history = useHistory();
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function login(data) {
    var res = await axios.post("http://localhost:3002/api/login", data);
    console.log(res.data);

    if (res.data.success === false) {
      setsuccess(res.data.success);
      setmessage(res.data.message);
    } else {
      setsuccess(true);
      localStorage.setItem("token", JSON.stringify(res.data.token));
      history.push("/");
      window.location.reload(false);
    }
  }

  const responsesuccessGoogle = (response) => {
    console.log(response);
    axios
      .post("http://localhost:3002/api/google", {
        tokenId: response.tokenId,
        accessToken: response.accessToken,
      })
      .then((response) => {
        console.log("login sucessful with google", response);
        localStorage.setItem("token", JSON.stringify(response));

        history.push("/");
      });
  };

  const responseFacebook = (response) => {
    console.log("facebook", response);
    axios
      .post("http://localhost:3002/api/facebook", {
        accessToken: response.accessToken,
        userID: response.userID,
      })
      .then((response) => {
        console.log("login successful with facebook", response);
        localStorage.setItem("token", JSON.stringify(response));
      });
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is requied"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,

    onSubmit: (values, e) => {
      console.log(values);
      login(values);
    },
  });

  return (
    <div>
      <div className="main_page">
        <Container>
          <Navbar />
        </Container>
        <div className="main_page2">
          <div className="login_form">
            <form onSubmit={formik.handleSubmit}>
              <div>
                <h4 className="login_title">Login</h4>
              </div>
              <div className="from_grp">
                <FormControl>
                  <InputLabel> Email</InputLabel>
                  <Input
                    name="email"
                    id="emailfield"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                  />
                </FormControl>
                <FormHelperText style={{ color: "red" }}>
                  {" "}
                  {formik.touched.email && formik.errors.email}
                </FormHelperText>
                <br></br>

                <FormControl>
                  <InputLabel> Password</InputLabel>
                  <Input
                    name="password"
                    className="passfield"
                    value={formik.values.password}
                    type={values.showPassword ? "text" : "password"}
                    // value={values.password}
                    onChange={formik.handleChange("password")}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <FormHelperText style={{ color: "red" }}>
                  {formik.touched.password && formik.errors.password}
                </FormHelperText>
                <br></br>
                <div className="errormess">
                  {success === false ? message : null}
                </div>
                <div className="forgotline">
                  <Checkbox color="primary" defaultChecked />

                  <b className="form_label">Remember Me</b>

                  <ResetEmailBox />
                </div>
                <button type="submit" className="loginbtn">
                  login to your account
                </button>
                <div className="out_text">OR</div>

                <GoogleLogin
                  clientId="883695351233-39aqie9akcd41052asuavr68uskfobfa.apps.googleusercontent.com"
                  render={(renderProps) => (
                    <GoogleButton
                      onClick={renderProps.onClick}
                      className="googlebtn"
                      type="light"
                    ></GoogleButton>
                  )}
                  buttonText="Login"
                  onSuccess={responsesuccessGoogle}
                  onFailure={responsefailureGoogle}
                  cookiePolicy={"single_host_origin"}
                />

                <br></br>
                <FacebookLogin
                  className="kep-login-facebook"
                  appId="4513438582008463"
                  autoLoad={false}
                  callback={responseFacebook}
                  render={(renderProps) => (
                    <button onClick={renderProps.onClick}></button>
                  )}
                />
             
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
