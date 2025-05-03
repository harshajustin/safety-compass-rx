
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const PgSession = require('connect-pg-simple')(session);

const app = express();
const port = process.env.PORT || 3001;

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

// --- Middleware ---

// Configure CORS - Crucial for frontend/backend communication on different ports
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

// Configure Sessions
app.use(session({
  store: new PgSession({
    pool : pool,
    tableName : 'session'
  }),
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}));

// Configure Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      let userResult = await pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
      let user = userResult.rows[0];

      if (user) {
        return done(null, user);
      } else {
        const newUser = {
          google_id: profile.id,
          display_name: profile.displayName,
          email: profile.emails && profile.emails[0].value, 
          profile_picture_url: profile.photos && profile.photos[0].value
        };
        const insertResult = await pool.query(
          'INSERT INTO users (google_id, display_name, email, profile_picture_url) VALUES ($1, $2, $3, $4) RETURNING *',
          [newUser.google_id, newUser.display_name, newUser.email, newUser.profile_picture_url]
        );
        user = insertResult.rows[0];
        return done(null, user);
      }
    } catch (err) {
      console.error("Error in Passport Verify Function:", err);
      return done(err, null);
    }
  }
));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id); 
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = result.rows[0];
    if (!user) {
        console.error("Deserialize Error: No user found for ID:", id);
        return done(new Error('User not found during deserialization.'), null);
    }
    done(null, user); 
  } catch (err) {
    console.error("Error in Deserialize User:", err);
    done(err, null);
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
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  "https://images.unsplash.com/photo-1526045612212-70caf35c14df",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
  "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91" 
];

// --- Authentication Routes ---

// GET /auth/google - Initiates Google OAuth flow
app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// GET /auth/google/callback - Handles redirect from Google
app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) { 
      console.error("Authentication Error:", err);
      return res.redirect(`${process.env.FRONTEND_URL}/login-error?message=Authentication failed`);
    }
    if (!user) { 
      console.log("Authentication Failed (No User):", info?.message);
      const message = info?.message || 'Authentication failed';
      return res.redirect(`${process.env.FRONTEND_URL}/login-failed?message=${encodeURIComponent(message)}`);
    }

    // Manually establish the session using req.login
    req.logIn(user, function(loginErr) {
      if (loginErr) { 
        console.error("Session Login Error:", loginErr);
        return res.redirect(`${process.env.FRONTEND_URL}/login-error?message=Session login failed`);
      }
      return res.redirect(process.env.FRONTEND_URL);
    });
  })(req, res, next);
});

// GET /api/current-user - Check login status and get user data
app.get('/api/current-user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      id: req.user.id,
      displayName: req.user.display_name,
      email: req.user.email,
      avatar: req.user.profile_picture_url
    });
  } else {
    res.status(401).json(null);
  }
});

// POST /auth/logout - Log user out
app.post('/auth/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        res.clearCookie('connect.sid');
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
    console.error('Error fetching testimonials:', err.message);
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
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding testimonial:', err.message);
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
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`Error toggling feature status for testimonial ${id}:`, err.message);
    res.status(500).json({ error: 'Failed to update testimonial feature status' });
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
