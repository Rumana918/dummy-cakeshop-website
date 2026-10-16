import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start local server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🍰 Sweet Whisk Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[Database Startup Error]:', err.message);
  });
