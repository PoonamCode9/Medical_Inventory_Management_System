import API_URL from '../config';
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        { name, email, password, role }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", response.data.name);
      setMessage("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage("Registration failed! Email may already exist!");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      fontFamily: "'Segoe UI', sans-serif",
      background: "#ffffff"
    }}>

      {/* Left Side - 35% */}
      <div style={{
        width: "35%",
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 30px",
        color: "white"
      }}>
        <div style={{
          width: "80px",
          height: "80px",
          background: "linear-gradient(135deg, #e94560, #0f3460)",
          borderRadius: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "40px",
          marginBottom: "20px",
          boxShadow: "0 10px 30px rgba(233,69,96,0.4)"
        }}>
          💊
        </div>

        <h1 style={{
          fontSize: "32px",
          fontWeight: "800",
          color: "#e94560",
          margin: "0 0 5px 0"
        }}>
          MediStock
        </h1>

        <p style={{
          fontSize: "13px",
          color: "#a0aec0",
          textAlign: "center",
          marginBottom: "40px"
        }}>
          Medical Inventory Management
        </p>

        <div style={{ width: "100%" }}>
          {[
            { icon: "👑", text: "Admin — Full Access" },
            { icon: "💊", text: "Pharmacist — Medicine Management" },
            { icon: "👤", text: "Staff — View Access" },
          ].map((item, index) => (
            <div key={index} style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "15px",
              marginBottom: "10px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "10px",
              borderLeft: "3px solid #e94560"
            }}>
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <span style={{ fontSize: "13px", color: "#e2e8f0" }}>
                {item.text}
              </span>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: "40px",
          fontSize: "11px",
          color: "#4a5568",
          textAlign: "center"
        }}>
          © 2026 MediStock. All rights reserved.
        </p>
      </div>

      {/* Right Side - 65% */}
      <div style={{
        width: "65%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7fafc",
        padding: "40px"
      }}>
        <div style={{
          width: "420px",
          background: "white",
          padding: "50px",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)"
        }}>
          <div style={{ marginBottom: "35px" }}>
            <h2 style={{
              color: "#1a1a2e",
              fontSize: "30px",
              fontWeight: "700",
              margin: "0 0 8px 0"
            }}>
              Create Account
            </h2>
            <p style={{ color: "#718096", fontSize: "14px", margin: 0 }}>
              Register to access MediStock!
            </p>
          </div>

          {/* Name */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              color: "#2d3748",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "8px"
            }}>
              FULL NAME
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 15px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                boxSizing: "border-box",
                background: "#f8fafc",
                color: "#2d3748"
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              color: "#2d3748",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "8px"
            }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 15px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                boxSizing: "border-box",
                background: "#f8fafc",
                color: "#2d3748"
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{
              display: "block",
              color: "#2d3748",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "8px"
            }}>
              PASSWORD
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 15px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                boxSizing: "border-box",
                background: "#f8fafc",
                color: "#2d3748"
              }}
            />
          </div>

          {/* Role */}
          <div style={{ marginBottom: "25px" }}>
            <label style={{
              display: "block",
              color: "#2d3748",
              fontSize: "13px",
              fontWeight: "600",
              marginBottom: "8px"
            }}>
              SELECT ROLE
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 15px",
                border: "1.5px solid #e2e8f0",
                borderRadius: "10px",
                fontSize: "14px",
                boxSizing: "border-box",
                background: "#f8fafc",
                color: "#2d3748"
              }}
            >
              <option value="ADMIN">👑 Admin</option>
              <option value="PHARMACIST">💊 Pharmacist</option>
              <option value="STAFF">👤 Staff</option>
            </select>
          </div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading
                ? "#a0aec0"
                : "linear-gradient(135deg, #1a1a2e 0%, #e94560 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(233,69,96,0.3)"
            }}
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>

          <p style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#718096",
            fontSize: "14px"
          }}>
            Already have an account?{" "}
            <a href="/login" style={{
              color: "#e94560",
              fontWeight: "600",
              textDecoration: "none"
            }}>
              Sign in here
            </a>
          </p>

          {message && (
            <div style={{
              marginTop: "15px",
              padding: "12px",
              borderRadius: "8px",
              background: message.includes("successful") ? "#f0fff4" : "#fff5f5",
              border: message.includes("successful") ? "1px solid #9ae6b4" : "1px solid #fed7d7",
              color: message.includes("successful") ? "#276749" : "#c53030",
              fontSize: "13px",
              textAlign: "center"
            }}>
              {message.includes("successful") ? "✅" : "⚠️"} {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;