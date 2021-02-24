import mongoose from 'mongoose'

const Schema = mongoose.Schema

const AnimesEpRecentesSchema = new Schema({
    titulo: { type: String, required: true, unique: true },
    img: String,
    nota: { type: String, default: "--" },
    pagina: String,
    qualidade: String,
    ano: { type: String, default: "--" },
    createdAt: Number,
    updatedAt: Number
}, { timestamps: true })

export default mongoose.models.AnimesEpRecentes || mongoose.model('AnimesEpRecentes', AnimesEpRecentesSchema)