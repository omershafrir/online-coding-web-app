import React from 'react';
import Link from 'next/link'
function Homepage() {
    return (
        <div>
            <h1> Online Coding Web App</h1>
            <Link href='/tasks'> Choose Code Block</Link>
        </div>
    );
}

export default Homepage;