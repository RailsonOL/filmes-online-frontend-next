import mongoose from 'mongoose'

const Schema = mongoose.Schema

const EpsodiosSchema = new Schema({
    titulo: { type: String, required: true},
    img: String,
    duracao: String,
    qualidade: String,
    ano: String,
    descricao: String,
    links: [String],
    pagina: {type: String, required: true, unique: true },
    createdAt: Number,
    updatedAt: Number
}, { timestamps: true })


export default mongoose.models.Epsodios || mongoose.model('Epsodios', EpsodiosSchema)