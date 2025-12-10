"use client";

import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { authAPI } from "@/services/api";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/dashboard" className={styles.logo}>
          Bancomail
        </Link>
        <ul className={styles.menu}>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link href="/campaigns">Campaigns</Link>
          </li>
          <li>
            <Link href="/prospects">Prospects</Link>
          </li>
          <li>
            <Link href="/email-accounts">Email Accounts</Link>
          </li>
          <li>
            <Link href="/stats">Statistics</Link>
          </li>
          <li>
            <Link href="/inbox">Inbox</Link>
          </li>
        </ul>
        <div className={styles.user}>
          <span>{user?.name || user?.email}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
