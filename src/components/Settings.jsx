
import { useEffect, useState } from 'react';
import '../styles/Soins.css';
import '../styles/Settings.css';

export default function Settings(props) {

  const [lsmsName, setLsmsName] = useState(window.localStorage.getItem('lsms-name'));
  const [lsmsId, setLsmsId] = useState(window.localStorage.getItem('lsms-id'));
  const [hasClickedName, setHasClickedName] = useState(false);
  const [hasClickedId, setHasClickedId] = useState(false);

  useEffect(() => {
    setTimeout(() => setHasClickedName(false), 2000);
  }, [hasClickedName])
  useEffect(() => {
    setTimeout(() => setHasClickedId(false), 2000);
  }, [hasClickedId])

  return (
    <div className="soinsDataContainer"
    style={{alignItems: 'flex-start'}}>
      <div className='oneLiner'>
        <div className='reportInput'>
          <label htmlFor="lsms-name">Votre Prénom et Nom :</label>
          <input
            id="lsms-name"
            type="text"
            placeholder="Ex: John Doe"
            onChange={(e) => setLsmsName(e.target.value)}
            defaultValue={
              window.localStorage.getItem('lsms-name') || ''
            }
          />
        </div>
        <p className='save'
          onClick={() => {
            window.localStorage.setItem('lsms-name', lsmsName);
            setHasClickedName(true);
          }}
        >{hasClickedName ? 'Enregistré !' : 'Enregistrer pour plus tard'}</p>
      </div>
      <div className='oneLiner'>
        <div className='reportInput'>
          <label htmlFor="lsms-id">Votre ID :</label>
          <input
            id="lsms-id"
            type="text"
            placeholder="Ex: John Doe"
            onChange={(e) => setLsmsId(e.target.value)}
            defaultValue={
              window.localStorage.getItem('lsms-id') || ''
            }
          />
        </div>
        <p className='save'
          onClick={() => {
            window.localStorage.setItem('lsms-id', lsmsId);
            setHasClickedId(true);
          }}
        >{hasClickedId ? 'Enregistré !' : 'Enregistrer pour plus tard'}</p>
      </div>
      <div className='oneLiner'>
        <div className='reportInput'>
          <label htmlFor="lsms-force-id">Afficher votre ID lorsque ce n'est pas necéssaire :</label>
          <input
            id="lsms-force-id"
            type="checkbox"
            onChange={(e) => window.localStorage.setItem('lsms-force-id', e.target.checked)}
            defaultChecked={
              window.localStorage.getItem('lsms-force-id') || false
            }
          />
        </div>
      </div>
      <div className='copyright'>Made with ❤️ by <a href="https://github.com/Scoffgard/lsms-help" target="_blank">Scoffgard</a> (AKA: Antoine Cumsi)</div>
    </div>
  )
}