import React from 'react';
import { useState } from 'react';
import { getTitles } from '../lib/mongo/index'
import Link from 'next/link';
import styles from '../styles/Home.module.css'

// export const getStaticProps = async () => {
export const getServerSideProps = async () => {
    const tasks = await getTitles()
    return {
        props: {
            tasks  
        }
      };
}

const mystyle = {
    marginLeft: '5%'
}
function tasks({tasks}) {
    return (
        <div className={styles.tasks}>
            <h1> Choose a Code Block!</h1>
            <ul>
                {tasks.map(task => (    
                <li key={task.id} >
                    <div> {`Task #${task.id}:\t `}</div>
                    <Link style={mystyle} href={{pathname:'/editor' ,
                                    query: {id:task.id} }}> 
                                    {task.title}
                    </Link>
                </li>
                ))}
            </ul>
        </div>
    );
}

export default tasks;