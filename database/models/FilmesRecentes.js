import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FilmesRecentesSchema = new Schema({
  titulo: { type: String, required: true, unique: true },
  img: String,
  nota: String,
  pagina: String,
  qualidade: String,
  ano: String,
  createdAt: Number,
  updatedAt: Number
}, { timestamps: true })

export default mongoose.models.FilmesRecentes || mongoose.model('FilmesRecentes', FilmesRecentesSchema)
