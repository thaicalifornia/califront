import React,{Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import MainRouter from './MainRouter';
import './App.css';

class App extends Component {
  render(){
      return (
        <div className="App">
          <BrowserRouter>
            <MainRouter  />
          </BrowserRouter>
        </div>
      );
    }
  }

export default App;
