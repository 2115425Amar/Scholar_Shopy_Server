import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Lottie from "lottie-react";
import ContactAnimation from "../../assets/JSON/register.json";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [answer, setAnswer] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();

  // Form function
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name, email, password, phone, address, answer);

    try {
      // Construct the API endpoint URL
      // console.log(`${process.env.REACT_APP_API}/api/v1/auth/Register`);

      // Make the POST request
      const res = await axios.post("/api/v1/auth/Register", {
        name,
        email,
        password,
        phone,
        address,
        answer,
      });
      // Check the response and show appropriate toast messages
      if (res && res.data.success) {
        toast.success(res.data.message);
        // Redirect to the login page after successful registration
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle error and show an appropriate toast message
      toast.error("An error occurred during registration.");
    }
  };

  // console.log(process.env.REACT_APP_API);

  return (
    // <Layout title="Register">
    //   <div className="register">

    //     <h1>Register </h1>

    //     <form onSubmit={handleSubmit}>

    //       <div className="mb-3">
    //         <input
    //           type="text"
    //           value={name}
    //           onChange={(e) => setName(e.target.value)}
    //           className="form-control"
    //           id="exampleInputname"
    //           placeholder="Enter Your Name"
    //           required
    //         />
    //       </div>
    //       <div className="mb-3">
    //         <input
    //           type="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           className="form-control"
    //           id="exampleInputEmail"
    //           placeholder="Enter Your email"
    //           required
    //         />
    //       </div>

    //       <div className="mb-3">
    //         <input
    //           type="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           className="form-control"
    //           id="exampleInputPassword1"
    //           placeholder="Enter Your Password"
    //           required
    //         />
    //       </div>

    //       <div className="mb-3">
    //         <input
    //           type="text"
    //           value={phone}
    //           onChange={(e) => setPhone(e.target.value)}
    //           className="form-control"
    //           id="exampleInputText"
    //           placeholder="Enter Your phone"
    //           required
    //         />
    //       </div>

    //       <div className="mb-3">
    //         <input
    //           type="text"
    //           value={address}
    //           onChange={(e) => setAddress(e.target.value)}
    //           className="form-control"
    //           id="exampleInputAddress"
    //           placeholder="Enter Your  Address"
    //           required
    //         />
    //       </div>

    //       <div className="mb-3">
    //         <input
    //           type="text"
    //           value={answer}
    //           onChange={(e) => setAnswer(e.target.value)}
    //           className="form-control"
    //           id="exampleInputanswer"
    //           placeholder="Your Best Friend Name?"
    //           required
    //         />
    //       </div>

    //       <div className="d-grid gap-2">
    //         <button className="btn btn-secondary bg-primary" type="submit">Submit</button>
    //       </div>
    //     </form>
    //   </div>

    <Layout>
      <section className="vh-80" style={{ backgroundColor: "#eee" }}>
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-10">
              <div className="card text-black" style={{ borderRadius: 25 }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p className="text-center h1 fw-bold mb-4 mx-1 mx-md-4 mt-4">
                        Sign up
                      </p>
                      <form className="mx-1 mx-md-4" onSubmit={handleSubmit}>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-user fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="form-control"
                              id="exampleInputname"
                              placeholder="Enter Your Name"
                              required
                            />
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-envelope fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="form-control"
                              id="exampleInputEmail"
                              placeholder="Enter Your email"
                              required
                            />
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-lock fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="form-control"
                              id="exampleInputPassword1"
                              placeholder="Enter Your Password"
                              required
                            />
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="form-control"
                              id="exampleInputText"
                              placeholder="Enter Your phone"
                              required
                            />
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="form-control"
                              id="exampleInputAddress"
                              placeholder="Enter Your  Address"
                              required
                            />
                          </div>
                        </div>
                        <div className="d-flex flex-row align-items-center mb-4">
                          <i className="fas fa-key fa-lg me-3 fa-fw" />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              type="text"
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              className="form-control"
                              id="exampleInputanswer"
                              placeholder="Your Best Friend Name?"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-check d-flex justify-content-center mb-5">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            defaultValue=""
                            id="form2Example3c"
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form2Example3"
                          >
                            I agree all statements in{" "}
                            <a href="#!">Terms of service</a>
                          </label>
                        </div>
                        <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                          <button
                            className="btn btn-primary btn-lg"
                            type="submit"
                          >
                            Register
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      {/* <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                        className="img-fluid"
                        alt="Sample"
                      /> */}
                      <Lottie animationData={ContactAnimation} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Register;
