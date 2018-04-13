import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import MaterialButton from './MaterialButton.jsx';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

class Login extends React.Component{

  constructor(props) {
  	super(props)
  	this.state = { username: '' } //move preferences to this statue
  	this.sendUsernameToServer = this.sendUsernameToServer.bind(this)
		this.handleUsernameState = this.handleUsernameState.bind(this)
		this.goToSignup = this.goToSignup.bind(this)
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
	
	goToSignup() {
		console.log('trying to go to signup')
		this.props.history.push({pathname: '/signup'})
	}

  render() { 
    console.log(this.props.history)
  	return (
	<div>
		<Paper style={{
			height: 120,
			width: 1000,
			margin: 20,
			textAlign: 'center',
			display: 'block'
		}} zDepth={2}>
		<div>
	    <h4>Please login to TravelHero</h4>
		{'Username:    '}  
			<TextField
				type="text"
				name="username"
				value={this.state.username} 
				onChange={this.handleUsernameState}
			/>
		{'Password:    '}
			<TextField
				type="text"
				name="password"
			/>
			<RaisedButton onClick={()=> {this.sendUsernameToServer()}}>LOGIN</RaisedButton>
			<RaisedButton onClick={this.goToSignup}>SIGNUP</RaisedButton>
	</div>
	</Paper>
	</div>
  		)
  	}
}

export default withRouter(Login);