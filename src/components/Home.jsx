import React from "react";
import { useNavigate } from "react-router-dom"; 



function Home() {
  const navigate = useNavigate();
  const onClickHandler = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Stay Organized with TodoApp</h1>
      <p className="home-description">
        A simple and intuitive way to manage your daily tasks efficiently.
      </p>
      <button className="home-button" onClick={onClickHandler}>
        Go to login page
      </button>
      <div className="home-message">Welcome to our Todo App! 🚀</div>
    </div>
  );
}

export { Home };
