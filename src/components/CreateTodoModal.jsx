import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Responsive width for smaller screens
  maxWidth: "400px",
  backgroundColor: "#f9f9f9",
  borderRadius: "15px",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
  display: "flex",
  flexDirection: "column", // Stack content vertically
  alignItems: "center",
  padding: "20px",
};

const contentStyle = {
  width: "100%",
  textAlign: "center",
  padding: "10px",
  color: "#333",
};

const textFieldStyle = {
  width: "100%",
  marginBottom: "15px",
};

const buttonStyle = {
  marginTop: "20px",
  backgroundColor: "#00796b",
  color: "white",
  fontWeight: "bold",
  fontSize: "1rem",
  padding: "10px",
  width: "100%",
  borderRadius: "8px",
  cursor: "pointer",
};

const headingStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#00796b",
  marginBottom: "20px",
};

export function CreateTodoModal({ updateTodos }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState();
  const [deadline, setDeadline] = useState("");
  const [desc, setDescription] = useState("");

  const handleDateBlur = (e) => {
    const inputDate = e.target.value; // YYYY-MM-DDTHH:MM

    // Convert string to Date object and format it to ISO string
    const formattedDate = new Date(inputDate + ":00.000Z");

    // Update state with the new formatted deadline in ISO format
    setDeadline(formattedDate.toISOString());
  };

  // UseEffect to log deadline whenever it updates
  useEffect(() => {
    if (deadline) {
      console.log("Updated deadline:", deadline);
    }
  }, [deadline]);

  async function createTodoClick() {
    const body = {
      title: title.trim() === "" ? "Untitled Task" : title,
      description: desc.trim() === "" ? "No description provided" : desc, // Added description
      deadline: deadline || new Date().toISOString(),
      priority: priority ? parseInt(priority) : 1,
    };

    const r = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const j = await r.json();
    console.log(j);
    toast.success("Todo created");
    setTitle("");
    setPriority();
    setDeadline("");
    setDescription("");
    setIsOpen(false);
    updateTodos();
  }

  return (
    <div>
      <Button onClick={() => setIsOpen(true)} variant="contained" size="large" >
        Create
      </Button>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <div style={style}>
          <div style={contentStyle}>
            <h1 style={headingStyle}>Add a Todo</h1>
            <TextField
              style={textFieldStyle}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              style={textFieldStyle}
              placeholder="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
            <TextField
              style={textFieldStyle}
              placeholder="Description"
              value={desc}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="datetime-local"
              id="updateTaskDueDate"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "15px",
              }}
              onBlur={handleDateBlur}
            />
            <Button
              style={buttonStyle}
              onClick={createTodoClick}
              fullWidth
              variant="contained"
              size="large"
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
