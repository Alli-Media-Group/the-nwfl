import "./Footer.scss";
import React from "react";
import logo from "/logo.svg";

const Footer = () => {
  return (
    <div className="footer">
      {/* footer nav */}
      <div className="footer__nav">
        {/* logo */}
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        {/* links */}
        <a href="#" target="_blank" rel="noopener noreferrer">
          About
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Help
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          FAQs
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Feedback
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Terms of Use
        </a>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Privacy Policy
        </a>
      </div>
      <div className="footer__links"></div>
      <p className="footer__text">© 2023 All Rights Reserved.</p>
    </div>
  );
};

export default Footer;
