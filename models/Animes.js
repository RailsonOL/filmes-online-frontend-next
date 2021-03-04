import mongoose from 'mongoose'

const Schema = mongoose.Schema

const AnimesSchema = new Schema({
  titulo: { type: String, required: true },
  img: String,
  episodios: [String],
  ano: String,
  descricao: String,
  categorias: [String],
  pagina: { type: String, required: true, unique: true },
  tipo: { type: String, default: 'TemporadaAnime' },
  createdAt: Number,
  updatedAt: Number
}, { timestamps: true })

export default mongoose.models.Animes || mongoose.model('Animes', AnimesSchema)
