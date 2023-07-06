import React , {useState} from 'react';
import styles from '../styles/Home.module.css'
import Link from 'next/link';
import {debug, toggleDebug } from '../lib/services/sessionManager'
function Layout({children}) {
    return (
        <div className={styles.layout}>
            {/* <h1> hey this is layout</h1> */}
            <span>
            <Link href='/homepage'> Homepage </Link>
            <button onClick={toggleDebug}> {`debug` }</button>
            </span>
            {children}
        </div>
    );
}

export default Layout;