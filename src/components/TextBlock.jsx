import { useState } from 'react';

import {ReactComponent as Copy} from '../assets/copy.svg';

import '../styles/TextBlock.css';

export default function TextBlock(props) {

  const [showTip, setShowTip] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(childrenToString(props.children))
    setShowTip(true);
    setTimeout(() => setShowTip(false), 1000);
  }

  const childrenToString = (children) => {
    let text = '';
    for (let element of children) {
      if (!element) continue;
      if (element.type && element.type === 'br') {
        text+= '\n';
      } else {
        text+= element;
      }
    }
    return text;
  }

  return (
    <div className="textBlock">
      <div
        className={`copy ${!window.isSecureContext && 'hidden'} ${showTip && 'showTip'}`}
        onClick={handleCopy}
      >
        <Copy />
      </div>
      {props.children}
    </div>
  )
}