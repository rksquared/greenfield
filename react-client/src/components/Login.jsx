import React from 'react';
import axios from 'axios';

class Login extends React.Component{

  constructor(props) {
  	super(props)
  	this.state = { username: '' }
  	this.sendUsernameToServer = this.sendUsernameToServer.bind(this)
  	this.handleUsernameState = this.handleUsernameState.bind(this)
  }

  // sending name to database
  sendUsernameToServer(){
  	let userObj = {user: this.state.username}
	axios.post('/login', userObj)
  	.then((response) => console.log('username sent!'))
  	.catch((err) => console.log(''))
  }

  // handle change state for username
  handleUsernameState(event){
  	event.preventDefault()
  	this.setState({
  		username: event.target.value
  	}, () => console.log(this.state.username))
  }

  render() { 
  	return (
	<div>
	    <h4>Login Component</h4>
		Username
			<input 	type="text"
					value={this.state.username} 
					onChange={this.handleUsernameState}/>
		Password
			<input 	type="text"/>
			<button onClick={()=> {this.sendUsernameToServer()}}>LOGIN</button>
			<button>SIGNUP</button>
	</div>
  		)
  	}
}

export default Login;