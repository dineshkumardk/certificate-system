import { useState } from "react";
import "./App.css"; // make sure this is imported

// const API_URL = "http://localhost:5000/generate-certificate";
const API_URL =
  "https://certificate-system-production-6df7.up.railway.app/generate-certificate";

export default function CertificateForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gst: "",
    businessName: "",
    businessAddress: ""
  });

  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.gst) {
      setStatus("error");
      setMessage("Name, Email and GST are required");
      return;
    }

    setLoading(true);
    setStatus("");
    setMessage("Generating certificate...");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed");
      }

      setStatus("success");
      setMessage(data.message);
    } catch {
      setStatus("error");
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2>
        <span>📄</span> Certificate Details
      </h2>
      <p className="form-subtitle">
        Enter the recipient and business information below
      </p>

      <div className="form-group">
        <label>
          <i className="fa-solid fa-user"></i> Recipient Name
        </label>
        <div className="input-wrapper">
          <input
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <i className="fa-solid fa-envelope"></i> Email Address
        </label>
        <div className="input-wrapper">
          <input
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <i className="fa-solid fa-file-invoice"></i> GST Number
        </label>
        <div className="input-wrapper">
          <input
            name="gst"
            placeholder="XX-XXXXXXXXX-X"
            value={formData.gst}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <i className="fa-solid fa-building"></i> Business Name
        </label>
        <div className="input-wrapper">
          <input
            name="businessName"
            placeholder="Acme Corporation"
            value={formData.businessName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <i className="fa-solid fa-location-dot"></i> Business Address
        </label>
        <div className="input-wrapper">
          <textarea
            name="businessAddress"
            placeholder="123 Business Street, City, State, ZIP"
            value={formData.businessAddress}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Generate & Send Certificate"}
      </button>

      {message && (
        <p className={`message ${status}`}>
          {message}
        </p>
      )}
    </div>
  );
}