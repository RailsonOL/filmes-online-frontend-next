import { useEffect, useState } from "react";

const ButtonSelectAudio = (props) => {
  let { currentLink } = props
  let buttonOptionList = props.handleLinktoIframe.map((option, index) => (
    <li key={index.toString()}> <a className={currentLink == option.optionLink ? "btn on" : "btn"} onClick={() => { props.setOptionCurrent(option)}}>
        <span>{option.optionAudio}</span>
      </a></li>
  ));

  return buttonOptionList;
};

const Player = (props) => {
  const [optionCurrent, setOptionCurrent] = useState({});

  const handleLinks = (playerOption) => {
    let objectLinks = playerOption.map((link, index) => {
      return {
        optionAudio: link.split("|")[0],
        optionLink: link.split("|")[1],
      };
    });

    return objectLinks;
  };

  let linksToIframe = handleLinks(props.playerOption);

  useEffect(() => {
    setOptionCurrent(linksToIframe[0])
  }, [props]);
  return (
    <div className="component-player">
      <div className="iframe-player-container">
        <div className="iframe-responsive">
          <iframe allowFullScreen src={optionCurrent.optionLink} id="video-iframe" frameBorder="0" title="main-player"></iframe>
        </div>
      </div>
      
      <aside class="video-options">
        <h4>OPÇÕES</h4>
          <ul className="aa-tbs aa-tbs-video">
            <ButtonSelectAudio
              handleLinktoIframe={linksToIframe}
              currentLink={optionCurrent.optionLink}
              setOptionCurrent={setOptionCurrent}
            />
          </ul>
      </aside>
    </div>
  );
};

export default Player;
