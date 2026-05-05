import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Change this to your MongoDB URI - default is localhost
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';
    
    const conn = await mongoose.connect(mongoURI);

    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
