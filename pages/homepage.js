import React from 'react';
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import Loading from '../components/Loading';
function Homepage() {
    return (
        <div className={styles.homepage}>
            <h1> Online Coding Web App</h1>
            <Link className={styles.link} href='/tasks'> Tasks</Link>
        </div>
    );
}

export default Homepage;