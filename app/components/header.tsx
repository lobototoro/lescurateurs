import React from 'react';

import styles from './header.module.css';

export default function Header() {
  return (
    <header className={styles['header-title']}>
      <h1 className={styles.title}>LES CURATEURS</h1>
    </header>
  );
};
