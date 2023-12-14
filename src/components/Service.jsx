import { useEffect, useState } from "react";
import TextBlock from "./TextBlock";

import '../styles/Service.css';

export default function Service() {

  const [loadDate, setLoadDate] = useState(new Date(window.localStorage.getItem('service-start-date') || new Date()));
  const [customHour, setCustomHour] = useState([]);
  const [endDate, setEndDate] = useState();

  const [actions, setActions] = useState([]);
  const [others, setOthers] = useState([]);

  const [otherCount, setOtherCount] = useState(0);

  const [modifyHour, setModifyHour] = useState(false);

  const actionsList = [
    'Blessures légeres',
    'Blessures moyennes',
    'Blessures graves',
    '10-18',
    '10-19',
  ];

  useEffect(() => {
    if (!window.localStorage.getItem('service-start-date')) window.localStorage.setItem('service-start-date', new Date());
    if (window.localStorage.getItem('service-actions')) {
      setActions(JSON.parse(window.localStorage.getItem('service-actions')))
    }
    if (window.localStorage.getItem('service-others')) {
      const oth = JSON.parse(window.localStorage.getItem('service-others'));
      setOthers(oth)
      setOtherCount(oth.length)
    }
    if (window.localStorage.getItem('service-end-date')) {
      setEndDate(new Date(window.localStorage.getItem('service-end-date')))
    }
  }, [])

  const getOffset = () => {
    if (!endDate) return '';
    const offset = endDate-loadDate;
    const minutes = Math.round(((offset % 86400000) % 3600000) / 60000);
    return Math.floor((offset % 86400000) / 3600000) + 'h' + String(minutes).padStart(2, '0') ;
  }
  
  const getEndDateString = () => {
    if (!endDate) return '';
    return endDate.getHours() + 'h' + String(endDate.getMinutes()).padStart(2, '0');
  }

  const generateActionsList = () => {
    const ele = [];
    for (let [index, action] of actionsList.entries()) {
      ele.push(<div className='action'>
        <p>{action}</p>
        <span
          className={`actionButton ${(!actions[index] || actions[index] === 0) && 'disabled'}`}
          onClick={() => {
            if (!actions[index] || actions[index] === 0) return;
            const newActions = [...actions];
            newActions[index] = newActions[index] - 1;
            setActions(newActions);
            window.localStorage.setItem('service-actions', JSON.stringify(newActions));
          }}
          >-</span>
        <span>{actions[index] || 0}</span>
        <span
          className='actionButton'
          onClick={() => {
            const newActions = [...actions];
            if (!newActions[index]) newActions[index] = 1;
            else newActions[index] = newActions[index] + 1;
            setActions(newActions);
            window.localStorage.setItem('service-actions', JSON.stringify(newActions));
          }}
        >+</span>
      </div>)
    }
    return ele;
  }

  const generateOtherList = () => {
    const ele = [];
    for (let i = 0; i < otherCount; i++) {
      ele.push(<div className='action'>
        <input
          type="text"
          placeholder='Autre'
          onChange={(e) => {
            const newOthers = [...others];
            if (!others[i]) {
              newOthers[i] = {
                val: e.currentTarget.value,
                number: 0,
              }
            } else {
              newOthers[i].val = e.currentTarget.value;
            }
            setOthers(newOthers)
            window.localStorage.setItem('service-others', JSON.stringify(newOthers));
          }}
          defaultValue={others[i]?.val}
        />
        <span
          className={`actionButton ${(!others[i] || others[i].number === 0) && 'disabled'}`}
          onClick={() => {
            if (!others[i] || others[i].number === 0) return;
            const newOthers = [...others];
            newOthers[i].number = newOthers[i].number - 1;
            setOthers(newOthers)
            window.localStorage.setItem('service-others', JSON.stringify(newOthers));
          }}
        >-</span>
        <span>{others[i]?.number || 0}</span>
        <span
          className='actionButton'
          onClick={() => {
            const newOthers = [...others];
            if (!newOthers[i]) newOthers[i] = {
              val: '',
              number: 1,
            };
            else newOthers[i].number = newOthers[i].number + 1;
            setOthers(newOthers)
            window.localStorage.setItem('service-others', JSON.stringify(newOthers));
          }}
        >+</span>
      </div>)
    }
    return ele;
  }

  const displayActionsList = () => {
    let str = '';
    for (let [index, action] of actionsList.entries()) {
      if (!actions[index] || actions[index] === 0) continue;
      else str+=`${actions[index]}x ${action} - `
    }
    for (let other of others) {
      if (!other || other.number === 0 || other.val === '') continue;
      str+=`${other.number}x ${other.val} - `
    }
    if (str) str = str.substring(0, str.length - 2)
    return str;
  }

  return (
    <>
      <div className="left">
        <TextBlock>
          - PDS :&nbsp;{loadDate.getHours()}h{String(loadDate.getMinutes()).padStart(2, '0')}<br />
          - Rapide recap des opérations réalisées :&nbsp;{displayActionsList()}<br />
          - FDS :&nbsp;{getEndDateString()}<br />
          **- Total :&nbsp;{getOffset()}**
        </TextBlock>

        <div className='buttonsBar'>
          <button
            onClick={() => {
              setLoadDate(new Date());
              window.localStorage.setItem('service-start-date', new Date());
              setEndDate();
              window.localStorage.removeItem('service-end-date');
              setActions([]);
              window.localStorage.removeItem('service-actions');
              setOthers([]);
              window.localStorage.removeItem('service-others');
              setOtherCount(0);
            }}
            style={{
              '--text-color': '#f55'
            }}
          >
            Réinitialiser le service
          </button>
          <button
            onClick={() => {
              setEndDate(new Date());
              window.localStorage.setItem('service-end-date', new Date());
            }}
          >
            Prendre une fin de service
          </button>
        </div>

        <span style={{ userSelect: 'none', marginBottom: '20px' }} onClick={() => setModifyHour(val => !val)}>Modifier l'heure {modifyHour ? '-' : '+'}</span>

        <div className={`modifyHours ${!modifyHour && 'disabled'}`}>
          <input
            type="number"
            min={0}
            max={24}
            placeholder='Heures (00)'
            onChange={(e) => {
              let nb = Number.parseInt(e.target.value);
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
            onChange={(e) => {
              let nb = Number.parseInt(e.target.value);
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
              const cDate = new Date(loadDate);
              cDate.setHours(customHour[0] != NaN ? customHour[0] : loadDate.getHours(), customHour[1] != NaN ? customHour[1] : loadDate.getMinutes(), 0);
              setLoadDate(cDate)
            }}
          >Définir l'heure de début</button>
        </div>
      </div>
      

      <div className="right">
        <div className='actions'>
          {generateActionsList()}
          {generateOtherList()}
          <button
            className="addOther"
            onClick={() => setOtherCount(val => val + 1)}
          >Ajouter une action</button>
        </div>
      </div>

    </>
  )
}