import { useState } from "react";

export default function InstructorDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const createAssignment = async () => {
    if (!title || !description) {
      alert("Enter title and description");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/create-assignment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Backend Error:", errorText);
        alert("Backend Error! Check Django terminal.");
        return;
      }

      const data = await res.json();

      setMessage("Assignment Created Successfully!");
      alert("Assignment Created!");

      setTitle("");
      setDescription("");

    } catch (error) {
      alert("Backend not running or CORS issue");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Instructor Dashboard</h1>

      <label>Assignment Title:</label>
      <br />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <label>Description:</label>
      <br />
      <textarea
        rows="5"
        cols="60"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={createAssignment}>Create Assignment</button>

      <hr />

      <h2>{message}</h2>
    </div>
  );
}