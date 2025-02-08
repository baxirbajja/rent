import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    pendingApprovals: 0,
    recentReports: 0
  });
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
      const storedListings = JSON.parse(localStorage.getItem('ads')) || [];
      
      setUsers(storedUsers);
      setListings(storedListings);
      setStats({
        totalUsers: storedUsers.length,
        totalListings: storedListings.length,
        pendingApprovals: storedListings.filter(ad => !ad.approved).length,
        recentReports: 0 // This would come from a reports system
      });
      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setLoading(false);
    }
  }, []);

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleUserAction = (userId, action) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case 'block':
            return { ...user, status: 'blocked' };
          case 'unblock':
            return { ...user, status: 'active' };
          case 'delete':
            return null;
          default:
            return user;
        }
      }
      return user;
    }).filter(Boolean);

    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleListingAction = (listingId, action) => {
    const updatedListings = listings.map(listing => {
      if (listing.id === listingId) {
        switch (action) {
          case 'approve':
            return { ...listing, approved: true };
          case 'reject':
          case 'delete':
            return null;
          case 'feature':
            return { ...listing, featured: true };
          case 'unfeature':
            return { ...listing, featured: false };
          default:
            return listing;
        }
      }
      return listing;
    }).filter(Boolean);

    setListings(updatedListings);
    localStorage.setItem('ads', JSON.stringify(updatedListings));
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
        
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={activeTab === 'listings' ? 'active' : ''}
            onClick={() => setActiveTab('listings')}
          >
            Listings
          </button>
        
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <h3>Platform Overview</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Users</h4>
                <p>{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h4>Total Listings</h4>
                <p>{stats.totalListings}</p>
              </div>
              <div className="stat-card">
                <h4>Pending Approvals</h4>
                <p>{stats.pendingApprovals}</p>
              </div>
              <div className="stat-card">
                <h4>Recent Reports</h4>
                <p>{stats.recentReports}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="dashboard-users">
            <h3>User Management</h3>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.status}</td>
                      <td>
                        {user.status === 'blocked' ? (
                          <button
                            onClick={() => handleUserAction(user.id, 'unblock')}
                            className="action-btn unblock"
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, 'block')}
                            className="action-btn block"
                          >
                            Block
                          </button>
                        )}
                        <button
                          onClick={() => handleUserAction(user.id, 'delete')}
                          className="action-btn delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'listings' && (
          <div className="dashboard-listings">
            <h3>Listing Management</h3>
            <div className="listings-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.id}>
                      <td>{listing.id}</td>
                      <td>{listing.title}</td>
                      <td>€{listing.price}/month</td>
                      <td>{new Date(listing.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this listing?')) {
                              handleListingAction(listing.id, 'delete');
                            }
                          }}
                          className="action-btn delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="dashboard-reports">
            <h3>Reports & Issues</h3>
            <p>No reports found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
