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
        meal_takeaway: '',
        cafe: '',
        gym: '',
        liquor_store: false,
        convenience_store: false,
        laundry: false,
        hair_care: false,
        transit_station: false   
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
		let {bank, supermarket, meal_takeaway, cafe, gym, 
			   liquor_store, convenience_store, laundry, hair_care, transit_station} = this.state;
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
				<div>Favorite Takeout</div>
		    <input name="meal_takeaway" 
		    			 type="text" 
		    			 value={meal_takeaway}
		    			 onChange={this.handlePreferenceState}/>
				<div>Favorite Coffeeshop</div>
				<input name="cafe"
							 type="text"  
				       value={cafe}
				       onChange={this.handlePreferenceState}/>
			  <div>Gym Membership</div>
				<input type="text" 
				       name="gym" 
				       value={gym}
				       onChange={this.handlePreferenceState}/>
			  <div>Liquor Store</div>
				<input type="checkbox" 
				       name="liquor_store" 
				       value={liquor_store}
				       onChange={this.handlePreferenceState}/>
			  <div>Convenience Store or Pharmacy</div>
				<input type="checkbox" 
				       name="convenience_store" 
				       value={convenience_store}
				       onChange={this.handlePreferenceState}/>
				<div>Laundromat</div>
				<input type="checkbox" 
				       name="laundry" 
				       value={laundry}
				       onChange={this.handlePreferenceState}/>
				<div>Haircare</div>
				<input type="checkbox" 
				       name="hair_care" 
				       value={hair_care}
				       onChange={this.handlePreferenceState}/>
				<div>Transit Options</div>
				<input type="checkbox" 
				       name="transit_station" 
				       value={transit_station}
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