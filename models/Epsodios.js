import mongoose from 'mongoose'

const Schema = mongoose.Schema

const EpsodiosSchema = new Schema({
    titulo: String,
    img: String,
    duracao: String,
    ano: String,
    descricao: String,
    links: [String],
    pagina: String
}, { timestamps: true })


export default mongoose.models.Epsodios || mongoose.model('Epsodios', EpsodiosSchema)