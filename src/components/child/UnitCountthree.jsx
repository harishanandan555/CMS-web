import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../constants/constants";
import { Card, CardContent, Grid, Typography, Box } from "@mui/material";
import { People, Person, Business, Event } from "@mui/icons-material";

const UnitCountThree = () => {
  const [stats, setStats] = useState({
    totalAdvisors: 0,
    totalCustomers: 0,
    totalDistributors: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        };

        // Fetch advisors
        const advisorsRes = await axios.get(`${API_BASE_URL}/v1/superadmin/advisor/list`, config);
        const advisorsCount = advisorsRes.data?.result?.length || 0;

        // Fetch customers
        const customersRes = await axios.get(`${API_BASE_URL}/v1/superadmin/cms/admin/clientlist`, config);
        const customersCount = customersRes.data?.result?.length || 0;

        // Fetch distributors
        const distributorsRes = await axios.get(`${API_BASE_URL}/v1/superadmin/distributor/list`, config);
        const distributorsCount = distributorsRes.data?.result?.length || 0;

        // Fetch events
        const eventsRes = await axios.get(`${API_BASE_URL}/v1/cms/distributor/events`, config);
        const upcomingEventsCount = eventsRes.data?.result?.filter(event => 
          new Date(event.date) > new Date()
        ).length || 0;

        setStats({
          totalAdvisors: advisorsCount,
          totalCustomers: customersCount,
          totalDistributors: distributorsCount,
          upcomingEvents: upcomingEventsCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ height: '100%', bgcolor: color }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Icon sx={{ fontSize: 40, color: 'white' }} />
          </Box>
          <Typography variant="h4" component="div" color="white" gutterBottom>
            {value}
          </Typography>
          <Typography variant="h6" color="white">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      <StatCard
        title="Total Advisors"
        value={stats.totalAdvisors}
        icon={Person}
        color="#1976d2"
      />
      <StatCard
        title="Total Customers"
        value={stats.totalCustomers}
        icon={People}
        color="#2e7d32"
      />
      <StatCard
        title="Total Distributors"
        value={stats.totalDistributors}
        icon={Business}
        color="#ed6c02"
      />
      <StatCard
        title="Upcoming Events"
        value={stats.upcomingEvents}
        icon={Event}
        color="#9c27b0"
      />
    </Grid>
  );
};

export default UnitCountThree;
