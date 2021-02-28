import React, { Component } from "react";
// import M from "materialize-css";
import $ from 'jquery';

if (typeof window !== 'undefined') {
    window.$ = $;
    window.jQuery = $;
    const M = require('materialize-css');
}

class Carousel extends Component {
    constructor(props) {
        super(props)
        this.props = props;
    }

    componentDidMount() {
        const options = {
            fullWidth: true,
            numVisible: 5,
            // indicators: true,
            // padding: 2,
            // dist: 0
        };

        // move next carousel
        $('.moveNextCarousel').on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.carousel#' + this.id).carousel('next');
        });

        // move prev carousel
        $('.movePrevCarousel').on("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.carousel#' + this.id).carousel('prev');
        });
        M.Carousel.init(this.Carousel, options);
    }

    render() {
        return (
            <>
                <header className="section-header">
                    <div className="rw alg-cr jst-sb">
                        <h3 className="section-title">{this.props.nameForGrid}</h3>
                        <ul className="rw">
                            {
                                this.props.seeMore != undefined
                                    ?
                                    <li><a href={this.props.seeMore}><i className="material-icons" style={{ fontSize: 15 }}>add</i> Ver mais</a></li>
                                    :
                                    ''
                            }
                        </ul>
                    </div>
                    <ul className="aa-tbs ax-tbs" ></ul>
                </header>

                <div ref={Carousel => { this.Carousel = Carousel; }} className="carousel center" id={this.props.idForCarousel}>
                    <div className="middle-indicator leftA">
                        <a href="#" id={this.props.idForCarousel} className="movePrevCarousel middle-indicator-text waves-effect waves-light content-indicator"><i className="material-icons left middle-indicator-text">chevron_left</i></a>
                    </div>

                    <div className="middle-indicator rightA">
                        <a href="#" id={this.props.idForCarousel} className="moveNextCarousel middle-indicator-text waves-effect waves-light content-indicator"><i className="material-icons right middle-indicator-text">chevron_right</i></a>
                    </div>
                    <ul className='post-lst rw sm rcl2 rcl3a rcl4b rcl3c rcl4d rcl6e'>
                        <PostItem itemsForGrid={this.props.itemsForGrid} toPage={this.props.toPage} />
                    </ul>
                </div>
            </>
        );
    }
}

const PostItem = props => {
    const { itemsForGrid, toPage } = props
    const rateTmdb = (nota) => {
        return nota ? nota.replace('TMDB', '') : '--'
    }

    return itemsForGrid.map((item, index) => (
        <li className="carousel-item" key={item._id}>
            <article className="post dfx fcl movies">
                <header className="entry-header">
                    <h2 className="entry-title">{item.titulo}</h2>
                    <div className="entry-meta"> <span className="vote"><span>TMDB</span> {rateTmdb(item.nota)}</span></div>
                </header>
                <div className="post-thumbnail or-1">
                    <figure>
                        <img loading="lazy"
                            src={item.img}
                            alt={item.titulo} />
                    </figure>
                    <span className="post-ql">
                        <span className="Qlty">{item.qualidade || 'HD'}</span>
                    </span>
                    <span className="year">{item.ano}</span>
                    <span className="play material-icons" style={{ fontSize: 40 }}>play_arrow</span>
                </div> <a href={`/${item.tipo == "TemporadaAnime" ? 'anime' : toPage || 'assistir'}/${item.pagina}`}
                    className="lnk-blk"></a>
            </article>
        </li>
    ))
}

export default Carousel;
