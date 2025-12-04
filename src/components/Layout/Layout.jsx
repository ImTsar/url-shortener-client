import styles from "./Layout.module.css";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  function handleLogout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <div className={styles.pageWrapper}>

      <nav className={styles.nav}>
        <div className={styles.container}>
          <div className={styles.navInner}>

            <div className={styles.left}>
              <Link to="/urls">URLs</Link>
              <Link to="/about">About</Link>

              {role === "Admin" && (
                <span className={styles.adminBadge}>Admin</span>
              )}
            </div>

            <div className={styles.right}>
              {!token ? (
                <Link to="/login" className={styles.loginBtn}>Login</Link>
              ) : (
                <button className={styles.logoutBtn} onClick={handleLogout}>
                  Logout
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>

    </div>
  );
}
