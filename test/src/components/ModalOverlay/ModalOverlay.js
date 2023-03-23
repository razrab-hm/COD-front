import React from 'react';
import styles from './ModalOverlay.module.css';


function ModalOverlay({ close }) {
  return <div onClick={close} className={styles.modal__overlay}></div>;
}

export default ModalOverlay;
