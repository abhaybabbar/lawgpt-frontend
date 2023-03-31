import { useState } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { backend_url } from "./api/_healper";
import styles from "../styles/Login.module.css";
import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch(`${backend_url}/dj-rest-auth/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const data = await response.json();

    if (data.key) {
      // localStorage.setItem("token", data.token);
      console.log(data);
      console.log(data.key);
      setCookie("token", data.key);
      // setCookie("logged", "true");
      router.push("/");
    } else {
      setIsLoading(false);
      setError("Invalid username or password");
    }
  };

  return (
    <div className={styles.main}>
      <div className={`${styles.flex} `}>
        <form
          className={`${styles.flex_column} ${styles.login_box}`}
          onSubmit={handleLogin}
        >
          <div className={`${styles.flex_column}`}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              className={styles.login_input}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={`${styles.flex_column}`}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              className={styles.login_input}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.relative}>
            {isLoading ? (
              <div className={styles.loadingwheel}>
                <CircularProgress color="primary" size={20} />{" "}
              </div>
            ) : (
              <button type="submit" className={styles.button}>
                Login
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
