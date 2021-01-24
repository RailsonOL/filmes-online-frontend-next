import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FilmeSchema = new Schema({
    titulo: { type: String, required: true, unique: true },
    img: String,
    nota: String,
    links: [String],
    trailer: String,
    descricao: String,
    duracao: String,
    ano: { type: String, required: true },
    categorias: [String],
    pagina: String,
    createdAt: Number,
    updatedAt: Number
}, { timestamps: true })

export default mongoose.models.Filme || mongoose.model('Filme', FilmeSchema)
