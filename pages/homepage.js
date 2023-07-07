import React from 'react';
import Link from 'next/link'
import styles from '../styles/Home.module.css'
function Homepage() {
    return (
        <div className={styles.homepage}>
            <h1> Online Coding Web App</h1>
            <Link href='/tasks'> Choose Code Block</Link>
        </div>
    );
}

export default Homepage;