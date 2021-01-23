import mongoose from 'mongoose'

const Schema = mongoose.Schema

const TemporadaSchema = new Schema({
    temporadas: String,
    episodios: [String],
    pagina: String
}, { timestamps: true })

export default mongoose.models.Temporada || mongoose.model('Temporada', TemporadaSchema)