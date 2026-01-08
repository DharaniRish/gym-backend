import mongoose from 'mongoose';

const connectDB = async () => {
  // Support multiple env var names for flexibility
  const envUri = process.env.MONGO_URI || process.env.MONGODB_URI || '';

  // Local fallback for development when no remote URI is provided
  const localFallback = 'mongodb://127.0.0.1:27017/gym-app';

  const candidates = [];
  if (envUri) candidates.push(envUri);
  // Only add local fallback when in development or if no env provided
  if (!envUri || process.env.NODE_ENV !== 'production') candidates.push(localFallback);

  let lastErr = null;

  for (const uri of candidates) {
    try {
      const conn = await mongoose.connect(uri, { dbName: process.env.DB_NAME });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      lastErr = error;
      console.error(`❌ Failed to connect using '${uri}': ${error.message}`);
      // provide a hint for SRV DNS name issues
      if (error.message && /querySrv|ENOTFOUND|EBADNAME/i.test(error.message)) {
        console.error('Hint: If you are using a mongodb+srv URI, ensure the host is a full cluster domain (example: cluster0.abcde.mongodb.net) and that DNS is available.');
      }
      // try next candidate
    }
  }

  // If we reach here, none of the candidates worked
  console.error('MongoDB connection failed.');
  console.error('Set the MONGO_URI (or MONGODB_URI) env var to a valid connection string.');
  console.error("Example: mongodb+srv://<user>:<pass>@cluster0.xxxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority");
  if (lastErr) console.error(`Last error: ${lastErr.message}`);

  // Exit in production, but in development keep process alive to allow fixing without restart loop
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
  return null;
};

export default connectDB;




