"use client";

import type React from "react";
import styles from "./bg.module.css";

interface GlowingBackgroundProps {
  children?: React.ReactNode;
}

const GlowingBackground: React.FC<GlowingBackgroundProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      {/* Background */}
      <div className={styles.background}>
        <div className={styles.beam1}></div>
        <div className={styles.beam2}></div>
        <div className={styles.beam3}></div>
      </div>
      {/* Content */}
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default GlowingBackground;
