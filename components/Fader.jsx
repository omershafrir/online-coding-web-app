import React from 'react';
import styles from '../styles/Home.module.css'

function Fader({state, children}) {
    return (
        <div className={state ? styles.fadeInShow : styles.fadeIn}>
            {children}
        </div>
    );
}

export default Fader;