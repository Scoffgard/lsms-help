import { useEffect, useState } from 'react';

import Header from '../components/Header';
import Soins from '../components/Soins';
import Service from '../components/Service';
import RefusSoins from '../components/RefusSoins';
import Morgue from '../components/Morgue';
import Impayes from '../components/Impayes';
import Sast from '../components/Sast';
import PH from '../components/PH';
import Settings from '../components/Settings';

import {ReactComponent as Cross} from '../assets/cross.svg';

import ChristmasHat from '../assets/christmas_hat.png';

import '../styles/Home.css';

export default function Home() {

  const [page, setPage] = useState(0);

  const [soinsList, setSoinsList] = useState([1]);
  const [soinsCurrent, setSoinsCurrent] = useState(1);

  const [showTip, setShowTip] = useState(window.localStorage.getItem('showTip') == "false" ? false : true);

  const [nameList, setNameList] = useState([]);

  const menuEntries = [
    'Service',
    'Rapport de soins',
    'Refus de soins',
    'Morgue',
    'Impayés',
    'SAST',
    'PH',
    'Paramètres',
  ];

  const handleTipClick = (value) => {
    setShowTip(value)
    window.localStorage.setItem('showTip', value);
  }

  const generateSoinsList = () => {
    let soinsEle = [];
    let menuEle = [];

    for(let [index, soin] of soinsList.entries()) {
      soinsEle.push(
        <div key={soin} className='pageContainer' style={{display: soinsCurrent === soin ? 'inherit' : 'none'}}>
          <Soins pageSetter={setPage} pageVal={page} setName={(name) => {
            const prevNameList = [...nameList];
            prevNameList[index] = name;
            setNameList(prevNameList);
          }}
          resetName={() => {
            const prevNameList = [...nameList];
            prevNameList.splice(index, 1);
            setNameList(prevNameList);
          }}/>
        </div>
      );
      menuEle.push(<div 
        className={`entry ${soinsCurrent === soin && 'selected'}`}
        onClick={() => setSoinsCurrent(soin)}
      >
        Rapport
        {nameList[index] ?
          <>
          &nbsp;de&nbsp;<b>{nameList[index]}</b> 
          </>
          :  
          <>
            &nbsp;n°{index+1}
          </>
        }
        {index !== 0 &&
          <Cross
            style={{fill: 'white'}}
            onClick={() => {
              const prevSoinsList = [...soinsList];
              prevSoinsList.splice(index, 1);
              setSoinsList(prevSoinsList);
              const prevNameList = [...nameList];
              prevNameList.splice(index, 1);
              setNameList(prevNameList);
            }}
          />
        }
      </div>)
    }
    return (<>
      <div className='soinsHeader'>
        {menuEle}
        <div 
          className={`entry`}
          onClick={() => {
            const newEle = soinsList[soinsList.length-1]+1;
            setSoinsCurrent(newEle);
            const prevSoinsList = [...soinsList];
            prevSoinsList.push(newEle);
            setSoinsList(prevSoinsList);
          }}
        >
        Ajouter un rapport
        </div>
      </div>
      {soinsEle}
    </>)
  }

  const clearLocalStorage = () => {

    console.log('test')
    window.localStorage.removeItem('lsms-id');
    window.localStorage.removeItem('lsms-name');
    window.localStorage.removeItem('service-actions');
    window.localStorage.removeItem('service-others');
    window.localStorage.removeItem('service-start-date');

    if (
      window.confirm("Nettoyage effectué, cliquez sur \"OK\" pour réessayer le transfert, sinon cliquez sur \"Annuler\"")
    ) window.location.href="https://lsms.scoffgard.com/";
    else window.location.href="https://sams.scoffgard.com/";
  }
  
  const launchTransfer = () => {
    const transferData = {
      lsmsId: window.localStorage.getItem('lsms-id'),
      lsmsName: window.localStorage.getItem('lsms-name'),
      serviceActions: window.localStorage.getItem('service-actions'),
      serviceOthers: window.localStorage.getItem('service-others'),
      serviceStartDate: window.localStorage.getItem('service-start-date'),
    }

    const transferDataEncoded = encodeURIComponent(JSON.stringify(transferData));

    window.location.href="https://sams.scoffgard.com/?data=" + transferDataEncoded;
  }

  const applyTransfer = () => {
    const queryParameters = new URLSearchParams(window.location.search);
    const transferDataUnparsed = queryParameters.get("data");

    if (!transferDataUnparsed) return;

    try {
      const transferData = JSON.parse(transferDataUnparsed);
      
      window.localStorage.setItem('lsms-id', transferData.lsmsId || "");
      window.localStorage.setItem('lsms-name', transferData.lsmsName || "");
      window.localStorage.setItem('service-actions', transferData.serviceActions || []);
      window.localStorage.setItem('service-others', transferData.serviceOthers || []);
      window.localStorage.setItem('service-start-date', transferData.serviceStartDate);

      alert("Transfert effectué, la page va maintenant recharger afin de charger les données.");
      window.location.href="https://sams.scoffgard.com/";
    } catch (e) {
      alert("Transfert impossible, merci de contacter le propriétaire du site.")
    }
  }

  useEffect(() => {
    if (
      window.location.hostname.includes('lsms') && 
      window.confirm("Le site va changer d'adresse pour devenir : https://sams.scoffgard.com. La cloture de cette adresse aura lieu le 15/09/2024. Un transfert de données automatique est disponible. Cliquez sur \"OK\" pour lancer le transfert. Cliquez sur \"Annuler\" pour rester sur ce site.")
    ) {
      launchTransfer();
    } else if (
      window.location.hostname.includes('sams')
    ) {
      const queryParameters = new URLSearchParams(window.location.search);
      const transferDataUnparsed = queryParameters.get("data");

      if (!transferDataUnparsed) return;

      if (transferDataUnparsed === 'clear') clearLocalStorage();
      else applyTransfer();
    }
  }, [])

  return (
    <div className="home">
      { showTip ?
        <div className='helper'>
          Psst : Pour enregistrer votre nom vous avez maintenant l'onglet :&nbsp;
          <span 
            className="link"
            onClick={() => setPage(7)}
          >Paramètres</span>&emsp;
          <span 
            className='tipaction'
            onClick={() => handleTipClick(false)}
          >✖</span>
        </div>
        :
        <div className='helper'>
          <span 
            className='tipaction'
            onClick={() => handleTipClick(true)}
          ><b>?</b></span>
        </div>
      }
      <img src={ChristmasHat} className='hat'/>
      <div className='snow'/>
      <h1>Aide SAMS</h1>
      <Header page={page} setPage={setPage} entries={menuEntries} />

      <div className='pageContainer' style={{display: page === 0 ? 'inherit' : 'none'}}>
        <Service pageSetter={setPage} pageVal={page} />
      </div>
      <div style={{display: page === 1 ? 'flex' : 'none', flexDirection: 'column'}}>
        {generateSoinsList()}
      </div>
      <div className='pageContainer' style={{display: page === 2 ? 'inherit' : 'none'}}>
        <RefusSoins pageSetter={setPage} pageVal={page} />
      </div>
      <div className='pageContainer' style={{display: page === 3 ? 'inherit' : 'none'}}>
        <Morgue pageSetter={setPage} pageVal={page} />
      </div>
      <div className='pageContainer' style={{display: page === 4 ? 'inherit' : 'none'}}>
        <Impayes pageSetter={setPage} pageVal={page} />
      </div>
      <div className='pageContainer' style={{display: page === 5 ? 'inherit' : 'none'}}>
        <Sast pageSetter={setPage} pageVal={page} />
      </div>
      <div className='pageContainer' style={{display: page === 6 ? 'inherit' : 'none'}}>
        <PH pageSetter={setPage} pageVal={page} />
      </div>
      <div className='pageContainer' style={{display: page === 7 ? 'inherit' : 'none'}}>
        <Settings pageSetter={setPage} pageVal={page} />
      </div>
    </div>
  )
}