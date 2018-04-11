import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Preferences extends React.Component{
	constructor(props){
		super(props)
		//this.props.location.username is the username
		this.state = {
        bank: '',
        supermarket: '',
        eatery: '',
        coffeeshop: '',
        gym: '',
        liquor: false,
        drycleaner: false,
        conven_store: false,
        laund: false,
        haircare: false,
        transit: false   
		}
    this.handlePreferenceState = this.handlePreferenceState.bind(this)
    this.sendPreferencesToServer = this.sendPreferencesToServer.bind(this)
	}

	handlePreferenceState(event) {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value
		const name = target.name;
		this.setState({
			[name]: value
		}, () => console.log(this.state))
	}

	sendPreferencesToServer() {
		let userPrefs = {
			preferences: this.state,
			username: this.props.location.username
		}
		axios.post('/preferences', {params: userPrefs})
		.then((response) => {
			console.log('preferences sent!')
			this.props.history.push({
				pathname: '/search',
				prefs: this.state,
				username: this.props.location.username
			});
		})
		.catch((err) => console.log('err saving prefs', err))
	}

	render() {
		let {bank, supermarket, eatery, coffeeshop, gym, 
			   liquor, drycleaner, conven_store, laund, haircare, transit} = this.state;
		return (
			<div> 
			<h4>Preferences Component</h4>
			Search Preferences
			<pre>{JSON.stringify(this.props.history)}</pre>
				<div>Preferred Bank</div>
				<input name="bank" 
							 type="text" 	 
							 value={bank}
							 onChange={this.handlePreferenceState}/>
				<div>Favorite Supermarket</div>
			  <input type="text" 
			         name="supermarket" 
			         value={supermarket}
			         onChange={this.handlePreferenceState}/>
				<div>Favorite Eateries</div>
		    <input name="eatery" 
		    			 type="text" 
		    			 value={eatery}
		    			 onChange={this.handlePreferenceState}/>
				<div>Favorite Coffee Shop</div>
				<input name="coffeeshop"
							 type="text"  
				       value={coffeeshop}
				       onChange={this.handlePreferenceState}/>
			  <div>Gym Membership</div>
				<input type="text" 
				       name="gym" 
				       value={gym}
				       onChange={this.handlePreferenceState}/>
			  <div>Liquor Store</div>
				<input type="checkbox" 
				       name="liquor" 
				       value={liquor}
				       onChange={this.handlePreferenceState}/>
			  <div>Dry Cleaner</div>
				<input type="checkbox" 
				       name="drycleaner" 
				       value={drycleaner}
				       onChange={this.handlePreferenceState}/>
			  <div>Convenience Store</div>
				<input type="checkbox" 
				       name="conven_store" 
				       value={conven_store}
				       onChange={this.handlePreferenceState}/>
				<div>Laundromat</div>
				<input type="checkbox" 
				       name="laund" 
				       value={laund}
				       onChange={this.handlePreferenceState}/>
				<div>Haircare</div>
				<input type="checkbox" 
				       name="haircare" 
				       value={haircare}
				       onChange={this.handlePreferenceState}/>
				<div>Transit Options</div>
				<input type="checkbox" 
				       name="transit" 
				       value={transit}
				       onChange={this.handlePreferenceState}/>

			<button onClick={() => {this.sendPreferencesToServer()}}>Submit</button>
			</div>
		)
	}
}

export default withRouter(Preferences);

// App
	//Login
	// Preferences
	 // child of preferences
	// other components