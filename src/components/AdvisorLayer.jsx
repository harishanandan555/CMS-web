import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../constants/constants';
import { ProgressBar } from 'react-loader-spinner';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Chip,
  Paper,
  TextField,
  InputAdornment,
  Pagination
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Group as GroupIcon,
  Event as EventIcon,
  Search as SearchIcon,
  Add as AddIcon
} from '@mui/icons-material';

const AdvisorLayer = () => {
  const [advisorList, setAdvisorList] = useState([]);
  const [filteredAdvisors, setFilteredAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [qrCode, setQrCode] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const loadAdvisorList = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        setMessageText('Token not found. Please log in again.');
        setLoading(false);
        return;
      }

      const config = { headers: { 'bb-access-token': token } };
      const res = await axios.get(`${API_BASE_URL}/v1/superadmin/advisor/list`, config);

      if (res.data && res.data.result) {
        const mappedData = res.data.result.map((advisor) => ({
          id: advisor.id || 'N/A',
          name: advisor.name || 'N/A',
          fk_login_id: advisor.fk_login_id || 'N/A',
          category: advisor.category || 'N/A',
          description: advisor.description || 'N/A',
          currency: advisor.currency || 'N/A',
          price: advisor.price || 0,
          ratings: advisor.ratings || 0,
        }));
        setAdvisorList(mappedData);
      } else {
        setMessageText('No advisor data found.');
      }
    } catch (err) {
      setMessageText('Failed to load advisor data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerList = async (login_id) => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    const config = { headers: { 'bb-access-token': token, 'Content-Type': 'application/json' } };
    const response = await axios.post(`${API_BASE_URL}/v1/superadmin/advisor-customer/list`, { login_id }, config);

    if (response.data && response.data.result.length > 0) {
      navigate("/customer-list", { state: { customers: response.data.result } });
    } else {
      navigate("/customer-list", { state: { customers: [] } });
    }
  };

  const fetchEventList = async (fk_login_id) => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    const config = { headers: { 'bb-access-token': token, 'Content-Type': 'application/json' } };
    const response = await axios.post(`${API_BASE_URL}/v1/superadmin/advisor-event/list`, { fk_login_id }, config);

    const eventResults = response.data?.result || [];
    if (!Array.isArray(eventResults) || eventResults.length === 0) {
      alert("No events found.");
      return;
    }

    const formattedEvents = eventResults.map(eventData => {
      const step1 = eventData.step1?.[0] || {};
      const step2 = eventData.step2?.[0] || {};
      const step3 = eventData.step3?.[0] || {};

      return {
        id: eventData.fk_login_id || "N/A",
        title: step1.title || "No Title",
        description: step1.description || "No Description",
        eventDate: step2.eventDate || "No Date",
        customers: eventData.customers || [],
      };
    });

    navigate('/event-list', { state: { events: formattedEvents } });
  };

  const fetchQRList = async (fk_login_id) => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    const config = { headers: { 'bb-access-token': token, 'Content-Type': 'application/json' } };
    const response = await axios.post(`${API_BASE_URL}/v1/superadmin/event/qr/code`, { fk_login_id }, config);

    if (response.data && response.data.result) {
      setQrCode(response.data.result.qrCodeImage);
      setShowModal(true);
    } else {
      alert("Failed to fetch QR code.");
    }
  };

  const fetchQR = async (qrCode) => {
    const token = localStorage.getItem('user_token');
    if (!token) {
      alert("Token not found. Please log in again.");
      return;
    }

    const config = { headers: { 'bb-access-token': token, 'Content-Type': 'application/json' } };
    const response = await axios.post(`${API_BASE_URL}/v1/superadmin/scan/qr/code`, { qrCode }, config);

    if (response.data && response.data.result) {
      setShowModal(true);
    } else {
      alert("Failed to fetch QR code.");
    }
  };

  useEffect(() => {
    loadAdvisorList();
  }, []);

  useEffect(() => {
    if (qrCode) {
      fetchQR(qrCode);
    }
  }, [qrCode]);

  const openModal = (advisor) => {
    setSelectedAdvisor(advisor);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAdvisor(null);
  };

  // Filter and sort handlers
  useEffect(() => {
    let result = [...advisorList];

    if (searchTerm) {
      result = result.filter(advisor =>
        advisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        advisor.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      result = result.filter(advisor => advisor.category === filterCategory);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.ratings - a.ratings;
        case 'price':
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredAdvisors(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [advisorList, searchTerm, filterCategory, sortBy]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAdvisors = filteredAdvisors.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAdvisors.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ProgressBar visible={true} height="80" width="180" color="#4fa94d" ariaLabel="progress-bar-loading" />
      </div>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" color="primary" fontWeight="bold">Advisors</Typography>
        <Button component={Link} to="/add-advisor" variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
          Add New Advisor
        </Button>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 4, bgcolor: 'background.paper' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search advisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="all">All Categories</option>
              <option value="Financial">Financial</option>
              <option value="Investment">Investment</option>
              <option value="Tax">Tax</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              select
              fullWidth
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="name">Sort by Name</option>
              <option value="rating">Sort by Rating</option>
              <option value="price">Sort by Price</option>
            </TextField>
          </Grid>
        </Grid>
      </Paper>
      <Grid container spacing={3}>
  {currentAdvisors.map((advisor, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card elevation={3} sx={{
        height: '100%',
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
        },
      }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#1976d2' }}>
              {advisor.name}
            </Typography>
            <Chip label={advisor.category} color="primary" size="small" variant="outlined" />
          </Box>
          <Typography variant="body2" color="text.secondary" mb={2} sx={{
            height: '4em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {advisor.description}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={advisor.ratings} readOnly precision={0.5} size="small" />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({advisor.ratings})
            </Typography>
          </Box>
          <Typography variant="h6" color="primary" mb={2}>
            {advisor.currency} {advisor.price}
          </Typography>
          <Box display="flex" justifyContent="space-around" mt={2}>
            <IconButton onClick={() => openModal(advisor)} title="View Details" sx={{ bgcolor: 'rgba(25, 118, 210, 0.1)' }}>
              <VisibilityIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => fetchCustomerList(advisor.fk_login_id)} title="Customer List" sx={{ bgcolor: 'rgba(255, 140, 0, 0.1)' }}>
              <GroupIcon sx={{ color: '#FF8C00' }} />
            </IconButton>
            <IconButton onClick={() => fetchEventList(advisor.fk_login_id)} title="View Events" sx={{ bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
              <EventIcon color="success" />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>


      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>

      <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Scan QR Code</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={2}>
            {qrCode ? <img src={qrCode} alt="QR Code" style={{ width: "100%", maxWidth: "300px" }} /> : "Loading..."}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Viewing Advisor Details */}
      <Dialog open={modalIsOpen} onClose={closeModal} maxWidth="sm" fullWidth>
        {selectedAdvisor && (
          <>
            <DialogTitle>
              <Typography variant="h5" fontWeight="bold">{selectedAdvisor.name}</Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Description</Typography>
                <Typography variant="body1">{selectedAdvisor.description}</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Category</Typography>
                <Chip label={selectedAdvisor.category} color="primary" />
              </Box>
              <Box mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Ratings</Typography>
                <Rating value={selectedAdvisor.ratings} readOnly precision={0.5} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Price</Typography>
                <Typography variant="h6" color="primary">{selectedAdvisor.currency} {selectedAdvisor.price}</Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeModal} variant="contained">Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default AdvisorLayer;
