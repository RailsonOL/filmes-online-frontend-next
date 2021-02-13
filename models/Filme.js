import mongoose from 'mongoose'

const Schema = mongoose.Schema

const FilmeSchema = new Schema({
    titulo: { type: String, required: true},
    img: String,
    nota: String,
    links: [String],
    trailer: String,
    descricao: String,
    qualidade: String,
    duracao: String,
    ano: { type: String, required: true },
    categorias: [String],
    pagina: {type: String, required: true, unique: true },
    createdAt: Number,
    updatedAt: Number
}, { timestamps: true })

export default mongoose.models.Filme || mongoose.model('Filme', FilmeSchema)
