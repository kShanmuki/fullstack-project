import { useState, useEffect } from "react";

export default function InstructorDashboard() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchAssignments();
    fetchSubmissions();
  }, []);

  const fetchAssignments = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/assignments/");
    const data = await res.json();
    setAssignments(data);
  };

  const fetchSubmissions = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/submissions/");
    const data = await res.json();
    setSubmissions(data);
  };

  const createAssignment = async () => {
    if (!title || !desc) {
      alert("Enter title and description");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000/api/create-assignment/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: desc,
      }),
    });

    const data = await res.json();

    if (data.message) {
      alert("Assignment Created!");
      setTitle("");
      setDesc("");
      fetchAssignments();
    } else {
      alert("Error: " + JSON.stringify(data));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Instructor Dashboard</h1>

      <h2>Create Assignment</h2>

      <input
        type="text"
        placeholder="Assignment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />
      <br />

      <textarea
        rows="5"
        cols="60"
        placeholder="Assignment Description"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      ></textarea>

      <br />
      <br />

      <button onClick={createAssignment}>Create Assignment</button>

      <hr />

      <h2>Assignments List</h2>
      {assignments.length === 0 ? (
        <p>No assignments created yet.</p>
      ) : (
        <ul>
          {assignments.map((a) => (
            <li key={a.id}>
              <b>ID:</b> {a.id} | <b>{a.title}</b> - {a.description}
            </li>
          ))}
        </ul>
      )}

      <hr />

      <h2>Student Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <ul>
          {submissions.map((s) => (
            <li key={s.id}>
              <b>Student:</b>{" "}
              {s.student_name || (s.student && s.student.name) || "Unknown"} |{" "}
              <b>Assignment ID:</b> {s.assignment_id} | <b>Status:</b> {s.status}
              <br />

              <b>Text:</b> {s.submission_text}
              <br />

              <b>Feedback:</b> {s.feedback}
              <br />

              <p>
                <b>Plagiarism Score:</b> {s.plagiarism_score}%
              </p>
              <p>
                <b>Marks:</b> {s.marks}
              </p>

              {s.submission_file && (
                <p>
                  <b>File:</b>{" "}
                  <a
                    href={`http://127.0.0.1:8000${s.submission_file}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View PDF
                  </a>
                </p>
              )}

              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
