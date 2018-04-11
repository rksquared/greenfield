import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";


import Login from './components/Login.jsx';
import Search from './components/Search.jsx';
import Preferences from './components/Preferences.jsx';
import Favorites from './components/Favorites.jsx';

class App extends React.Component {

  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
      <h4>App Component</h4>
        <ul>
          <li>
            <Login />
            <Preferences />
            <Search />
          </li>
        </ul>
      </div>
      )
   }
}


ReactDOM.render(<App/>, document.getElementById('app'));

 /* <Router>
          <div>
          <ul>
              <li>
                <Link to='/'>LOGIN</Link>
              </li>

          </ul>

            <h1>App Component w/ Routes</h1>
            <Route path="/" component{Login}/>
            <Route path="/search" component{Search} />
            <Route path="/favorites" component{Favorites} />
            <Route path="/preferences" component{Preferences} />
          </div>
      </Router> 

    ReactDOM.render(
       <BrowserRouter>
       <App/> 
       </BrowserRouter>
       ,
     document.getElementById('app'));


 */