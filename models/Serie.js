import mongoose from 'mongoose'

const Schema = mongoose.Schema

const SerieSchema = new Schema({
  titulo: { type: String, required: true },
  img: String,
  nota: String,
  descricao: String,
  trailer: String,
  qualidade: String,
  duracao: String,
  ano: { type: String, required: true },
  temporadas: [String],
  categorias: [String],
  pagina: { type: String, required: true, unique: true },
  createdAt: Number,
  updatedAt: Number
}, { timestamps: true })

export default mongoose.models.Serie || mongoose.model('Serie', SerieSchema)
