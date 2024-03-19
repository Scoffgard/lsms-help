import { useEffect, useState } from 'react';
import TextBlock from './TextBlock';

import '../styles/Soins.css';

export default function LspdBcso(props) {

  const [report, setReport] = useState({});

  const handleChange = (name, event) => {
    const newReport = { ...report };
    newReport[name] = event.target.value;
    setReport(newReport);
  }

  useEffect(() => {
    if (window.localStorage.getItem('sast-data')) {
      const lspdBcsoData = JSON.parse(window.localStorage.getItem('sast-data'));
      const newReport = {...report};
      newReport['patient-name'] = lspdBcsoData.name;
      newReport['cost'] = lspdBcsoData.cost.toString();
      setReport(newReport);
      window.localStorage.removeItem('sast-data');
    }
  }, [props.pageVal]);

  return (
    <>
      <div className='left'>
        <TextBlock>
          Nom / Prénom / ID : {report['patient-name']}<br />
          Montant initial : {(report['cost'] || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ",")} $
        </TextBlock>
        <div className='buttonsBar'>
          <button
            onClick={() => {
              setReport({});
            }}
            style={{
              '--text-color': '#f55'
            }}
          >
            Réinitialiser la fiche
          </button>
        </div>
      </div>

      <div className='right'>
        <div className="soinsDataContainer">
          <div className='reportInput'>
            <label htmlFor="patient-name">Prénom, Nom et ID du patient : *</label>
            <input id="patient-name" type="text" placeholder="Ex: Foo Bar 1924" onChange={(e) => handleChange('patient-name', e)} value={report['patient-name'] || ''}/>
          </div>
          <div className='reportInput'>
            <label htmlFor="soins-reason">Montant initial : *</label>
            <input id="soins-reason" type="number" placeholder="Ex: 10000" onChange={(e) => handleChange('cost', e)} value={report['cost'] || ''}/>
          </div>
        </div>
      </div>

    </>
  )
}