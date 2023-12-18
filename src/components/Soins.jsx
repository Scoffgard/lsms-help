import { useEffect, useRef, useState } from 'react';
import TextBlock from './TextBlock';

import '../styles/Soins.css';
import { toFormatedPrice } from '../utlis';

export default function Soins(props) {

  const [report, setReport] = useState({});

  const [costs, setCosts] = useState({});

  const [hasClicked, setHasClicked] = useState(false);

  const [details, setDetails] = useState(false);

  const detailsRef = useRef();


  const costsList = {
    IRM: {
      cost: 500,
      display: 'IRM',
    },
    radio: {
      cost: 500,
      display: 'Radio',
    },
    stuff: {
      cost: 2000,
      display: 'Accessoires (Béquilles, Fauteil Roulant, Attelle, Minerve, ...)',
    },
  }

  const handleChange = (name, event) => {
    const newReport = { ...report };
    if (name === 'patient-name') props.setName(event.target.value);
    newReport[name] = event.target.value;
    setReport(newReport);
  }

  const handleCostChange = (val, name) => {
    const newCosts = { ...costs };
    newCosts[name] = val;
    setCosts(newCosts);
  }

  const calculateCostValue = () => {
    let costsVal = 0;
    for (let name in costs) {
      switch (name) {
        case 'other':
        case 'injuries':
          costsVal+= +costs[name];
          break;
        case 'room': 
          costsVal+= !costs[name] ? 0 : 10000;
          break;
        default: 
          costsVal+= !costs[name] ? 0 : costs[name] * costsList[name].cost;
          break;
      }
    }
    return costsVal;
  }

  useEffect(() => {
    if (window.localStorage.getItem('lsms-name')) {
      const newReport = {...report};
      newReport['lsms-name'] = window.localStorage.getItem('lsms-name');
      setReport(newReport)
    }
    setHasClicked(false);
  }, [props.pageVal]);


  const generateCostsList = () => {
    const ele = [];
    for (let key in costsList) {
      ele.push(
        <div className="priceInput">
          <p className='cb'>{costsList[key].display} ({costsList[key].cost} $)</p>
          <div className="numberSelector">
            <span
              className={`actionButton ${(!costs[key] || costs[key] === 0) && 'disabled'}`}
              onClick={() => {
                if (!costs[key] || costs[key] === 0) return;
                handleCostChange(costs[key] - 1, key);
              }}
            >-</span>
            <span>{costs[key] || 0}</span>
            <span
              className='actionButton'
              onClick={() => {
                if (!costs[key]) handleCostChange(1, key);
                else handleCostChange(costs[key] + 1, key);
              }}
            >+</span>
          </div>
        </div>
      )
    }
    return ele;
  }

  const generateDetailsList = () => {
    if (!details) return;
    const detailsList = [];
    for (let name in costs) {
      switch (name) {
        case 'other':
          if (!costs[name]) break;
          detailsList.push('Autres : ' + toFormatedPrice(costs[name]) + ' $');
          break;
        case 'injuries':
          if (!costs[name]) break;
          console.log(costs[name])
          detailsList.push('Blessure ' + (costs[name] === '5000' ? 'Grave' : costs[name] === '2500' ? 'Moyenne' : 'Légére') + ' : ' + toFormatedPrice(costs[name]) + ' $');
          break;
        case 'room': 
          if (!costs[name]) break;
          detailsList.push('Chambre privée : ' + toFormatedPrice(10000) + ' $');
          break;
        default: 
          if (!costs[name]) break;
          detailsList.push(costs[name] + 'x ' + costsList[name].display + ' : ' + toFormatedPrice(costs[name] * costsList[name].cost) + ' $');
          break;
      }
    }
    return `(${detailsList.join(', ')})`;
  }

  return (
    <>
      <div className='left'>
        <TextBlock>
          - **Prénom Nom du LSMS :** {report['lsms-name']}<br />
          - **Prénom Nom ID du patient :** {report['patient-name']}<br />
          - **Date de naissance :** {report['patient-bd']}<br />
          - **Profession :** {report['patient-job'] || '//'}<br />
          - **Antécédents médicaux (les 2 derniers) :** {report['patient-before'] || '//'}<br />
          - **Récapitulatif des blessures :** {report['soins-recap']}<br />
          - **Récapitulatif de la raison de l’hospitalisation :** {report['soins-reason']}<br />
          - **Examens (DÉTAILLER LES OP) :** {report['soins-details']}<br />
          - **Coût total (en $) :** {toFormatedPrice(calculateCostValue())} $ {generateDetailsList()}
        </TextBlock>
        <div className='buttonsBar'>
          <button
            onClick={() => {
              setReport({'lsms-name': report['lsms-name']});
              setCosts({});
              props.resetName();
              detailsRef.current.innerHTML = '';
            }}
            style={{
              '--text-color': '#f55'
            }}
          >
            Réinitialiser la fiche
          </button>
          <button
            onClick={() => {
              window.localStorage.setItem('impayes-data', JSON.stringify({
                name: report['patient-name'],
                cost: calculateCostValue(),
              }));
              props.pageSetter(3) // Page des impayés
            }}
            style={{
              '--text-color': '#f62'
            }}
          >
            Rapport impayés
          </button>
          <button
            onClick={() => {
              window.localStorage.setItem('lspd-bcso-data', JSON.stringify({
                name: report['patient-name'],
                cost: calculateCostValue(),
              }));
              props.pageSetter(4) // Page des LSPD-BCSO
            }}
            style={{
              '--text-color': '#99f'
            }}
          >
            Rapport paiement LSPD-BCSO
          </button>
          <button
            onClick={() => {
              setDetails(val => !val)
            }}
          >
            {!details ? 'Activer le détail' : 'Désactiver le détail'}
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
          <div className="oneLiner">
            <div className='reportInput'>
              <label htmlFor="patient-name">Prénom, Nom et ID du patient : *</label>
              <input id="patient-name" type="text" placeholder="Ex: Foo Bar 1924" onChange={(e) => handleChange('patient-name', e)} value={report['patient-name'] || ''}/>
            </div>
            <div className='reportInput'>
              <label htmlFor="patient-bd">Date de naissance : *</label>
              <input id="patient-bd" type="text" placeholder="Ex: 23/09/2003" onChange={(e) => handleChange('patient-bd', e)} value={report['patient-bd'] || ''}/>
            </div>
            <div className='reportInput'>
              <label htmlFor="patient-job">Profession du patient :</label>
              <input id="patient-job" type="text" placeholder="Ex: Routier (Laisser vide sinon)" onChange={(e) => handleChange('patient-job', e)} value={report['patient-job'] || ''}/>
            </div>
          </div>
          <div className='oneLiner'>
            <div className='reportInput'>
              <label htmlFor="patient-before">Deux derniers antécédents :</label>
              <input id="patient-before" type="text" placeholder="Ex: Fracture du bras gauche (Laisser vide sinon)" onChange={(e) => handleChange('patient-before', e)} value={report['patient-before'] || ''}/>
            </div>
            <div className='reportInput'>
              <label htmlFor="soins-recap">Récapitulatif des blessures : *</label>
              <input id="soins-recap" type="text" placeholder="Ex: Hématome au genou droit" onChange={(e) => handleChange('soins-recap', e)} value={report['soins-recap'] || ''}/>
            </div>
            <div className='reportInput'>
              <label htmlFor="soins-reason">Raison de l'hospitalisation : *</label>
              <input id="soins-reason" type="text" placeholder="Ex: AVP" onChange={(e) => handleChange('soins-reason', e)} value={report['soins-reason'] || ''}/>
            </div>
          </div>
          <div className='reportInput'>
            <label htmlFor="soins-details">Détails des examens : *</label>
            <span contentEditable ref={detailsRef} onInput={e => {
              const newReport = {...report}
              newReport['soins-details'] = e.currentTarget.textContent;
              setReport(newReport);
            }} />
          </div>
        </div>

        <div className="priceData">
          <div className='priceInput'>
            <label htmlFor='injuries'>Blessures :</label>
            <select id="injuries" onChange={(e) => handleCostChange(e.target.value, 'injuries')} value={costs['injuries'] || '0'}>
              <option value="0" selected="selected">Aucunes</option>
              <option value="1000">Légères (1,000 $)</option>
              <option value="2500">Moyennes (2,500 $)</option>
              <option value="5000">Graves (5,000 $)</option>
            </select>
          </div>
          {generateCostsList()}
          <div className="priceInput">
            <label htmlFor='private-room' className='cb'>Chambre privée (10,000 $)</label>
            <input type='checkbox' id="private-room" checked={costs['room'] || false} onChange={(e) => handleCostChange(e.target.checked, 'room')}/>
          </div>
          <div className="priceInput">
            <label htmlFor="other-cost">Coûts autres :</label>
            <input id="other-cost" type="number" placeholder="Ex: 10000" onChange={(e) => handleCostChange(e.target.value, 'other')} value={costs['other'] || ''}/>
          </div>
        </div>
      </div>

      <div className="linksToTrello">
        <a target="_blank" href="https://trello.com/b/EOC2a8lf/dossiers-patients-a-l">Dossiers Patients de A à L</a>
        <a target="_blank" href="https://trello.com/b/i6gRwfon/dossiers-patients-m-z">Dossiers Patients de M à Z</a>
      </div>
    </>
  )
}