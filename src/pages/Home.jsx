import { useState } from 'react';

import Header from '../components/Header';
import Soins from '../components/Soins';
import Service from '../components/Service';
import RefusSoins from '../components/RefusSoins';
import Impayes from '../components/Impayes';
import LspdBcso from '../components/LspdBcso';

import {ReactComponent as Cross} from '../assets/cross.svg';

import '../styles/Home.css';

export default function Home() {

  const [page, setPage] = useState(0);

  const [soinsList, setSoinsList] = useState([1]);
  const [soinsCurrent, setSoinsCurrent] = useState(1)

  const menuEntries = [
    'Service',
    'Rapport de soins',
    'Refus de soins',
    'Impayés',
    'LSPD-BCSO',
  ];

  const generateSoinsList = () => {
    let soinsEle = [];
    let menuEle = [];

    for(let [index, soin] of soinsList.entries()) {
      soinsEle.push(
        <div key={soin} className='pageContainer' style={{display: soinsCurrent === soin ? 'inherit' : 'none'}}>
          <Soins pageSetter={setPage} pageVal={page} />
        </div>
      );
      menuEle.push(<div 
        className={`entry ${soinsCurrent === soin && 'selected'}`}
        onClick={() => setSoinsCurrent(soin)}
      >
        Rapport n°{soin}
        {index !== 0 &&
          <Cross
            style={{fill: 'white'}}
            onClick={() => {
              const prevSoinsList = [...soinsList];
              prevSoinsList.splice(index, 1);
              setSoinsList(prevSoinsList);
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
    </div>
  )
}