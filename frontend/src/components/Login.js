import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth.js";

const LOGIN_URL = "/api/v3/auth/login";

const Login = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      setAuth({ username: username, role: role, token:token });
      setRole(role)
      navigate(from, { replace: true });
    }
  }, [setAuth, from, navigate]);

  useEffect(() => {
    if (username || password) setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
          LOGIN_URL,
          JSON.stringify({ username:username, password:password }
      ));

      if (response.status === 200) {
        const { token, role } = response.data;

        setAuth({ username, role, token });

        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }

        setUsername("");
        setPassword("");
        navigate(from, { replace: true });
      }
    } catch (err) {
      handleLoginError(err);
      localStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const handleLoginError = (err) => {
    if (!err?.response) {
      setErrMsg("No Server Response");
    } else {
      switch (err.response?.status) {
        case 400:
          setErrMsg("Missing Username or Password");
          break;
        case 401:
          setErrMsg("Unauthorized - Check your credentials.");
          break;
        case 403:
          setErrMsg("Access Denied: Not authorized");
          break;
        default:
          setErrMsg(`Login error: ${err.response.statusText || "Please try again."}`);
      }
    }
  };

  return (
      <section className="login-section">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h1 className="text-center">Login</h1>


            <form onSubmit={handleSubmit}>
              <div className="form-group">

                <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

              </div>
              <div className="form-group">

                <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>
              <div className="form-group">
                <div className="custom-control custom-checkbox">
                  <input
                      type="checkbox"
                      placeholder={
                    rememberMe? "Remember Me" : "Don't remember me"
                      }
                      className="form-check-input"  id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}/>


                </div>
              </div>
              <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p
                  className={errMsg ? "text-danger" : "offscreen"}
                  aria-live="assertive"
              >
                {errMsg}
              </p>
              <Link to="/forgotpassword" className="d-block">
                Forgot Password?
              </Link>
            </form>
            <hr />
            <p>
              Don’t have an account? <Link to="/register">Register</Link>
            </p>
            <p>
              By continuing, you agree to our{"  "}
              <Link to="/terms-of-service">Terms of Service</Link> and{" "}
            </p>
          </div>
        </div>
      </section>
  );
};

export default Login;