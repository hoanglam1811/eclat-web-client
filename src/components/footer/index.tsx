import React from "react";
import LogoImage from "@/assets/Éclat.png";

const Footer = () => {
  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#333",
    transition: "color 0.3s",
  };

  return (
    <footer
      style={{
        padding: "40px 20px",
        backgroundColor: "#f8f7da",
        fontFamily: "'Arial', sans-serif",
        fontSize: "14px",
        color: "#333",
      }}
    >
      {/* Main Container */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "30px"
        }}
      >
        {/* Logo Section */}
        <div>
          <img
            src={LogoImage}
            alt="Éclat Skincare Logo"
            style={{ height: "80px" }}
          />
        </div>

        {/* Support Section */}
        <div style={{ flex: "1 1 250px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
            }}
          >
            Hỗ trợ
          </h3>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li>
              <a href="/" style={linkStyle}>
                Điều khoản dịch vụ
              </a>
            </li>
            <li>
              <a href="/" style={linkStyle}>
                Hướng dẫn mua hàng
              </a>
            </li>
            <li>
              <a href="/" style={linkStyle}>
                Hướng dẫn thanh toán
              </a>
            </li>
          </ul>
        </div>

        {/* Policy Section */}
        <div style={{ flex: "1 1 250px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
            }}
          >
            Chính sách
          </h3>
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
            <li>
              <a href="/" style={linkStyle}>
                Chính sách bảo mật
              </a>
            </li>
            <li>
              <a href="/" style={linkStyle}>
                Chính sách bảo hành
              </a>
            </li>
            <li>
              <a href="/" style={linkStyle}>
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="/" style={linkStyle}>
                Chính sách vận chuyển
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div style={{ flex: "1 1 250px" }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#333",
            }}
          >
            Liên hệ
          </h3>
          <p style={{ margin: "5px 0" }}>Email: support@eclatskincare.com</p>
          <p style={{ margin: "5px 0" }}>Hotline: 1900 123 456</p>
          <p style={{ margin: "5px 0" }}>Địa chỉ: 151B Trần Quang Khải p.Tân Định Q1</p>
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        style={{
          marginTop: "30px",
          textAlign: "center",
          borderTop: "1px solid #ddd",
          paddingTop: "10px",
          color: "#777",
        }}
      >
        © 2025 Éclat Skincare. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
