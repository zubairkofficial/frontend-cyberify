import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router for navigation
import Helper from "../Config/Helper";

const ErrorPage = () => {
  return (
    <div className="error-page-container">
      <div className="error-content">
        <a href="/">
          <img alt="Logo" src={Helper.staticImage("assets/logo-dark.png")} className="h-20px theme-light-show" />
        </a>
        <h1 className="error-title">404 - Page Not Found</h1>
        <p className="error-message">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Back Home
        </Link>
      </div>

      <style jsx="true">{`
        .error-page-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f7f8fa;
        }
        .error-content {
          text-align: center;
        }
        .error-title {
          font-size: 48px;
          margin: 20px 0;
          color: #333;
        }
        .error-message {
          font-size: 18px;
          margin-bottom: 30px;
          color: #777;
        }
        .error-home-button {
          background-color: #007bff;
          color: #fff;
          padding: 10px 20px;
          border-radius: 5px;
          text-decoration: none;
          font-size: 16px;
        }
        .error-home-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
};

export default ErrorPage;
