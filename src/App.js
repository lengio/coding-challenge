import logo from './logo.svg';
import './App.css';
import Data from './Components/Data.js';

function App() {
  return (
    <div className="App">
      <Data/>
      <header className="App-header">
      <p>
          CODING CHALLENGE
          <br/>
          MADE BY RANDY ROJAS 
        </p>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Review web console to see the data results
        </p>
      </header>
    </div>
  );
}

export default App;
