import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("https://movie-booking-api.onrender.com");

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    socket.emit("joinRoom", showId);

    socket.on("seatUpdate", (updatedSeats) => {
      setSeats(updatedSeats);
      setIsBooking(false);
    });

    socket.on("seatSelectResult", (result) => {
      if (!result.success) {
        alert(result.message);
        setIsBooking(false);
      }
    });

    return () => {
      socket.off("seatUpdate");
      socket.off("seatSelectResult");
    };
  }, [showId]);

  const selectSeat = (index) => {
    if (isBooking || seats[index].booked) return;
    setIsBooking(true);
    socket.emit("selectSeat", { showId, index });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Go Back
      </button>

      <h2 className="text-2xl font-bold text-center mb-2">Select Your Seat</h2>
      <p className="text-center text-gray-600 mb-4">
        Booked: {seats.filter((s) => s.booked).length} / {seats.length}
      </p>

      <div className="grid grid-cols-8 gap-2 mb-4">
        {seats.map((seat, i) => (
          <button
            key={i}
            onClick={() => selectSeat(i)}
            disabled={seat.booked || isBooking}
            className={`p-2 text-white text-sm rounded ${
              seat.booked ? "bg-red-500" : "bg-green-500 hover:bg-green-600"
            } ${isBooking ? "opacity-50" : ""}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {isBooking && (
        <p className="text-center text-gray-500 animate-pulse">Booking seat...</p>
      )}
    </div>
  );
};

export default SeatSelection;
