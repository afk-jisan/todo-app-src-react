import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function Create() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");

  async function handleClick() {
    if (pass != cpass) {
      toast.error("Passwords do not match");
      return;
    }
    const body = {
      name: name,
      email: email,
      phone: phone,
      username: username,
      password: pass,
      profile_picture: "",
    };
    const response = await fetch(
      "https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    toast.success(data.message);
    setName("");
    setEmail("");
    setPass("");
    setPhone("");
    setCpass("");
    setUsername("");
    localStorage.setItem("body", JSON.stringify(body)); //added extra because at first get endpoint of API wasn't working
    navigate("/login");
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontWeight: "600",
          width: "96%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "15px",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              color: "#00796b",
              fontWeight: "bold",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Create an Account
          </div>
          <div style={{ width: "100%" }}>
            <TextField
              fullWidth
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              type="password"
              placeholder="Confirm Password"
              value={cpass}
              onChange={(e) => setCpass(e.target.value)}
              margin="normal"
            />
          </div>
          <Button
            variant="contained"
            size="large"
            onClick={handleClick}
            startIcon={<PersonAddIcon />}
            style={{
              backgroundColor: "#00796b",
              color: "#ffffff",
              marginTop: "20px",
              width: "100%",
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 5px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            Create Account
          </Button>
        </div>
      </div>
    </>
  );
}

export { Create };
