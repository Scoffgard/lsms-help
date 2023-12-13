import { useEffect, useState } from 'react';
import TextBlock from './TextBlock';

import '../styles/Soins.css';

export default function Impayes(props) {

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
    if (window.localStorage.getItem('impayes-data')) {
      const impayesData = JSON.parse(window.localStorage.getItem('impayes-data'));
      const newReport = {...report};
      newReport['patient-name'] = impayesData.name;
      newReport['cost'] = impayesData.cost.toString();
      setReport(newReport);
      window.localStorage.removeItem('impayes-data');
    }
    setHasClicked(false);
  }, [props.pageVal]);

  const generateDateString = (date) => {
    const dateStr = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    return dateStr;
  }

  return (
    <>
      <div className='left'>
        <TextBlock>
          Prénom Nom du LSMS à rembourser : {report['lsms-name']}<br />
          Prénom Nom ID du patient : {report['patient-name']}<br />
          Date de l'impayés : {generateDateString(loadDate)}<br />
          Somme à rembourser : {(report['cost'] || '0').replace(/\B(?=(\d{3})+(?!\d))/g, ",")} $
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
            <label htmlFor="soins-reason">Somme a rembourser : *</label>
            <input id="soins-reason" type="number" placeholder="Ex: 10000" onChange={(e) => handleChange('cost', e)} value={report['cost'] || ''}/>
          </div>
        </div>
      </div>

    </>
  )
}