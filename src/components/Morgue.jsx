import { useEffect, useState } from 'react';
import TextBlock from './TextBlock';

import {showId} from '../utlis';

import '../styles/Soins.css';

export default function Morgue(props) {

  const [report, setReport] = useState({});

  const [loadDate, setLoadDate] = useState(new Date());

  const [hasClicked, setHasClicked] = useState(false);

  const handleChange = (name, event) => {
    const newReport = { ...report };
    newReport[name] = event.target.value;
    setReport(newReport);
  }

  useEffect(() => {
    if (window.localStorage.getItem('lsms-name')) {
      const newReport = {...report};
      newReport['lsms-name'] = window.localStorage.getItem('lsms-name');
      setReport(newReport)
    }
    if (window.localStorage.getItem('morgue-data')) {
      const morgueData = JSON.parse(window.localStorage.getItem('morgue-data'));
      const newReport = {...report};
      newReport['patient-name'] = morgueData.name;
      newReport['cost'] = morgueData.cost.toString();
      setReport(newReport);
      window.localStorage.removeItem('morgue-data');
    }
    setHasClicked(false);
  }, [props.pageVal]);

  const generateDateString = (date) => {
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2, '0')}/${date.getFullYear()}`;
    return dateStr;
  }

  const generateHourString = (date) => {
    const dateStr = `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`;
    return dateStr;
  }

  return (
    <>
      <div className='left'>
        <TextBlock>
          - **Prénom Nom du SAMS :** {report['lsms-name']} {showId()}<br />
          - **Prénom Nom ID du patient :** {report['patient-name']}<br />
          - **Date et heure de la prise en charge :** {generateDateString(loadDate)} {generateHourString(loadDate)}<br />
          - **Raison du coma :** {report['morgue-reason']}
        </TextBlock>
        <div className='buttonsBar'>
          <button
            onClick={() => {
              setReport({'lsms-name': report['lsms-name']});
              setLoadDate(new Date())
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
          <div className='oneLiner'>
            <div className='reportInput'>
              <label htmlFor="lsms-name">Votre Prénom et Nom : *</label>
              <input
                id="lsms-name"
                type="text"
                placeholder="Ex: John Doe"
                onChange={(e) => handleChange('lsms-name', e)}
                defaultValue={
                  window.localStorage.getItem('lsms-name') || ''
                }
              />
            </div>
            {/* <p className='save'
              onClick={() => {
                window.localStorage.setItem('lsms-name', report['lsms-name']);
                setHasClicked(true);
              }}
            >{hasClicked ? 'Enregistré !' : 'Enregistrer pour plus tard'}</p> */}
          </div>
          <div className='reportInput'>
            <label htmlFor="patient-name">Prénom, Nom et ID du patient : *</label>
            <input id="patient-name" type="text" placeholder="Ex: Foo Bar 1924" onChange={(e) => handleChange('patient-name', e)} value={report['patient-name'] || ''}/>
          </div>
          <div className='reportInput'>
            <label htmlFor="soins-reason">Raison du coma : *</label>
            <input id="soins-reason" type="text" placeholder="Ex: Balle dans la tête" onChange={(e) => handleChange('morgue-reason', e)} value={report['morgue-reason'] || ''}/>
          </div>
        </div>
      </div>

    </>
  )
}