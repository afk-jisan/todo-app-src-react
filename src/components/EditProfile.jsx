import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const username = localStorage.getItem("username");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    profile_picture: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const [imageUploading, setImageUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setImageUploading(true);
    try {
      const response = await fetch("https://api.imgbb.com/1/upload?key=82028346f68342b1beacc9b3cf80aa86", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        setProfile((prev) => ({ ...prev, profile_picture: data.data.url }));
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Try again.");
    } finally {
      setImageUploading(false);
    }
  };




  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        setProfile({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          profile_picture: data.profile_picture || "",
          username: data.username || "",
        });

      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Using cached data.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/profile/${username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          profile_picture: profile.profile_picture || "",
          // username: profile.username,
        }),
      });

      if (!response.ok) throw new Error(`Failed to update profile! Status: ${response.status}`);

      alert("Profile updated successfully!");
      navigate("/profile");

    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  return (
    <div style={{ backgroundColor: "hsl(210, 40%, 90%)", padding: "20px", minHeight: "80vh" }}>
      <h1 style={{ textAlign: "center", fontSize: "1.5em", fontWeight: "bold", paddingTop: "20px" }}>
        Edit Profile
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          margin: "20px auto",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <div style={{ marginBottom: "15px" }}>
          <label><strong>Name:</strong></label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label><strong>Email:</strong></label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label><strong>Contact:</strong></label>
          <input type="tel" name="phone" value={profile.phone} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label><strong>Username:</strong></label>
          <input type="text" disabled name="username" value={profile.username} onChange={handleChange} required style={inputStyle} />
        </div>

        <div style={{ marginBottom: "15px" }}>
  <label><strong>Profile Picture:</strong></label>
  <input type="file" accept="image/*" onChange={handleImageUpload} style={inputStyle} />
  {imageUploading && <p style={{ color: "blue" }}>Uploading...</p>}
  {profile.profile_picture && (
    <img src={profile.profile_picture} alt="Profile" style={{ width: "100px", borderRadius: "50%", marginTop: "10px" }} />
  )}
</div>


        <button type="submit" style={buttonStyle}>Save Changes</button>
        <button type="button" onClick={() => navigate("/profile")} style={{ ...buttonStyle, backgroundColor: "#888" }}>
          Cancel
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "95%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  fontSize: "1rem",
  marginTop: "5px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#00796b",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "bold",
  marginTop: "10px",
};

export default EditProfile;
