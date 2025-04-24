import React from 'react';
import { useEffect, useState } from 'react';
import CountUp from './ReUseable/Counter'; // Assuming CountUp is in the same directory

export default function DiscrepancyCounter() {
    const [mistakes, setMistakes] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMistakes() {
            try {
                const response = await fetch(
                    'https://localhost:4000/api/violations'
                ); // Replace with your API endpoint
                const data = await response.json();
                setMistakes(data.mistakes); // Assuming API returns { mistakes: number }
            } catch (error) {
                console.error('Error fetching mistakes:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMistakes();
    }, []);

    return (
        <div>
            <h2>Mistakes:</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <CountUp
                    to={mistakes}
                    duration={1.5}
                    className='text-red-500 text-xl'
                />
            )}
        </div>
    );
}
