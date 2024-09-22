import { useEffect, useState } from 'react';
import TextBlock from './TextBlock';

import '../styles/Soins.css';
import { newDate } from '../utlis';

export default function PH(props) {

  const [report, setReport] = useState({});

  const [date, setDate] = useState(newDate());

  const [customHour, setCustomHour] = useState([]);
  const [modifyHour, setModifyHour] = useState(false);

  const handleChange = (name, event) => {
    const newReport = { ...report };
    newReport[name] = event.target.value;
    setReport(newReport);
  }

  useEffect(() => {
    const newReport = {...report};
    if (window.localStorage.getItem('lsms-name')) newReport['lsms-name'] = window.localStorage.getItem('lsms-name');
    if (window.localStorage.getItem('lsms-id')) newReport['lsms-id'] = window.localStorage.getItem('lsms-id');
    setReport(newReport)
  }, [props.pageVal]);

  const getDateString = () => {
    if (!date) return;
    let dateStr = `Le ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth()+1).padStart(2, '0')}/${date.getFullYear()} `;
    dateStr += `à ${date.getHours()}h${String(date.getMinutes()).padStart(2, '0')}`;
    return dateStr;
  }

  return (
    <>
      <div className='left'>
        <TextBlock>
          Prénom Nom | ID de l'équipage présent dans l'appareil :<br />
          <br />
          - {report['lsms-name']} | {report['lsms-id']}<br />
          {report['copilot-1'] && '- '}
          {report['copilot-1']}
          {report['copilot-1'] && <br />}
          {report['copilot-2'] && '- '}
          {report['copilot-2']}
          {report['copilot-2'] && <br />}
          <br />
          Raison du départ : {report['inter-reason']}<br />
          <br />
          Date et Heure du Vol : {getDateString()}<br />
        </TextBlock>
        <div className='buttonsBar'>
          <button
            onClick={() => {
              setReport({'lsms-name': report['lsms-name']});
              setDate(newDate());
              setCustomHour([]);
            }}
            style={{
              '--text-color': '#f55'
            }}
            >
            Réinitialiser la fiche
          </button>
          <button
            onClick={() => {
              setDate(newDate());
              setCustomHour([]);
            }}
            style={{
              '--text-color': '#fff'
            }}
          >
            Reinitialiser l'heure
          </button>
        </div>

        <span style={{ userSelect: 'none', marginBottom: '20px' }} onClick={() => setModifyHour(val => !val)}>Modifier l'heure {modifyHour ? '-' : '+'}</span>

        <div className={`modifyHours ${!modifyHour && 'disabled'}`}>
          <input
            type="number"
            min={0}
            max={24}
            placeholder='Heures (00)'
            value={customHour[0] || ''}
            onChange={(e) => {
              let nb = Number.parseInt(e.target.value) || 0;
              if (nb === NaN) return;
              if (nb < 0) nb = 0;
              if (nb >= 24) nb = 23;
              const newHour = [...customHour];
              newHour[0] = nb;
              setCustomHour(newHour);
            }}
          />
          <input
            type="number"
            placeholder='Minutes (00)'
            value={customHour[1] || ''}
            onChange={(e) => {
              let nb = Number.parseInt(e.target.value) || 0;
              if (nb === NaN) return;
              if (nb < 0) nb = 0;
              if (nb >= 60) nb = 59;
              const newHour = [...customHour];
              newHour[1] = nb;
              setCustomHour(newHour);
            }}
          />
          <button
            onClick={(e) => {
              const cDate = newDate(date);
              cDate.setHours(customHour[0] != undefined ? customHour[0] : date.getHours(), customHour[1] != undefined ? customHour[1] : date.getMinutes(), 0);
              setDate(cDate)
            }}
          >Définir l'heure du vol</button>
        </div>
      </div>


      <div className='right'>
        <div className="soinsDataContainer">
          <div className='oneLiner'>
            <div className='reportInput'>
              <label htmlFor="lsms-name">Prénom et Nom du pilote : *</label>
              <input id="lsms-name" type="text" placeholder="Ex: Foo Bar" onChange={(e) => handleChange('lsms-name', e)} value={report['lsms-name'] || ''}/>
            </div>
            <div className='reportInput'>
              <label htmlFor="lsms-id">ID du pilote : *</label>
              <input id="lsms-id" type="text" placeholder="Ex: 1924" onChange={(e) => handleChange('lsms-id', e)} value={report['lsms-id'] || ''}/>
            </div>
          </div>
          <div className='oneLiner'>
            <div className='reportInput'>
              <label htmlFor="copilot-1">Copilote 1 :</label>
              <input id="copilot-1" type="text" placeholder="Ex: John Doe 2309" onChange={(e) => handleChange('copilot-1', e)} value={report['copilot-1'] || ''}/>
            </div>
            <div className='reportInput'>
              <label htmlFor="copilot-2">Copilote 2 :</label>
              <input id="copilot-2" type="text" placeholder="Ex: John Doe 2309" onChange={(e) => handleChange('copilot-2', e)} value={report['copilot-2'] || ''}/>
            </div>
          </div>
          <div className='reportInput'>
            <label htmlFor="inter-reason">Raison de l'intervention : *</label>
            <input id="inter-reason" type="text" placeholder="Ex: Intervention Aéroport Sandy Shores" onChange={(e) => handleChange('inter-reason', e)} value={report['inter-reason'] || ''}/>
          </div>
        </div>
      </div>

    </>
  )
}