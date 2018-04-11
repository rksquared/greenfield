import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Switch, History} from "react-router-dom";

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
          <Router>
          <Switch>
              <Login exact path="/" component={Login}/>
              <Preferences  path="/preferences" component={Preferences}/>
              <Search path="/search" component={Search}/>
          </Switch>
          </Router> 
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