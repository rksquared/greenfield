import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Login extends React.Component{

  constructor(props) {
  	super(props)
  	this.state = { username: '' } //move preferences to this statue
  	this.sendUsernameToServer = this.sendUsernameToServer.bind(this)
  	this.handleUsernameState = this.handleUsernameState.bind(this)
  }

  // sending name to database
  sendUsernameToServer(){
    console.log('function reached')
  	let userObj = {user: this.state.username}
		axios.post('/login', userObj)
  	.then((response) => {
			console.log('username sent!')
			console.log('test prefs are', response.data);
			if (response.data.length === 0) {
				this.props.history.push({
					pathname: '/preferences',
					username: this.state.username
				});
			} else {
				this.props.history.push({
					pathname: '/search',
					savedPrefs: response.data,
					username: this.state.username
				}); //send with response.data (prefs) as props
			}
      
    })
  	.catch((err) => {
			console.log('error logging in')
			this.props.history.push('/search') // change to signup
		})
  }

  // handle change state for username
  handleUsernameState(event){
  	event.preventDefault()
  	this.setState({
  		username: event.target.value
  	}, () => console.log(this.state.username))
  }

  render() { 
    console.log(this.props.history)
  	return (
	<div>
	    <h4>Login Component</h4>
		Username
			<input 	
          type="text"
					value={this.state.username} 
					onChange={this.handleUsernameState}/>
		Password
			<input 	type="text"/>
			<button onClick={()=> {this.sendUsernameToServer()}}>LOGIN</button>
			<button>SIGNUP</button>
      <button onClick={() => {this.props.history.push('/preferences')}}>Change Router</button>
	</div>
  		)
  	}
}

export default withRouter(Login);