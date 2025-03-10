import { Header } from "@/components/Header";
import styles from "./NotFound.module.css";
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Page not found</h2>
          <p className={styles.message}>Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
          <Link className={styles.button} href="/">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 