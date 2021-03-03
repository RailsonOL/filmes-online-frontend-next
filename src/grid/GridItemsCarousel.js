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
            indicators: false,
            padding: 3,
            // dist: 0
        }

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
    // const rateTmdb = (nota) => {
    //     return nota ? nota.replace('TMDB', '') : '--'
    // }

    return itemsForGrid.map((item, index) => (
        <li className="carousel-item" key={item._id}>  
            <div className="carousel-itemss" style={{backgroundImage: `url(${item.img})`}}>
                <a href={`/${item.tipo == "TemporadaAnime" ? 'anime' : toPage || 'assistir'}/${item.pagina}`}>
                    <div className="carousel-itemss-text">
                        <b></b>
                        <span className="season">{item.titulo}</span>
                        <span></span>
                        <small className="spaced">
                            <span>{item.ano}</span>
                            <span>{item.qualidade || 'HD'}</span>
                        </small>
                    </div>
                </a>
            </div>
        </li>
    ))
}

export default Carousel;
