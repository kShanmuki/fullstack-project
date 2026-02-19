import { useState } from "react";

export default function StudentDashboard() {
  const [studentName, setStudentName] = useState("");
  const [assignmentId, setAssignmentId] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const [status, setStatus] = useState("No submission yet.");
  const [feedback, setFeedback] = useState("No feedback yet.");

  const submitAssignment = async () => {
    if (!studentName || !assignmentId) {
      alert("Enter Student Name and Assignment ID");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("assignment_id", assignmentId);
      formData.append("student_name", studentName);
      formData.append("submission_text", text);

      if (file) {
        formData.append("submission_file", file);
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/submit-assignment/",
        {
          method: "POST",
          body: formData,
        }
      );

      // If backend error like 500
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Backend Error:", errorText);
        alert("Backend Error! Check Django terminal.");
        return;
      }

      const data = await response.json();

      if (data.message) {
        setStatus("Submitted Successfully!");
        setFeedback(data.feedback || "Waiting for Instructor review...");
        alert("Assignment Submitted!");

        // Reset fields after submission
        setStudentName("");
        setAssignmentId("");
        setText("");
        setFile(null);
      } else {
        alert("Error: " + JSON.stringify(data));
      }
    } catch (error) {
      alert("Backend not running or CORS issue");
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Student Dashboard</h1>

      <label>Student Name:</label>
      <br />
      <input
        type="text"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        placeholder="Enter your name"
      />

      <br />
      <br />

      <label>Assignment ID:</label>
      <br />
      <input
        type="number"
        value={assignmentId}
        onChange={(e) => setAssignmentId(e.target.value)}
        placeholder="Enter assignment ID"
      />

      <br />
      <br />

      <label>Assignment Text:</label>
      <br />
      <textarea
        rows="6"
        cols="60"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your assignment here..."
      ></textarea>

      <br />
      <br />

      <label>Upload PDF:</label>
      <br />
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={submitAssignment}>Submit Assignment</button>

      <hr />

      <h2>Submission Status</h2>
      <p>{status}</p>

      <h2>Feedback</h2>
      <p>{feedback}</p>
    </div>
  );
}
