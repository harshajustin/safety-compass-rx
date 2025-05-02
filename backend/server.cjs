require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session'); // Import session
const passport = require('passport'); // Import passport
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Import Google strategy
const PgSession = require('connect-pg-simple')(session); // Import session store
const nodemailer = require('nodemailer'); // Import nodemailer for email sending

const app = express();
const port = process.env.PORT || 3001; // Use port from .env or default to 3001

// --- Database Configuration ---
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Optional: Add SSL configuration if needed for your database connection
  // ssl: {
  //   rejectUnauthorized: false // Example, adjust as needed
  // }
});

pool.connect((err) => {
  if (err) {
    console.error('Database connection error', err.stack);
  } else {
    console.log('Connected to database');
  }
});

// --- Log the Callback URL being used (Only once at startup is fine) ---
const CALLBACK_URL = `${process.env.BACKEND_URL}/auth/google/callback`;
// console.log("--- PASSPORT CONFIG ---");
// console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID ? 'Set' : 'NOT SET!');
// console.log("CLIENT SECRET:", process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'NOT SET!');
// console.log("EXPECTED CALLBACK URL:", CALLBACK_URL);
// console.log("-----------------------");

// --- Middleware ---

// Configure CORS - Crucial for frontend/backend communication on different ports
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow requests from your frontend URL
  credentials: true // Allow cookies/session info to be sent
}));

app.use(express.json()); // Middleware to parse JSON bodies

// Configure Sessions
app.use(session({
  store: new PgSession({
    pool : pool,                // Connection pool
    tableName : 'session'       // Use specified table name
  }),
  secret: process.env.SESSION_SECRET || 'fallback_secret', // Use secret from .env
  resave: false,
  saveUninitialized: false, // Don't save sessions until something is stored
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    maxAge: 1000 * 60 * 60 * 24 * 7 // Cookie expires in 7 days
  }
}));

// Configure Passport
app.use(passport.initialize());
app.use(passport.session()); // Allow passport to use express-session

// Passport Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL, // Use the constant
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    // console.log("--- PASSPORT VERIFY FUNCTION START ---"); // Removed Debug Log
    // console.log("Google Profile ID:", profile.id); // Removed Debug Log
    try {
      // console.log("Searching for user with google_id:", profile.id); // Removed Debug Log
      let userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
      let user = userResult.rows[0];

      if (user) {
        // console.log("User found in DB:", user.id); // Removed Debug Log
        return done(null, user);
      } else {
        // console.log("User not found, creating new user..."); // Removed Debug Log
        const newUser = {
          google_id: profile.id,
          display_name: profile.displayName,
          email: profile.emails && profile.emails[0].value, 
          profile_picture_url: profile.photos && profile.photos[0].value
        };
        // console.log("New user data:", newUser); // Removed Debug Log
        const insertResult = await pool.query(
          'INSERT INTO users (google_id, display_name, email, profile_picture_url) VALUES ($1, $2, $3, $4) RETURNING *',
          [newUser.google_id, newUser.display_name, newUser.email, newUser.profile_picture_url]
        );
        user = insertResult.rows[0];
        // console.log("New user created with ID:", user.id); // Removed Debug Log
        return done(null, user);
      }
    } catch (err) {
      console.error("Error in Passport Verify Function:", err); // Keep Error Log
      return done(err, null);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  // console.log("--- SERIALIZE USER --- User ID:", user.id); // Removed Debug Log
  done(null, user.id); 
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  // console.log("--- DESERIALIZE USER --- ID:", id); // Removed Debug Log
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    if (!user) {
        console.error("Deserialize Error: No user found for ID:", id); // Keep Error Log
        return done(new Error('User not found during deserialization.'), null);
    }
    // console.log("User deserialized successfully:", user.id); // Removed Debug Log
    done(null, user); 
  } catch (err) {
    console.error("Error in Deserialize User:", err); // Keep Error Log
    done(err, null);
  }
});

// --- Email Configuration ---
// Setup nodemailer transporter with SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587', 10),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-email-password',
  },
});

// Verify transporter connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to take messages');
  }
});

// --- Predefined Image URLs ---
const predefinedImageUrls = [
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
  "https://images.unsplash.com/photo-1590080876063-d7b9c6e5a0a1",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  "https://images.unsplash.com/photo-1590080875846-48bd23c53aa6",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce", // Duplicate detected, keeping both for now
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce", // Duplicate
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" 
];

// --- Authentication Routes ---

// GET /auth/google - Initiates Google OAuth flow
app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] }) // Request profile and email info
);

// console.log("Attempting to set up GET /auth/google/callback route..."); // Removed Debug Log

// GET /auth/google/callback - Handles redirect from Google
// Using custom callback for better error handling/logging
app.get('/auth/google/callback', (req, res, next) => {
  // console.log("--- AUTH CALLBACK ROUTE HIT ---"); // Removed Debug Log
  passport.authenticate('google', (err, user, info) => {
    // console.log("--- PASSPORT AUTHENTICATE CALLBACK --- Err:", err); // Removed Debug Log
    // console.log("--- PASSPORT AUTHENTICATE CALLBACK --- User:", user ? `User ID: ${user.id}`: 'No User'); // Removed Debug Log
    // console.log("--- PASSPORT AUTHENTICATE CALLBACK --- Info:", info); // Removed Debug Log
    
    if (err) { 
      console.error("Authentication Error:", err); // Keep Error Log
      // Redirect to a generic frontend error page or login failed page
      return res.redirect(`${process.env.FRONTEND_URL}/login-error?message=Authentication failed`);
    }
    if (!user) { 
      console.log("Authentication Failed (No User):", info?.message); // Keep Log
      // Redirect to login failed page, maybe with message
      const message = info?.message || 'Authentication failed';
      return res.redirect(`${process.env.FRONTEND_URL}/login-failed?message=${encodeURIComponent(message)}`);
    }

    // Manually establish the session using req.login
    req.logIn(user, function(loginErr) {
      // console.log("--- REQ.LOGIN CALLBACK --- Err:", loginErr); // Removed Debug Log
      if (loginErr) { 
        console.error("Session Login Error:", loginErr); // Keep Error Log
        return res.redirect(`${process.env.FRONTEND_URL}/login-error?message=Session login failed`);
      }
      // Session established, redirect to frontend
      // console.log("Login successful, redirecting to frontend..."); // Removed Debug Log
      return res.redirect(process.env.FRONTEND_URL);
    });
  })(req, res, next); // Pass req, res, next to the middleware
});

