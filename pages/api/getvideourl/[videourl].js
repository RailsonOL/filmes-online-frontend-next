import cheerio from 'cheerio'
import axios from 'axios'
import puppeteer from 'puppeteer'
import { responseErrorJson, responseJson, encodeDecode, exibirTudo, atualizarPorDataSimples } from '../../../utils/utils'
import FilmesRecentes from '../../../models/FilmesRecentes'
import FilmesDestaque from '../../../models/FilmesDestaque'
import SeriesRecentes from '../../../models/SeriesRecentes'
import dbConnect from '../../../utils/dbConnect'

const get = async (req, res) => {
    try {
        let videourl = encodeDecode(req.query.videourl, 'decode', 'base64')

        const browser = await puppeteer.launch()

        const page = await browser.newPage()
        await page.goto(videourl)
        const url = await page.url()

        await browser.close()
        
        res.setHeader('Cache-Control', 's-maxage=72000000, stale-while-revalidate')
        return res.redirect(301, url)

    } catch (error) {
        return responseErrorJson(res, 'getVideoUrl::get', error);
    }
}

export default get