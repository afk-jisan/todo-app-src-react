import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import LoginIcon from '@mui/icons-material/Login';




function Login() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [pass, setPass] = useState("");

    async function loginClick() {
        const body = {
            "username": username, 
            "password": pass
        }  
        const r = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        const j = await r.json();
        if(j["access_token"]) {
            localStorage.setItem("username", username);
            console.log(j["access_token"]);
            toast.success("Logged in");
            navigate("/dashboard");
        }
        else {
            toast.error(j["detail"]);
        }
    }

    return <>
        <div className='login-container'>
            <p style={{fontSize:"2rem", fontWeight:"600", textAlign:"center"}}>Login</p>
            <div>
                <TextField placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                <br/>
                <br/>
                <TextField type="password" placeholder='Password' value={pass} onChange={(e) => setPass(e.target.value)}  />
            </div>
            <center>
                <Button startIcon={<LoginIcon />} onClick={loginClick} variant="outlined" size='large'>Login</Button>
            </center>
            <div>
                Do not have an account? <a href="/signup">Sign Up</a>
            </div>   
        </div>  
    </>
}

export { Login }