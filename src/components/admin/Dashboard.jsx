import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    pendingApprovals: 0,
    recentReports: 0,
  });
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const storedListings = JSON.parse(localStorage.getItem("ads")) || [];

      setUsers(storedUsers);
      setListings(storedListings);
      setStats({
        totalUsers: storedUsers.length,
        totalListings: storedListings.length,
        pendingApprovals: storedListings.filter((ad) => !ad.approved).length,
        recentReports: 0,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setLoading(false);
    }
  }, []);

  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const handleUserAction = (userId, action) => {
    const updatedUsers = users
      .map((user) => {
        if (user.id === userId) {
          switch (action) {
            case "block":
              return { ...user, status: "blocked" };
            case "unblock":
              return { ...user, status: "active" };
            case "delete":
              return null;
            default:
              return user;
          }
        }
        return user;
      })
      .filter(Boolean);

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const handleListingAction = (listingId, action) => {
    const updatedListings = listings
      .map((listing) => {
        if (listing.id === listingId) {
          switch (action) {
            case "approve":
              return { ...listing, approved: true };
            case "reject":
            case "delete":
              return null;
            case "feature":
              return { ...listing, featured: true };
            case "unfeature":
              return { ...listing, featured: false };
            default:
              return listing;
          }
        }
        return listing;
      })
      .filter(Boolean);

    setListings(updatedListings);
    localStorage.setItem("ads", JSON.stringify(updatedListings));
  };

  if (loading) {
    return (
      <div className="dashboard-loading">Chargement du tableau de bord...</div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <h2>Tableau de Bord Administrateur</h2>
        <nav>
          <button
            className={activeTab === "users" ? "active" : ""}
            onClick={() => setActiveTab("users")}
          >
            Utilisateurs
          </button>
          <button
            className={activeTab === "listings" ? "active" : ""}
            onClick={() => setActiveTab("listings")}
          >
            Annonces
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {activeTab === "overview" && (
          <div className="dashboard-overview">
            <h3>Aperçu de la Plateforme</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total des Utilisateurs</h4>
                <p>{stats.totalUsers}</p>
              </div>
              <div className="stat-card">
                <h4>Total des Annonces</h4>
                <p>{stats.totalListings}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="dashboard-users">
            <h3>Gestion des Utilisateurs</h3>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.status}</td>
                      <td>
                        {user.status === "blocked" ? (
                          <button
                            onClick={() => handleUserAction(user.id, "unblock")}
                            className="action-btn unblock"
                          >
                            Débloquer
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction(user.id, "block")}
                            className="action-btn block"
                          >
                            Bloquer
                          </button>
                        )}
                        <button
                          onClick={() => handleUserAction(user.id, "delete")}
                          className="action-btn delete"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "listings" && (
          <div className="dashboard-listings">
            <h3>Gestion des Annonces</h3>
            <div className="listings-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Titre</th>
                    <th>Prix</th>
                    <th>Créé le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td>{listing.id}</td>
                      <td>{listing.title}</td>
                      <td>€{listing.price}/mois</td>
                      <td>
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Êtes-vous sûr de vouloir supprimer cette annonce ?"
                              )
                            ) {
                              handleListingAction(listing.id, "delete");
                            }
                          }}
                          className="action-btn delete"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="dashboard-reports">
            <h3>Signalements & Problèmes</h3>
            <p>Aucun signalement trouvé.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
