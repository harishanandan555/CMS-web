import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../../constants/constants';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Eye,
  Tag,
  Ticket,
  ChevronDown,
  ChevronUp,
  XCircle,
  DollarSign,
  User,
  Mail,
  Phone,
  X, Globe,
  IndianRupee
} from 'lucide-react';

const CATEGORIES = [
  'Conference',
  'Workshop',
  'Seminar',
  'Networking',
  'Training',
  'Social',
  'Other'
];

const AMCdash = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    fetchEventDetails();
  }, []);

  const fetchEventDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('amc_user_token');
      if (!token) {
        alert('Token not found. Please log in again.');
        return;
      }

      const config = {
        headers: {
          'bb-access-token': token,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.get(
        `${API_BASE_URL}/v1/cms/amc/event/list`,
        config
      );

      const eventResults = response.data?.result || [];

      console.log("event res", response)
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

      setEvents(formattedEvents);
    } catch (err) {
      console.error(err);
      setError('Something went wrong while fetching events.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events
    .filter(event =>
    (event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventAddress?.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(event => !selectedCategory || event.campaign_type === selectedCategory);



  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };
  const imagePaths = [
    '../../../assets/images/amc_event1.jpg',
    '../../../assets/images/amc_event7.jpg',
    '../../../assets/images/amc_event2.jpg',

    '../../../assets/images/amc_event3.png',
    '../../../assets/images/amc_event4.png',
    '../../../assets/images/amc_event5.jpg',
    '../../../assets/images/amc_event6.jpg',
    // Add more image paths as needed
  ];
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options); // e.g. "12 Jan"
  };
  

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h2 style={styles.headerTitle}>Events</h2>
          <button
            onClick={() => navigate('/amc-event')}
            style={styles.createButton}
          >
            Create Event
          </button>
        </div>
      </header>

      {/* Search & Filter */}
      <section style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <div style={styles.searchInputContainer}>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          <div style={styles.filterContainer}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.filterSelect}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <span style={styles.filterIcon}>🔽</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {filteredEvents.length === 0 ? (
          <div style={styles.noEventsMessage}>
            {events.length === 0
              ? 'No events created yet. Click "Create Event" to get started!'
              : 'No matching events found.'}
          </div>
        ) : (
          <div style={styles.eventGrid}>
            {filteredEvents.map((event, index) => (
              <div key={event.id} style={styles.eventCard}>
                {/* Card Header */}
                <div style={styles.cardHeader}>
                  <div>
                    {/* Background Banner Container */}
                    <div style={{
  backgroundImage: `url(${imagePaths[index % imagePaths.length]})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  width: '300px',
  height: '180px',
  borderRadius: '12px',
  marginBottom: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
}}>
  {/* Title overlayed in center */}
  <h4 style={{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.5rem',
    fontWeight: '500',
    color: '#FFFFFF',
    margin: 0,
    textAlign: 'center',
    padding: '0 10px',
    textShadow: '0 2px 4px rgb(10, 8, 8)'
  }}>
    {event.title}
  </h4>

  {/* Enhanced Bottom Bar */}
  <div style={{
    width: '100%',
    height: '36px',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    color: '#fff',
    fontSize: '0.9rem',
    borderBottomLeftRadius: '12px',
    borderBottomRightRadius: '12px',
    display: 'flex',
    alignItems: 'center',
   
    gap: '8px',
    padding: '0 12px',
    backdropFilter: 'blur(2px)'
  }}>
    {/* Orange Time Icon */}
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <path 
        d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
        stroke="#FFA500" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
    
    {/* Date & Time */}
    <span style={{ whiteSpace: 'nowrap' }}>
      {new Date(event.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} 
      <span style={{ margin: '0 4px', opacity: 0.7 }}>•</span>
      {event.eventTime}
    </span>
  </div>
</div>




                    {/* Tags */}
                    <div style={styles.eventTags}>
                      <span style={styles.tag}>
                        <Tag style={styles.tagIcon} />
                        {event.campaign_type}
                      </span>
                      <span style={{
                        ...styles.tag,
                        backgroundColor: event.is_active ? '#DCFCE7' : '#FEE2E2',
                        color: event.is_active ? '#15803D' : '#B91C1C'
                      }}>
                        <Eye style={styles.tagIcon} />
                        {event.Visibility}
                      </span>
                    </div>
                  </div>

                  {/* Cancelled Badge */}
                  {event.is_cancelled && (
                    <div style={styles.cancelledBadge}>
                      <XCircle style={styles.cancelledIcon} />
                      <span>Cancelled</span>
                    </div>
                  )}
                </div>


                {/* Main Event Details */}
                <div style={styles.eventDetails}>

                  <div style={styles.detailItem}>
                    <MapPin style={styles.detailIcon} />
                    <div>

                      <p>{event.mode} - {event.eventAddress}</p>
                    </div>
                  </div>
                  <div style={styles.detailItem}>
                    <Ticket style={styles.detailIcon} />
                    <div>

                      <p>{formatCurrency(event.tickets[0]?.amount || 0)}</p>
                    </div>
                  </div>
                </div>

                {/* Toggle Details Button */}
                <button
                  onClick={() => openModal(event)}
                  style={styles.toggleButton}
                >
                  View More Details
                  <ChevronDown style={styles.toggleIcon} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>

              <button onClick={closeModal} style={styles.closeButton}>
                <X style={styles.closeIcon} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Registration Period */}
              <div style={styles.detailSection}>
                <h3 style={styles.sectionTitle}>Registration Period</h3>
                <div style={styles.detailItem}>
                  <Clock style={styles.detailIcon} />
                  <div>
                    <p style={styles.detailLabel}>Starts</p>
                    <p>{formatDate(selectedEvent.registrationStart)}</p>
                  </div>
                </div>
                <div style={styles.detailItem}>
                  <Clock style={styles.detailIcon} />
                  <div>
                    <p style={styles.detailLabel}>Ends</p>
                    <p>{formatDate(selectedEvent.registrationEnd)}</p>
                  </div>
                </div>
              </div>

              {/* Ticket Details */}
              <div style={styles.detailSection}>
                <h3 style={styles.sectionTitle}>Ticket Details</h3>
                {selectedEvent.tickets.map((ticket, index) => (
                  <div key={index} style={styles.ticketGrid}>
                    <div style={styles.detailItem}>
                      <Users style={styles.detailIcon} />
                      <div>
                        <p style={styles.detailLabel}>Available Tickets</p>
                        <p>{ticket.totaltickets}</p>
                      </div>
                    </div>
                    <div style={styles.detailItem}>
                      <IndianRupee style={styles.detailIcon} />
                      <div>
                        <p style={styles.detailLabel}>Total Value</p>
                        <p>{formatCurrency(ticket.amount * ticket.totaltickets)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

                {/* Event Details */}
  <div style={styles.detailSection}>
    <h3 style={styles.sectionTitle}>Event Details</h3>
    {/* Duration */}
    <div style={styles.detailItem}>
      <Clock style={styles.detailIcon} />
      <div>
        <p style={styles.detailLabel}>Duration </p>
        <p>{selectedEvent.duration || "Not specified"} hrs</p>
      </div>
    </div>
    {/* Language */}
    <div style={styles.detailItem}>
      <Globe style={styles.detailIcon} />
      <div>
        <p style={styles.detailLabel}>Language</p>
        <p>{selectedEvent.language || "Not specified"}</p>
      </div>
    </div>
  </div>


              {/* Contact Information */}
              {/* <div style={styles.detailSection}>
                                <h3 style={styles.sectionTitle}>Contact Information</h3>
                                <div style={styles.detailItem}>
                                    <User style={styles.detailIcon} />
                                    <div>
                                        <p style={styles.detailLabel}>Name</p>
                                        <p>{selectedEvent.name}</p>
                                    </div>
                                </div>
                                <div style={styles.detailItem}>
                                    <Mail style={styles.detailIcon} />
                                    <div>
                                        <p style={styles.detailLabel}>Email</p>
                                        <p>{selectedEvent.email}</p>
                                    </div>
                                </div>
                                <div style={styles.detailItem}>
                                    <Phone style={styles.detailIcon} />
                                    <div>
                                        <p style={styles.detailLabel}>Phone</p>
                                        <p>{selectedEvent.phone}</p>
                                    </div>
                                </div>
                            </div> */}

              {/* Commission Details */}
              <div style={styles.detailSection}>
                <h3 style={styles.sectionTitle}>Commission Details</h3>
                <div style={styles.detailItem}>
                  <DollarSign style={styles.detailIcon} />
                  <div>
                    <p style={styles.detailLabel}>Commission Rate</p>
                    <p>{selectedEvent.commissionRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',

  },
  header: {
    backgroundColor: '#3B82F6',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 4px 6px rgba(17, 70, 122, 0.1)',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '14px',

  },
  createButton: {
    backgroundColor: 'white',
    color: '#1F2937',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    cursor: 'pointer',
  },
  searchSection: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 16px',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexWrap: 'wrap',
  },
  searchInputContainer: {
    position: 'relative',
    flex: '1',
  },
  searchInput: {
    width: '100%',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    outline: 'none',
    transition: 'border-color 0.2s',
    paddingLeft: '40px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#A0AEC0',
  },
  filterContainer: {
    position: 'relative',
  },
  filterSelect: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    outline: 'none',
    transition: 'border-color 0.2s',
    paddingLeft: '40px',
  },
  filterIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#A0AEC0',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    paddingBottom: '32px',
    padding: '0 16px',
  },
  noEventsMessage: {
    textAlign: 'center',
    padding: '32px 0',
    color: '#4A5568',
  },
  eventGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', // Smaller card width
    gap: '1rem', // Reduced gap between cards
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
    border: '1px solid #F3F4F6',
    padding: '12px', // Reduced padding
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem', // Reduced margin
  },
  eventTitle: {
    fontWeight: '400',
    color: '#1E3A8A',
    fontFamily: "'Inter', sans-serif", // Updated font family
    marginBottom: '0.5rem',
    textShadow: 'none',
    lineHeight: '1.3',
    letterSpacing: 'normal',
  },


  eventTags: {
    display: 'flex',
    gap: '0.85rem', // Reduced gap
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.125rem 0.5rem', // Smaller padding
    borderRadius: '9999px',
    fontSize: '0.75rem', // Smaller font size
    fontWeight: 500,
    backgroundColor: '#EBF5FF',
    color: '#1D4ED8',
  },
  eventDetails: {
    marginTop: '0.5rem', // Reduced margin
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem', // Reduced gap
    padding: '0 0.5rem', // Reduced padding
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem', // Reduced gap
    color: '#4B5563',
    fontSize: '0.875rem', // Smaller font size
  },
  detailIcon: {
    width: '2rem', // Smaller icon
    height: '1rem', // Smaller icon
    color: '#FFA500',
  },
  detailLabel: {
    fontWeight: 500,
    fontSize: '0.875rem',
    color: '#374151',
  },
  toggleButton: {
    marginTop: '1.5rem',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(45deg,rgb(165, 197, 242),rgb(102, 146, 229) 70%)', // Light blue gradient
    color: '#ffffff',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.2s',
    '&:hover': {
      background: 'linear-gradient(45deg, rgb(165, 197, 242), rgb(102, 146, 229) 70%)', // Darker light blue gradient on hover
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },


  toggleIcon: {
    width: '1rem',
    height: '1rem',
    marginLeft: '0.5rem',
    transition: 'transform 0.2s', // Smooth icon transition
    '&:hover': {
      transform: 'translateX(2px)', // Slight icon movement on hover
    },
  },

  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '1.5rem',
    position: 'relative',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  modalTitle: {
    fontSize: '0.5rem',
    fontWeight: '200',
    color: '#1E3A8A',
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  closeIcon: {
    width: '1.25rem',
    height: '1.25rem',
    color: '#6B7280',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  detailSection: {
    backgroundColor: '#F9FAFB',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: 300,
    color: '#3B82F6',
    marginBottom: '1rem',
  },
  ticketGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
};

export default AMCdash;
