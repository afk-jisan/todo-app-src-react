import { useState, useEffect } from "react";
import toast from 'react-hot-toast';

export function Todo({ title, is_completed, priority, id, updateTodos, deadline, desc, createdAt}) {
    const [timeLeft, setTimeLeft] = useState("");

    function calcCountDown() {
        const deadLine = new Date(deadline).getTime();
        const now = new Date().getTime();
        const diff = deadLine - now;

        if (diff <= 0) {
            return "Time ran out";
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calcCountDown());
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline]);

    async function deleteClick() {
        const r = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo/" + id, {
            method: "DELETE"
        });
        const j = await r.json();
        toast.success(j.message);
        updateTodos();
    }

    const [completed, setCompleted] = useState(is_completed);

    async function completedClick() {
        const newCompletedState = !completed;
        setCompleted(newCompletedState);

        const body = {
            "title": title,
            "description": desc,
            "deadline": deadline,
            "priority": parseInt(priority),
            "is_completed": newCompletedState,
        };

        try {
            const res = await fetch(`https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todo/${id}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                throw new Error('Failed to update todo');
            }

            const updateTodo = await res.json();
            console.log('Updated todo:', updateTodo);
        } catch (error) {
            console.error('Error updating todo:', error);
            toast.error(error.message);
        }

        updateTodos();
    }

    return (
        <div
            style={{
                padding: "20px 0px 10px 20px ",
                margin: "10px",
                boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                borderRadius: '10px',
                backgroundColor: priority > 8 ? "hsl(0, 55%, 90%)" : "hsl(120, 80%, 90%)",
            }}
        >
            <div style={{
                    position: "relative",
                    textDecoration: completed ? "line-through" : "",
                    width: "100%",
                    borderRadius: "5px"}}>
                
                
                <div className="checkbox-container" onClick={completedClick}>
                    <input type="checkbox" checked={completed} onChange={() => setCompleted(!completed)}/>
                    <label></label> <p style={{fontSize: "1.2rem", width: "75%", fontWeight: "800",}}>{title}</p>
                </div>
                <div style={{fontWeight: "600", marginBottom: "20px", width: "80%", textAlign: "justify", paddingTop: "10px"}}> Description: <span style={{fontWeight: "400"}}> {desc} </span>  </div>
                <div onClick={deleteClick} style={{position: "absolute", right: "0", top: "0", fontSize: "30px", cursor: "pointer", marginLeft: "10px" , color: 'red', paddingRight:"10px"}}> ✘ </div>
            </div>

            <div style={{position: "relative"}}>
                <div style={{ fontSize: "13px", color: "red", fontWeight: "600" }}>
                🕒 Remaining Time: <span style={{fontWeight: "400"}}>{timeLeft}</span> {/* Countdown Timer */}
                </div>
                <div style={{ fontSize: "12px", color: "red", fontWeight: "600" }}>
                📅 Created Time: <span style={{fontWeight: "400"}}>{createdAt}</span> {/* Countdown Timer */}
                </div>
                <div style={{ display: 'flex', width: '100%', justifyContent: "end" }}></div>
                
             
            </div>
        </div>
    );
}
