import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <section>
      <h1 className={styles['home-title']}>GRUIK</h1>
    </section>
  );
}
