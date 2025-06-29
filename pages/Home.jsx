import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/shows").then((res) => {
            setShows(res.data);
        });
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Now Showing</h1>
            {shows.map((show) => (
                <div key={show._id}>
                    <h2>{show.title}</h2>
                    <p>{show.time}</p>
                    <Link to={`/select-seats/${show._id}`}>Book Seats</Link>
                    <hr />
                </div>
            ))}
        </div>
    );
}

export default Home;
