import React from 'react';
import { getTitles } from '../lib/mongo/index'
import Link from 'next/link';
import styles from '../styles/Home.module.css'
import Success from '../components/Success';

// export const getServerSideProps = async () => {
export const getStaticProps = async () => {
    const tasks = await getTitles()
    return {
        props: {
            tasks  
        }
      };
}

function tasks({tasks}) {
    return (
        <div className={styles.tasks}>
            <h1 > Choose a JavaScript Task!</h1>
            <ul>
                {tasks.map(task => (    
                <li key={task.id} >
                    <div className={styles.taskLi}> {`Task #${task.id}:\t `}</div>
                    <Link className={styles.link} href={{pathname:'/editor' ,
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