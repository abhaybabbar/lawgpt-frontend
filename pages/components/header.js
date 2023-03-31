import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { deleteCookie } from "cookies-next";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    // localStorage.removeItem("token");
    deleteCookie("token");
    router.push("/login");
  };

  return (
    <div className={styles.topnav}>
      <div className={styles.navlogo}>
        <a href="/">Legal Assistant</a>
      </div>
      <div className="flex">
        <div className={styles.navlinks}>
          <a href="https://quensulting.com/" target="_blank">
            Quensulting
          </a>
        </div>
        <div className={styles.navlinks}>
          <a onClick={handleLogout}>logout</a>
        </div>
      </div>
    </div>
  );
}
