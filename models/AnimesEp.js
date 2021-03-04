import mongoose from 'mongoose'

const Schema = mongoose.Schema

const AnimesEpSchema = new Schema({
  titulo: { type: String, required: true },
  img: String,
  duracao: { type: String, default: '-- min' },
  qualidade: String, /* Numero Ep */
  ano: { type: String, default: '--' },
  descricao: String,
  links: [String],
  pagina: { type: String, required: true, unique: true },
  paginaTemporada: { type: String, required: true },
  tipo: { type: String, default: 'EpisodioAnime' },
  createdAt: Number,
  updatedAt: Number
}, { timestamps: true })

export default mongoose.models.AnimesEp || mongoose.model('AnimesEp', AnimesEpSchema)
