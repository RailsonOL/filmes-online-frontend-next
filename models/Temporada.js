import mongoose from 'mongoose'

const Schema = mongoose.Schema

const TemporadaSchema = new Schema({
    temporadas: String,
    episodios: [String],
    pagina: {type: String, required: true, unique: true },
    createdAt: Number,
    updatedAt: Number
}, { timestamps: true })

export default mongoose.models.Temporada || mongoose.model('Temporada', TemporadaSchema)