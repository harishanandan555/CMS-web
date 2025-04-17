import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import {
  Group as GroupIcon,
  Person as PersonIcon,
  Event as EventIcon,
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../constants/constants';

const SuperAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAdvisors: 0,
    activeAdvisors: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
  });

  const [recentAdvisors, setRecentAdvisors] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        console.error('Token not found');
        return;
      }

      const config = { headers: { 'bb-access-token': token } };
      
      // Fetch advisors list
      const advisorsRes = await axios.get(`${API_BASE_URL}/v1/superadmin/advisor/list`, config);
      const advisors = advisorsRes.data?.result || [];
      
      // Update stats
      setStats({
        totalAdvisors: advisors.length,
        activeAdvisors: advisors.filter(a => a.status === 'Active').length,
        totalCustomers: 0, // To be implemented with actual API
        activeCustomers: 0, // To be implemented with actual API
        totalEvents: 0, // To be implemented with actual API
        upcomingEvents: 0, // To be implemented with actual API
      });

      // Set recent advisors
      setRecentAdvisors(advisors.slice(0, 5));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4">{value}</Typography>
          </Box>
          <IconButton
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              '&:hover': { backgroundColor: `${color}.light` },
            }}
          >
            {icon}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Dashboard Overview</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/add-advisor"
        >
          Add New Advisor
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Statistics Cards */}
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Advisors"
            value={stats.totalAdvisors}
            icon={<GroupIcon />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Advisors"
            value={stats.activeAdvisors}
            icon={<PersonIcon />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<EventIcon />}
            color="warning"
          />
        </Grid>

        {/* Recent Advisors */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Advisors</Typography>
              <Button
                component={Link}
                to="/advisors"
                endIcon={<VisibilityIcon />}
                size="small"
              >
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentAdvisors.map((advisor, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{advisor.name}</TableCell>
                      <TableCell>{advisor.category}</TableCell>
                      <TableCell>
                        <Chip
                          label={advisor.status || 'Active'}
                          color={advisor.status === 'Active' ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Recent Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Recent Events</Typography>
              <Button
                component={Link}
                to="/events"
                endIcon={<VisibilityIcon />}
                size="small"
              >
                View All
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentEvents.map((event, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={event.status}
                          color={event.status === 'Upcoming' ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SuperAdminDashboard;