// GET /api/current-user - Check login status and get user data
app.get('/api/current-user', (req, res) => {
  if (req.isAuthenticated()) { // passport adds isAuthenticated()
    // Send back relevant user info (DO NOT send password hashes or sensitive data)
    res.json({ 
      id: req.user.id,
      displayName: req.user.display_name,
      email: req.user.email,
      avatar: req.user.profile_picture_url
    });
  } else {
    res.status(401).json(null); // Not authenticated
  }
});

// POST /auth/logout - Log user out
app.post('/auth/logout', (req, res, next) => {
  req.logout(function(err) { // passport adds logout()
    if (err) { return next(err); }
    req.session.destroy((err) => { // Destroy the session
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.status(200).json({ message: 'Logged out successfully' });
    });
  });
});

// --- API Routes ---

// Consider adding authentication middleware to testimonial routes if needed
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// GET /api/testimonials - Fetch all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, quote, author, title, organization, image_url, is_featured FROM testimonials ORDER BY is_featured DESC, id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching testimonials:', err.message); // Keep Error Log
    res.status(500).json({ error: 'Failed to retrieve testimonials' });
  }
});

// POST /api/testimonials - Add a new testimonial
app.post('/api/testimonials', ensureAuthenticated, async (req, res) => {
  const { quote, author, title, organization, is_featured = false } = req.body;
  
  // Select a random image URL from the predefined list
  const randomIndex = Math.floor(Math.random() * predefinedImageUrls.length);
  const selectedImageUrl = predefinedImageUrls[randomIndex];

  // Basic validation
  if (!quote || !author) {
    return res.status(400).json({ error: 'Quote and Author are required fields.' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO testimonials (quote, author, title, organization, image_url, is_featured) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [quote, author, title, organization, selectedImageUrl, is_featured]
    );
    res.status(201).json(result.rows[0]); // Return the newly created testimonial
  } catch (err) {
    console.error('Error adding testimonial:', err.message); // Keep Error Log
    res.status(500).json({ error: 'Failed to add testimonial' });
  }
});

// PUT /api/testimonials/:id/toggle-feature - Toggle the featured status
app.put('/api/testimonials/:id/toggle-feature', ensureAuthenticated, async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current status first (optional, but good practice)
    const current = await pool.query('SELECT is_featured FROM testimonials WHERE id = $1', [id]);
    if (current.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    const newStatus = !current.rows[0].is_featured;
    
    const result = await pool.query(
      'UPDATE testimonials SET is_featured = $1 WHERE id = $2 RETURNING id, is_featured',
      [newStatus, id]
    );
    
    if (result.rows.length === 0) {
      // Should not happen if the first query succeeded, but good to check
      return res.status(404).json({ error: 'Testimonial not found after update attempt' });
    }
    
    res.json(result.rows[0]); // Return the updated id and status
  } catch (err) {
    console.error(`Error toggling feature status for testimonial ${id}:`, err.message); // Keep Error Log
    res.status(500).json({ error: 'Failed to update testimonial feature status' });
  }
});

// --- Contact Form Route ---
// POST /api/contact - Send contact form emails
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required: name, email, and message' });
  }

  // Email configuration
  const mailOptions = {
    from: process.env.EMAIL_USER || 'noreply@yourdomain.com',
    to: 'harshajustin2@gmail.com', // Fixed destination email
    replyTo: email, // Allow for direct replies to the sender
    subject: `New Contact Form Submission from ${name}`,
    text: `
Name: ${name}
Email: ${email}

Message:
${message}
    `,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #4F46E5;">New Contact Form Submission</h2>
  <div style="border-left: 4px solid #4F46E5; padding-left: 15px; margin: 20px 0;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
  </div>
  <div style="background: #f9fafb; padding: 15px; border-radius: 5px;">
    <h3 style="margin-top: 0;">Message:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
  <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
    This email was sent from your website contact form.
  </p>
</div>
    `
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    
    // Log the submission to the database for record keeping (optional)
    await pool.query(
      'INSERT INTO contact_submissions (name, email, message) VALUES ($1, $2, $3)',
      [name, email, message]
    ).catch(err => {
      // Just log the error, don't fail the request if DB insertion fails
      console.error('Error logging contact submission to database:', err.message);
    });

    // Return success
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error sending email:', err.message);
    
    // For development, include detailed error in response
    const errorDetails = process.env.NODE_ENV === 'production' 
      ? 'Failed to send message. Please try again later.' 
      : err.message;
    
    res.status(500).json({ error: 'Failed to send message', details: errorDetails });
  }
});

// Basic root route (optional)
app.get('/', (req, res) => {
  res.send('Testimonial API Backend Running');
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
