import React from 'react';
import { useLocation } from 'react-router-dom';

const EventDetailsPage = () => {
  const { state } = useLocation();
  const event = state?.event;

  // Importing images (assuming they're in the same order as your events)
  const imagePaths = [
    '../../../assets/images/amc_event1.jpg',
    '../../../assets/images/amc_event7.jpg',
    '../../../assets/images/amc_event2.jpg',

    '../../../assets/images/amc_event3.png',
    '../../../assets/images/amc_event4.png',
    '../../../assets/images/amc_event5.jpg',
    '../../../assets/images/amc_event6.jpg',
   
];
const imageIndex = Math.floor(Math.random() * imagePaths.length); // Or use a hash/index strategy
const eventImage = imagePaths[imageIndex];  
  if (!event) return <div>No event data found.</div>;

  const date = new Date(event.eventDate).toLocaleDateString();
  const regStart = new Date(event.registrationStart).toLocaleDateString();
  const regEnd = new Date(event.registrationEnd).toLocaleDateString();

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20, maxWidth: 1000, margin: 'auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>{event.title} - A {event.campaign_type} Event</h1>

      <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
        {/* Left Side (Image/Poster Placeholder) */}
        <div style={{ flex: 1 }}>
          <img
             src={eventImage}
            alt={event.title}
            style={{ width: '100%', borderRadius: 12, borderColor:'black',boxShadow: '0 4px 12px rgba(0,0,0,0.1)', height:'500px' }}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12 }}>
            <span style={tagStyle}>Seminar</span>
            <span style={tagStyle}>Offline</span>
            <span style={tagStyle}>{event.language}</span>
          </div>
          <div style={{ marginTop: 10, color: 'green' }}>✅ Available</div>
        </div>

        {/* Right Side (Details) */}
        <div style={{ flex: 1.2, border: '1.5px solid #000', borderRadius: 12, padding: 20 }}>
          <p><strong>📅 Date:</strong> {date}</p>
          <p><strong>⏰ Time:</strong> {event.eventTime}</p>
          <p><strong>⏳ Duration:</strong> {event.duration} Hours</p>
        
          <p><strong>🗣️ Language:</strong> {event.language}</p>
          <p><strong>🎵 Type:</strong> {event.campaign_type}</p>
          <p><strong>📍 Location:</strong> {event.eventAddress}</p>

          <p style={{ marginTop: 20 }}>
            <strong>🎫 Ticket(s):</strong>
            <ul>
              {event.tickets.map((ticket, idx) => (
                <li key={idx}>
                  {ticket.type} – ₹{ticket.amount} – {ticket.totaltickets} tickets
                </li>
              ))}
            </ul>
          </p>

          <p style={{ marginTop: 10 }}>
            <strong>📝 Registration:</strong><br />
            From {regStart} to {regEnd}
          </p>

          <button style={bookBtnStyle}>Book Now – ₹{event.tickets[0]?.amount}</button>
        </div>
      </div>

      {/* Description */}
      <div style={{ marginTop: 30 }}>
        <h2>About the Event</h2>
        <p>{event.description}</p>
      </div>
    </div>
  );
};

const tagStyle = {
  background: '#f0f0f0',
  borderRadius: 8,
  padding: '4px 10px',
  fontSize: 12,
};

const bookBtnStyle = {
  marginTop: 20,
  backgroundColor: '#f25c74',
  color: '#fff',
  padding: '12px 24px',
  fontSize: 16,
  fontWeight: 'bold',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

export default EventDetailsPage;
