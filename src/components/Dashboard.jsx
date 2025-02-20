import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Todo } from "./Todo";
//import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import { CreateTodoModal } from "./CreateTodoModal";
import toast from 'react-hot-toast';

import PieChartComponent from "./PieChart";


export function Dashboard() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const [todolist, setTodoList] = useState([]);
    const [search, setSearch] = useState("");

    async function getTodos() {
        const r = await fetch("https://5nvfy5p7we.execute-api.ap-south-1.amazonaws.com/dev/todos");
        const j = await r.json();
        setTodoList(j);
    }

    useEffect(() => {
        if (!username) navigate("/login");
        getTodos();
    }, []);

    function logoutClick() {
        localStorage.removeItem("username");
        toast.success("Logged out successfully");
        navigate("/login");
    }

    const sortTodo = (whichsort) => {
        let sorted = [...todolist];
        if (whichsort === "priority") {
            sorted.sort((a, b) => a.priority - b.priority);
        } else if (whichsort === "deadline") {
            sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else if (whichsort === "creationTime" || "default") {
            sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        setTodoList(sorted);
    };


    function formatTimestamp(isoString) {
        const date = new Date(isoString);
        date.setHours(date.getHours() + 6);

        const options = { 
            year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit', 
            hour12: true
        };
    
        return date.toLocaleString('en-US', options);
    }
    
    


    // Calculate statistics
    const totalTasks = todolist.length;
    const completedTasks = todolist.filter(todo => todo.is_completed).length;
    const efficiency = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
    const unfinishedTasks = totalTasks - completedTasks;

    return (
        <div className="dashboard-container" >
            <div className="todo-container" style={{boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"}}>
                <div style={{ width: "100%" }}>
                    <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center", padding: "10px"}}>
                        <h1 style={{ fontSize: "1.5rem", padding: "10px" }}>Welcome, {username}!</h1>
                        <div className="upperBtns">
                            <button className="btnProfile" onClick={() => navigate("/profile")}>Profile</button>
                            <button className="btnLogout" onClick={logoutClick}>Logout</button>
                        </div>
                    </div>
                    <div className="control" style={{ padding: "10px", display: "flex", justifyContent: "space-between" }}>
                        <TextField style={{ width: "60%" }} value={search} onChange={e => setSearch(e.target.value)} id="outlined-read-only-input" label="Search"/>
                        <select style={{ width: "40%" }} className="custom-select" onChange={(e) => sortTodo(e.target.value)} id="sortTasks">
                            <option value="default">No sorting</option>
                            <option value="priority">Sort by Priority</option>
                            <option value="deadline">Sort by Deadline</option>
                            <option value="creationTime">Sort by Creation Time</option>
                        </select>
                    </div>

                    <div style={{ height: "auto" }}>
                        {todolist.map((value, index) => (
                            value.title.toLowerCase().includes(search.toLowerCase()) && 
                            <Todo key={index} title={value.title} priority={value.priority} is_completed={value.is_completed} id={value.id} updateTodos={getTodos} deadline={value.deadline} desc={value.description} createdAt={formatTimestamp(value.created_at)} />
                        ))}
                    </div>

                    <br /><br />
                    <div style={{display:"flex", justifyContent:'flex-end', padding:"0px 10px 10px 0px"}}>
                        <CreateTodoModal updateTodos={getTodos}/>
                    </div>
                    
                </div>
            </div>

            {/* Statistics Section */}
            <div className="stats-container" style={{boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"}}>
                <div className="stat-box">
                    <p>Total tasks: {totalTasks}</p>
                    <p>Completed tasks: {completedTasks}</p>
                    <p>Efficiency: {efficiency}%</p>
                </div>
                <div className="chart-box">
                    <h1>Task Completion</h1>
                    <PieChartComponent completed={completedTasks} unfinished={unfinishedTasks} />
                </div>
            </div>

            
        </div>
    );
}
