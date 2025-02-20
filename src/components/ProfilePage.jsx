import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    async function getProfile() {
      try {
        const response = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev//profile/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data);

      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    getProfile();
  }, []);

  if (!profile) {
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading Profile...</h2>;
  }

  return (
    <div style={{ backgroundColor: "hsl(140, 40%, 80%)", padding: "10px 10px", minHeight: "40vh", minWidth: "30vw", borderRadius: "10px"}}>
      <h1 style={{ fontSize: "1.5em", fontWeight: "bold", textAlign: "center", paddingTop: "15px" }}> Profile Information </h1>
      <div style={{
        display: "flex",
        flexDirection: "column",
        // justifyContent: "center",
        alignItems: "center",
        maxWidth: "400px",
        margin: "20px auto",
        backgroundColor: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
        position: "relative",
      }}>
        
        <div className="profile-pic" style={{ marginBottom: "15px"}}>
          {profile.profile_picture ? <img src={profile.profile_picture} alt="Profile" style={{ width: "100px", height: "100px", borderRadius: "50%" }} /> : <span>No Image</span>}
        </div>
        <div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Name:</strong> <span>{profile.name || "N/A"}</span>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Email:</strong> <span>{profile.email || "N/A"}</span>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Contact:</strong> <span>{profile.phone || "N/A"}</span>
        </div>
        <div style={{ marginBottom: "15px" }}>
          <strong>Username:</strong> <span>{profile.username || "N/A"}</span>
        </div>
        </div>
        
        
        <button style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#00796b",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "bold",
          marginBottom: "5px"
        }}
        onClick={() => navigate("/edit-profile")}>
          Edit Account
        </button>
        <button style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#00796b",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "1rem",
          fontWeight: "bold"
        }}
        onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Profile;
