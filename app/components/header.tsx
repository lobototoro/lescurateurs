import React from 'react';

import styles from './header.module.css';
import { ArticleTitle } from './single-elements/ArticleTitle';

export default function Header() {
  return (
    <header className={styles['header-title']}>
      <ArticleTitle
        text="LES CURATEURS"
        level="h1"
        size="extra-large"
        color="black"
      />
    </header>
  );
};
