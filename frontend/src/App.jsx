import { useEffect, useState } from "react";
import { GraduationCap, Plus, Pencil, Trash2, Users } from "lucide-react";
import "./index.css";

const API = "http://localhost:5000/api/students";

const emptyForm = {
  studentName: "",
  email: "",
  fatherName: "",
  courseName: "",
  feeStructure: "",
  subjects: "",
  classTiming: ""
};

const fields = [
  ["studentName", "Student Name"],
  ["email", "Email Address"],
  ["fatherName", "Father's Name"],
  ["courseName", "Course Name"],
  ["feeStructure", "Fee Structure"],
  ["subjects", "Subjects"],
  ["classTiming", "Class Timing"]
];

export default function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadStudents() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("Could not load students");
      setStudents(await res.json());
      setError("");
    } catch {
      setError("Backend connect nahi ho raha. Check karo ke server chal raha hai.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  function changeField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function saveStudent(e) {
    e.preventDefault();
    setError("");

    try {
      const url = editing ? `${API}/${editing}` : API;
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          feeStructure: Number(form.feeStructure)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");

      setForm(emptyForm);
      setEditing(null);
      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  function editStudent(student) {
    setEditing(student._id);
    setForm({
      studentName: student.studentName,
      email: student.email,
      fatherName: student.fatherName,
      courseName: student.courseName,
      feeStructure: String(student.feeStructure),
      subjects: student.subjects,
      classTiming: student.classTiming
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteStudent(id) {
    if (!window.confirm("Kya tum is student ko delete karna chahte ho?")) return;

    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Delete failed");
      await loadStudents();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="app">
      <header className="topbar">
        <div className="brand">
          <GraduationCap size={30} />
          <div>
            <h1>EduManage</h1>
            <p>Student Management System</p>
          </div>
        </div>
        <span className="status">● Local system</span>
      </header>

      <section className="hero">
        <div>
          <p className="eyebrow">ADMINISTRATION DASHBOARD</p>
          <h2>Manage your students.</h2>
          <p>Student records ko ek jagah add, update aur manage karo.</p>
        </div>
        <div className="stat">
          <Users size={26} />
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </div>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="panel">
        <h3>{editing ? "Edit Student" : "Add New Student"}</h3>
        <p className="muted">Neeche tamam student details enter karo.</p>

        <form className="student-form" onSubmit={saveStudent}>
          {fields.map(([name, label]) => (
            <label key={name}>
              {label}
              <input
                name={name}
                type={name === "email" ? "email" : name === "feeStructure" ? "number" : "text"}
                min={name === "feeStructure" ? "0" : undefined}
                step={name === "feeStructure" ? "any" : undefined}
                placeholder={`Enter ${label.toLowerCase()}`}
                value={form[name]}
                onChange={changeField}
                required
              />
            </label>
          ))}

          <div className="form-actions">
            <button className="primary" type="submit">
              <Plus size={18} /> {editing ? "Update Student" : "Add Student"}
            </button>
            {editing && (
              <button
                className="secondary"
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="panel">
        <div className="table-heading">
          <div>
            <h3>Student Records</h3>
            <p className="muted">Database se hasil kiye gaye tamam records.</p>
          </div>
          <button className="secondary" onClick={loadStudents}>Refresh</button>
        </div>

        {loading ? <p>Loading students...</p> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Father's Name</th>
                  <th>Course</th>
                  <th>Fee</th>
                  <th>Subjects</th>
                  <th>Timing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <strong>{s.studentName}</strong>
                      <small>{s.email}</small>
                    </td>
                    <td>{s.fatherName}</td>
                    <td>{s.courseName}</td>
                    <td>{Number(s.feeStructure).toLocaleString()}</td>
                    <td>{s.subjects}</td>
                    <td>{s.classTiming}</td>
                    <td>
                      <div className="actions">
                        <button className="icon-btn edit" aria-label="Edit student" onClick={() => editStudent(s)}>
                          <Pencil size={17} />
                        </button>
                        <button className="icon-btn delete" aria-label="Delete student" onClick={() => deleteStudent(s._id)}>
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!students.length && (
                  <tr><td colSpan="7" className="empty">Abhi koi student record nahi hai.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <footer>EduManage · Student Management System</footer>
    </main>
  );
}