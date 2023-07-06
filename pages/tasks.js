import React from 'react';
import { useState } from 'react';
import { getTasks } from '../lib/mongo/index'
import Link from 'next/link';

// export const getStaticProps = async () => {
export const getServerSideProps = async () => {
    const tasks = await getTasks()
    return {
        props: {
            tasks  
        }
      };
}

function tasks({tasks}) {
    const liStyle = {
        backgroundColor: 'tan',
        color: 'white',
        display: 'flex',
        alignItems: 'center'
      };
    return (
        <div>
            <h1> Choose a Code Block!</h1>
            <ul>
                {tasks.map(task => (    <li key={task.id} style={liStyle}>
                                                    <div> {`Task #${task.id}:\t `}</div>
                                                    <Link href={{pathname:'/editor' ,
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