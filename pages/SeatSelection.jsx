import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

// Connect to backend socket
const socket = io("http://localhost:5000");

function SeatSelection() {
    const { showId } = useParams();
    const [seats, setSeats] = useState([]);

    // Join room and listen for seat updates
    useEffect(() => {
        socket.emit("joinRoom", showId);

        socket.on("seatUpdate", (data) => {
            setSeats(data);
        });

        // Cleanup
        return () => socket.disconnect();
    }, [showId]);

    // Book a seat
    const selectSeat = (index) => {
        socket.emit("selectSeat", { showId, index });
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Select Seats</h2>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(8, 1fr)",
                    gap: "10px",
                    marginTop: "20px",
                }}
            >
                {seats.map((seat, i) => (
                    <button
                        key={i}
                        onClick={() => selectSeat(i)}
                        disabled={seat.booked}
                        style={{
                            padding: "10px",
                            backgroundColor: seat.booked ? "#999" : "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: seat.booked ? "not-allowed" : "pointer",
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SeatSelection;
