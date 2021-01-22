import mongoose from 'mongoose'

async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return
  }

  return mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
}

export default dbConnect