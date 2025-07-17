const express = require('express');
const { auth } = require('express-openid-connect');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Auth0 config
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

app.use(auth(config));

// Database config
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Public route with styled homepage
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Welcome to the Demo App</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
          font-family: 'Segoe UI', Arial, sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: rgba(255,255,255,0.95);
          border-radius: 16px;
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.2);
          padding: 40px 32px;
          text-align: center;
          max-width: 400px;
        }
        h1 {
          color: #2d3a4b;
          margin-bottom: 0.5em;
        }
        .btn {
          display: inline-block;
          margin: 12px 8px;
          padding: 12px 28px;
          font-size: 1.1em;
          border-radius: 8px;
          border: none;
          background: #66a6ff;
          color: #fff;
          text-decoration: none;
          transition: background 0.2s;
          box-shadow: 0 2px 8px rgba(102,166,255,0.15);
        }
        .btn:hover {
          background: #89f7fe;
          color: #2d3a4b;
        }
        .footer {
          margin-top: 2em;
          font-size: 0.95em;
          color: #888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Welcome to the Demo App</h1>
        <p>
          This app demonstrates:<br>
          <strong>Auth0 authentication</strong>,<br>
          <strong>PostgreSQL database access</strong>,<br>
          <strong>and HTTPS with Certbot</strong>.
        </p>
        <div>
          <a class="btn" href="/login">Log In</a>
          <a class="btn" href="/profile">Profile</a>
        </div>
        <div class="footer">
          <span>Need help? <a href="https://auth0.com/docs/" target="_blank">Auth0 Docs</a></span>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Protected route
app.get('/profile', (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send(`<h1>Profile</h1>
    <pre>${JSON.stringify(req.oidc.user, null, 2)}</pre>
    <a href="/db">Show DB Users</a> | <a href="/logout">Logout</a>`);
});

// DB route (protected)
app.get('/db', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.redirect('/login');
  }
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('DB error: ' + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
