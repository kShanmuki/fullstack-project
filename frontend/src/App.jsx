import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";
import InstructorDashboard from "./InstructorDashboard";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <h1>Assignment Feedback System</h1>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/student">Student Dashboard</Link> |{" "}
          <Link to="/instructor">Instructor Dashboard</Link>
        </nav>

        <Routes>
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/instructor" element={<InstructorDashboard />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

