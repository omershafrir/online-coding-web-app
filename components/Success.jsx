import React from 'react';
import styles from '../styles/Home.module.css'

function Success({ isCorrect , onBackHandler}) {
    return (
        <div className={styles.resultContainer}>
          <h1 className={styles.resultMessage}>{isCorrect ? `Well Done!` : `Try Again`}</h1>
          <span role="img" aria-label="Smiley" className={styles.smiley}>{isCorrect ? `😊` : `😔`}</span>
          <button className={ styles.button} onClick={onBackHandler}> Back to Editing</button>
        </div>
      )
    }

export default Success;