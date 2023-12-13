import '../styles/Header.css';

export default function Header(props) {

  const generateMenuEntries = () => {
    const ele = [];
    for (let [index, entry] of props.entries.entries()) {
      ele.push(<div 
        className={`entry ${props.page === index && 'selected'}`}
        onClick={() => props.setPage(index)}
      >
        {entry}
      </div>)
    }
    return ele;
  }

  return (
    <header className="main">
      {generateMenuEntries()}
    </header>
  )
}