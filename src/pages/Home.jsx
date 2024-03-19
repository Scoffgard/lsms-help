import { useState } from 'react';

import Header from '../components/Header';
import Soins from '../components/Soins';
import Service from '../components/Service';
import RefusSoins from '../components/RefusSoins';
import Impayes from '../components/Impayes';
import LspdBcso from '../components/LspdBcso';
import PH from '../components/PH';

import {ReactComponent as Cross} from '../assets/cross.svg';

//import ChristmasHat from '../assets/christmas_hat.png';

import '../styles/Home.css';

export default function Home() {

  const [page, setPage] = useState(0);

  const [soinsList, setSoinsList] = useState([1]);
  const [soinsCurrent, setSoinsCurrent] = useState(1);

  const [nameList, setNameList] = useState([]);

  const menuEntries = [
    'Service',
    'Rapport de soins',
    'Refus de soins',
    'Impayés',
    'LSPD-BCSO',
    'PH',
  ];

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

  return (
    <div className="home">
      {/*<img src={ChristmasHat} className='hat'/>
      <div className='snow'/>*/}
      <h1>Aide LSMS</h1>
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
        <Impayes pageSetter={setPage} pageVal={page} />
      </div>
      <div className='pageContainer' style={{display: page === 4 ? 'inherit' : 'none'}}>
        <LspdBcso pageSetter={setPage} pageVal={page} />
      </div>
      <div className='pageContainer' style={{display: page === 5 ? 'inherit' : 'none'}}>
        <PH pageSetter={setPage} pageVal={page} />
      </div>
    </div>
  )
}