import { useEffect, useState } from 'react';
import TextBlock from './TextBlock';

import '../styles/Soins.css';

export default function RefusSoins(props) {

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
    setHasClicked(false);
  }, [props.pageVal]);

  const generateDateString = (date) => {
    const dateStr = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2, '0')}/${date.getFullYear()} `;
    const timeStr = `${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`;
    return dateStr + timeStr;
  }

  return (
    <>
      <div className='left'>
        <TextBlock>
          - **Prénom Nom du LSMS :** {report['lsms-name']}<br />
          - **Prénom Nom ID du patient :** {report['patient-name']}<br />
          - **Date et Heure de la prise en charge :** {generateDateString(loadDate)}<br />
          - **Récapitulatif des blessures :** {report['soins-recap']}<br />
          - **Raison du refus :** {report['soins-reason']}
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
          <button
            onClick={() => {
              setLoadDate(new Date())
            }}
          >
            Réinitialiser la date
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
            <p className='save'
              onClick={() => {
                window.localStorage.setItem('lsms-name', report['lsms-name']);
                setHasClicked(true);
              }}
            >{hasClicked ? 'Enregistré !' : 'Enregistrer pour plus tard'}</p>
          </div>
          <div className='reportInput'>
            <label htmlFor="patient-name">Prénom, Nom et ID du patient : *</label>
            <input id="patient-name" type="text" placeholder="Ex: Foo Bar 1924" onChange={(e) => handleChange('patient-name', e)} value={report['patient-name'] || ''}/>
          </div>
          <div className='reportInput'>
            <label htmlFor="soins-recap">Récapitulatif des blessures : *</label>
            <input id="soins-recap" type="text" placeholder="Ex: Hématome au genou droit" onChange={(e) => handleChange('soins-recap', e)} value={report['soins-recap'] || ''}/>
          </div>
          <div className='reportInput'>
            <label htmlFor="soins-reason">Raison du refus : *</label>
            <input id="soins-reason" type="text" placeholder="Ex: Pas assez de temps" onChange={(e) => handleChange('soins-reason', e)} value={report['soins-reason'] || ''}/>
          </div>
        </div>
      </div>

    </>
  )
}