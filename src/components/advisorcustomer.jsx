import { useLocation, useNavigate } from "react-router-dom";
import { 
    Box,
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Grid,
    Skeleton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import { useState } from 'react';

const CustomerList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const customers = location.state?.customers || [];

    // Helper function to format date (YYYY-MM-DD)
    const formatDate = (dateTime) => {
        if (!dateTime) return "N/A";
        return new Date(dateTime).toISOString().split("T")[0];
    };

    // Filter customers based on search term
    const filteredCustomers = customers.filter(customer =>
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobile_number.includes(searchTerm)
    );

    // Statistics calculation
    const totalCustomers = customers.length;
    const activeSubscriptions = customers.filter(c => c.subscription).length;
    const inactiveSubscriptions = totalCustomers - activeSubscriptions;

    return (
        <Box sx={{ p: 3 }}>
            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Total Customers</Typography>
                            <Typography variant="h4">{totalCustomers}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Active Subscriptions</Typography>
                            <Typography variant="h4" color="success.main">{activeSubscriptions}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>Inactive Subscriptions</Typography>
                            <Typography variant="h4" color="error.main">{inactiveSubscriptions}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Search and Filter Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                    placeholder="Search customers..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 300 }}
                />
                <Box>
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                    <IconButton>
                        <DownloadIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Customer Table */}
            {loading ? (
                <Box sx={{ width: '100%' }}>
                    {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} height={53} />
                    ))}
                </Box>
            ) : customers.length > 0 ? (
                <TableContainer component={Paper} elevation={1}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Mobile</TableCell>
                                <TableCell>Customer ID</TableCell>
                                <TableCell>Logged Date</TableCell>
                                <TableCell>Subscription</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCustomers.map((customer, index) => (
                                <TableRow key={index} hover>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.mobile_number}</TableCell>
                                    <TableCell>{customer.customer_id}</TableCell>
                                    <TableCell>{formatDate(customer.logged_date_time)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={customer.subscription ? "Active" : "Inactive"}
                                            color={customer.subscription ? "success" : "error"}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Card sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color="textSecondary">No customers found.</Typography>
                </Card>
            )}
        </Box>
    );
};

export default CustomerList;
