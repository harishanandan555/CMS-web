// EventFetcher.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, Clock, Users, DollarSign, Globe } from 'lucide-react';
import API_BASE_URL from '../../../constants/constants';
import { useNavigate } from 'react-router-dom';
 

const EventFetcher = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedEvent, setSelectedEvent] = useState(null);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };
    const navigate = useNavigate();
    const formatDate = (dateString) => {
        if (!dateString || dateString === "N/A") return "Not specified";
      
        const dateObj = new Date(dateString);
      
        return dateObj.toLocaleDateString('en-IN', {
          weekday: 'short',   // Mon, Tue...
          day: 'numeric',     // 15
          month: 'short'      // Apr
        });
      };
      

    const fetchEventDetails = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('amc_user_token');
            if (!token) {
                alert('Token not found. Please log in again.');
                return;
            }

            const response = await axios.get(
                `${API_BASE_URL}/v1/cms/distributor/events`,
                {
                    headers: {
                        'bb-access-token': token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const eventResults = response.data?.data || [];
            console.log("event res", response);

            if (!Array.isArray(eventResults) || eventResults.length === 0) {
                alert("No events found.");
                setEvents([]);
                setLoading(false);
                return;
            }

            const formattedEvents = eventResults.map(eventData => {
                const step1 = eventData.step1?.[0] || {};
                const step2 = eventData.step2?.[0] || {};
                const step3 = eventData.step3?.[0] || {};

                return {
                    id: eventData._id || "N/A",
                    campaign_type: step1.campaignType || "N/A",
                    title: step1.title || "No Title",
                    description: step1.description || "No Description",
                    commissionRate: step1.commission || 10,
                    created_by: step1.created_by || "N/A",
                    created_date: step1.created_date || "N/A",
                    is_active: step1.is_active ?? true,
                    language: step1.language || "N/A",
                    eventTime: step1.eventTime || "N/A",
                    duration: step1.duration || "N/A",
                    Visibility: step1.visibleTo || "N/A",
                    eventDate: step2.eventDate || "No Date",
                    registrationStart: step2.regStartDate || "N/A",
                    registrationEnd: step2.regEndDate || "N/A",
                    name: step2.formFields?.name || "N/A",
                    email: step2.formFields?.email || "N/A",
                    phone: step2.formFields?.phone || "N/A",
                    tickets: Array.isArray(step2.tickets)
                        ? step2.tickets.map(ticket => ({
                            totaltickets: ticket.totalTickets || 0,
                            amount: ticket.ticketPrice || 0,
                            type: ticket.ticketType || "N/A"
                        }))
                        : [],
                    eventAddress: step3.eventAddress || "N/A",
                    mode: step3.mode || "N/A",
                    customers: eventData.customers || [],
                    is_cancelled: eventData.is_cancelled ?? false,
                };
            });
            console.log("format", formattedEvents)
            setEvents(formattedEvents);
        } catch (err) {
            console.error(err);
            setError('Something went wrong while fetching events.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetails();
    }, []);

    if (loading) return <div className="loading-spinner">Loading events...</div>;
    if (error) return <div className="error-message">Error: {error}</div>;
    const imagePaths = [
        '../../../assets/images/amc_event1.jpg',
        '../../../assets/images/amc_event7.jpg',
        '../../../assets/images/amc_event2.jpg',

        '../../../assets/images/amc_event3.png',
        '../../../assets/images/amc_event4.png',
        '../../../assets/images/amc_event5.jpg',
        '../../../assets/images/amc_event6.jpg',
       
    ];


    const styles = {
        container: {
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
            fontFamily: 'Inter, sans-serif'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '20px',
            marginTop: '30px'
        },
        card: {
            display: 'flex',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
            background: 'white',
            cursor: 'pointer',
            height: '180px',
            transition: 'all 0.3s ease'
        },
        cardHover: {
            transform: 'scale(1.02)',
            boxShadow: '0 10px 24px rgba(0,0,0,0.15)'
        },
        imageContainer: {
            position: 'relative',
            width: '300px',
            flexShrink: 0
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        details: {
            padding: '20px',
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
        },
        title: {
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '6px',
            color: '#333'
        },
        meta: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13px',
            color: '#666'
        },
        campaignType: {
            backgroundColor: '#e0f2ff',
            color: '#0077cc',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 500
        },
        detailIcon: {
            width: '2rem', // Smaller icon
            height: '1rem', // Smaller icon
            
          },
        eventMode: {
            fontSize: '12px',
            color: '#999'
        },
        footer: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#444'
        },
        dateBadge: {
            backgroundColor: '#000',
            color: '#fff',
            padding: '4px 10px',
            fontSize: '12px',
            borderRadius: '6px',
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            fontWeight: 500,
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
        }
    };

    if (loading) return <div>Loading events...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={styles.container}>
            <div style={styles.grid}>
                {events.map((event, index) => (
                    <div
                        key={event.id}
                        style={styles.card}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                        onClick={() => navigate(`/event/${event.id}`, { state: { event } })}
                    >
                        {/* Image & Overlay */}
                        <div style={styles.imageContainer}>
                            <img
                                src={imagePaths[index % imagePaths.length]}
                                alt={event.title}
                                style={styles.image}
                            />

                            {/* Top Overlay */}
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                right: '10px',
                                zIndex: 2,
                                background: 'rgba(0, 0, 0, 0.55)',
                                padding: '8px',
                                borderRadius: '6px',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <div style={{
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    marginBottom: '4px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>{event.title}</div>
                                <div style={{
                                    color: '#cfeaff',
                                    fontSize: '12px'
                                }}>{event.campaign_type}</div>
                            </div>

                            {/* Date Badge */}
                            <div style={styles.dateBadge}>
                                {formatDate(event.eventDate)} | {event.eventTime}
                            </div>
                        </div>

                        {/* Details Section */}
                        <div style={styles.details}>
                            <div>

                                <div style={styles.meta}>

                                </div>
                            </div>

                            <div style={styles.footer}>
                                {/* In the footer section, replace the location/online display with: */}
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    color: '#666'
                                }}>
                                    {event.eventAddress && event.eventAddress !== "N/A" ? (
                                        <>
                                            <Globe size={14} style={{ color: '#ff3e3e' }} />  {event.eventAddress}
                                        </>
                                    ) : (
                                        <>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff3e3e" strokeWidth="2">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
      <span style={{ color: '#ff3e3e' }}>Online Event</span>
                                        </>
                                    )}
                                </span>

                                <span style={{ fontWeight: 500 }}><IndianRupee style={styles.detailIcon}/>{event.tickets[0].amount || 'Free'}</span>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default EventFetcher;
