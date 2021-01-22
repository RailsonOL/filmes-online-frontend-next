import mongoose from 'mongoose'

const Schema = mongoose.Schema

const Filme = mongoose.model('Filme', new Schema({
  titulo: {type: String, required:true, unique:true}, 
  img: String, 
  nota: String, 
  links: [String],
  descricao: String,
  duracao: String, 
  ano: {type: String, required:true},
  categorias: [String],
  pagina: String,
  createdAt: Number,
  updatedAt: Number
},{ timestamps: true }))

const Serie = mongoose.model('Series', new Schema({
  titulo: {type: String, required:true, unique:true}, 
  img: String, 
  nota: String,
  descricao: String,
  qualidade: String,
  duracao: String, 
  ano: {type: String, required:true},
  temporadas: [String],
  categorias: [String],
  pagina: String,
  createdAt: Number,
  updatedAt: Number
},{ timestamps: true }))

const FilmesDestaque = mongoose.model('FilmesDestaque', new Schema({
  titulo: {type: String, required:true, unique:true}, 
  img: String, 
  nota: String, 
  link: String, 
  duracao: String, 
  ano: String,
  createdAt: Number,
  updatedAt: Number
},{ timestamps: true }))

const SeriesRecentes = mongoose.model('SeriesRecentes', new Schema({
  titulo: {type: String, required:true, unique:true}, 
  img: String, 
  nota: String, 
  link: String, 
  qualidade: String, 
  ano: String,
  createdAt: Number,
  updatedAt: Number
},{ timestamps: true }))

const FilmesRecentes = mongoose.model('FilmesRecentes', new Schema({
  titulo: {type: String, required:true, unique:true}, 
  img: String, 
  nota: String, 
  link: String, 
  qualidade: String, 
  ano: String,
  createdAt: Number,
  updatedAt: Number
},{ timestamps: true }))

const Epsodios = mongoose.model('Epsodios', new Schema({
  titulo: String, 
  img: String, 
  duracao:String, 
  ano:String, 
  descricao:String, 
  links:[String], 
  pagina:String
},{ timestamps: true }))

const Temporada = mongoose.model('Temporada', new Schema({
  temporadas: String,
  episodios: [String], 
  pagina: String
},{ timestamps: true }))

export default { Filme, Serie, FilmesDestaque, SeriesRecentes, FilmesRecentes, Epsodios, Temporada }