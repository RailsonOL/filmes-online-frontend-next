import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FilmesDestaqueSchema = new Schema({
    titulo: { type: String, required: true, unique: true },
    img: String,
    nota: String,
    pagina: String,
    duracao: String,
    ano: String,
    createdAt: Number,
    updatedAt: Number
}, { timestamps: true })

export default mongoose.models.FilmesDestaque || mongoose.model('FilmesDestaque', FilmesDestaqueSchema)