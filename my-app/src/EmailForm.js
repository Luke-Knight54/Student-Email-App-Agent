import React, { useState } from "react";

// Category list used for the viewer to visualize the options
const categories = [
  "Class/Assignment",
  "Exam/Quiz/Deadlines",
  "Group Project/Collaboration",
  "Advising/Scheduling/Office Hours",
  "Spam/Low Priority",
  "Other"
];

// WVU theme colors to make the web app pretty
const wvuBlue = "#002855";
const wvuGold = "#FFB81C";

// basically all the variables for user input, response, loading state, and error handling
function EmailForm() {
  const [userName, setUserName] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Handles form submission and communicates with the backend API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/process_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_content: emailContent }),
      });
      // Handles a non-200 response from the server(an error)
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      data.auto_reply = data.auto_reply.replace("[Your Name]", userName || "Student");
      setResponse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Renders the category list with the AI-selected category highlighted
  // Also all the styling is below
  const renderCategoryList = () => (
    <div>
      <ol style={{ paddingLeft: "20px" }}>
        {categories.map((cat, i) => (
          <li key={i}>{cat}</li>
        ))}
      </ol>

      {response && (
        <div style={{ marginTop: "10px" }}>
          <h4 style={{ marginBottom: "5px", color: wvuBlue, fontWeight: "600" }}>
            AI Selected Category:
          </h4>
          <pre
            style={{
              backgroundColor: "#f9f9f9",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "500",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              whiteSpace: "pre-wrap",
              fontFamily: "Arial, sans-serif",
            }}
          >
            {response.category || "N/A"}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", backgroundColor: "#f4f4f4" }}>
      
      {/* Header */}
      <header style={{
        backgroundColor: wvuBlue,
        color: "#fff",
        padding: "20px 0",
        textAlign: "center",
        fontSize: "28px",
        fontWeight: "bold",
        boxShadow: "0 3px 6px rgba(0,0,0,0.2)"
      }}>
        Student Email Agent
      </header>

      <main style={{ maxWidth: "800px", margin: "30px auto", padding: "0 20px" }}>
        
        {/* Email Form */}
        <div style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <input
              type="text"
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "14px",
                borderRadius: "5px",
                border: `1px solid ${wvuBlue}`,
                fontFamily: "Arial, sans-serif",
              }}
            />
            <textarea
              rows="6"
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "14px",
                borderRadius: "5px",
                border: `1px solid ${wvuBlue}`,
                resize: "vertical",
                fontFamily: "Arial, sans-serif",
              }}
              placeholder="Paste email content here"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              required
            />
            <button
              type="submit"
              style={{
                padding: "12px 20px",
                backgroundColor: wvuGold,
                color: wvuBlue,
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px"
              }}
            >
              Process Email
            </button>
          </form>

          {loading && <p style={{ color: wvuBlue, marginTop: "20px" }}>Processing email...</p>}
          {error && <p style={{ color: "red", marginTop: "20px" }}>Error: {error}</p>}
        </div>

        {/* Results */}
        {response && (
          <div style={{ marginTop: "30px" }}>
            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "20px"
            }}>
              <h2 style={{ color: wvuBlue }}>Extracted Content:</h2>
              <pre style={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                whiteSpace: "pre-wrap",
                fontFamily: "Arial, sans-serif",
              }}>
                {response.extracted_content || "N/A"}
              </pre>
            </div>

            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "20px"
            }}>
              <h2 style={{ color: wvuBlue }}>Categories:</h2>
              {renderCategoryList()}
            </div>

            <div style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginBottom: "20px"
            }}>
              <h2 style={{ color: wvuBlue }}>Auto Reply:</h2>
              <pre style={{
                backgroundColor: "#f9f9f9",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                whiteSpace: "pre-wrap",
                fontFamily: "Arial, sans-serif",
              }}>
                {response.auto_reply || "N/A"}
              </pre>
            </div>
          </div>
        )}
      </main>

      <footer style={{
        textAlign: "center",
        padding: "15px 0",
        backgroundColor: wvuBlue,
        color: "#fff",
        marginTop: "40px",
        fontSize: "14px"
      }}>
        Agent Email Processing App: by Luke Knight
      </footer>
    </div>
  );
}

export default EmailForm;