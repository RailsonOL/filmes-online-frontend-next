import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FilmesRecentesSchema = new Schema({
    titulo: { type: String, required: true, unique: true },
    img: String,
    nota: String,
    link: String,
    qualidade: String,
    ano: String,
    createdAt: Number,
    updatedAt: Number
}, { timestamps: true })

export default mongoose.models.Serie || mongoose.model('Serie', FilmesRecentesSchema)