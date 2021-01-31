import mongoose from 'mongoose'

const Schema = mongoose.Schema

const SeriesRecentesSchema = new Schema({
    titulo: { type: String, required: true, unique: true },
    img: String,
    nota: String,
    pagina: String,
    qualidade: String,
    ano: String,
    createdAt: Number,
    updatedAt: Number
}, { timestamps: true })

export default mongoose.models.SeriesRecentes || mongoose.model('SeriesRecentes', SeriesRecentesSchema)