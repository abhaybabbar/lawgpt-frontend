import { useRouter } from "next/router";
import styles from "../../styles/Home.module.css";
import { deleteCookie } from "cookies-next";
import Link from "next/link";

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
        <Link href="/">Legal Assistant</Link>
      </div>
      <div className="flex">
        <div className={styles.navlinks}>
          <Link href="https://quensulting.com/" target="_blank">
            Quensulting
          </Link>
        </div>
        <div className={styles.navlinks}>
          <a onClick={handleLogout}>logout</a>
        </div>
      </div>
    </div>
  );
}
