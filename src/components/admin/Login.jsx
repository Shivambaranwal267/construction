import React, { use, useContext } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../common/http";
import { toast } from "react-toastify";
import { AuthContext } from "./context/Auth";

const Login = () => {
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const res = await fetch(apiUrl+ 'authenticate', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      // console.log(data);
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();

    if (result.status == false) {
      toast.error(result.message || "Login failed");
    } else {
      const userInfo = {
        id: result.id,
        token: result.token,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      login(userInfo)
      toast.success(result.message || "Login successful");
      navigate("/admin/dashboard");
    }
  };

  return (
    <>
      <Header />
      <main>
        <div className="container my-5 d-flex justify-content-center">
          <div className="login-form my-5">
            <div className="card border-0 shadow">
              <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h4 className="mb-3">Admin Login</h4>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      id="email"
                      {...register("email", {
                        required: "The Email field is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="text"
                      placeholder="Email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                    />
                    {errors.email && (
                      <p className="invalid-feedback">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      id="password"
                      {...register("password", {
                        required: "The password field is required.",
                      })}
                      type="password"
                      placeholder="******"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                    />
                    {errors.password && (
                      <p className="invalid-feedback">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="d-flex justify-content-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Login;
