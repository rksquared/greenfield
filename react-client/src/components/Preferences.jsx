import React from 'react';
import axios from 'axios';
import {withRouter} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import FontIcon from 'material-ui/FontIcon';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import SearchIcon from 'material-ui/svg-icons/action/search';
import MaterialButton from './MaterialButton.jsx';


import {cyan500, grey300, teal500, teal900, grey700} from 'material-ui/styles/colors';


const styles = {
	hintStyle: {color: grey700},
	underlineStyle: {borderColor: grey300}
};

const IconButtonExampleTouch = () => (
  <div style={{display:"flex", flex: 1, justifyContent: "center", alignItems: "center"}}>
    <IconButton tooltip="Favorite Destinations" touch={true} tooltipPosition="bottom-right" >
      <ActionGrade color={teal900} hoverColor={grey300}/>
    </IconButton>
  </div>
);


class Preferences extends React.Component{
	constructor(props){
		super(props)
		//this.props.location.username is the username
		this.state = {
        bank: '',
        supermarket: '',
        meal_takeaway: '',
        cafe: 'Starbucks',
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
		console.log('target is', target.type)
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
		let { bank, supermarket, meal_takeaway, cafe, gym,
			liquor_store, convenience_store, laundry, hair_care, transit_station } = this.state;
		return (
			<div>
				<AppBar style={{ backgroundColor: `white` }} title="TravelHero Tailored Search" titleStyle={{ color: teal900 }} iconElementLeft={IconButtonExampleTouch()}>
					<img src={require('../assets/logo_inline.svg')} alt="My logo" />
				</AppBar>


				<div style={{ backgroundColor: teal500, minHeight: `100vh`, display: "flex", flex: 1, justifyContent: "center", alignItems: "center" }}>

					<Paper style={{
						height: `45rem`,
						width: `22rem`,
						margin: 20,
						paddingTop: `5rem`,
						textAlign: 'center',
						justifyContent: "center",
						alignItems: "center"
					}} zDepth={4}>

						<div>Preferred Bank</div>
						<TextField name="bank"
							type="text"
							hintText={bank}
							onChange={this.handlePreferenceState}
							hintStyle={styles.hintStyle}
							inputStyle={{ color: `black` }}
							underlineStyle={styles.underlineStyle}
						/>
						<div>Favorite Supermarket</div>
						<TextField type="text"
							name="supermarket"
							hintText={supermarket}
							onChange={this.handlePreferenceState}
							hintStyle={styles.hintStyle}
							inputStyle={{ color: `black` }}
							underlineStyle={styles.underlineStyle}
						/>
						<div>Favorite Takeout</div>
						<TextField name="meal_takeaway"
							type="text"
							hintText={meal_takeaway}
							onChange={this.handlePreferenceState}
							hintStyle={styles.hintStyle}
							inputStyle={{ color: `black` }}
							underlineStyle={styles.underlineStyle}
						/>
						<div>Favorite Coffeeshop</div>
						<TextField name="cafe"
							type="text"
							value={cafe}
							onChange={this.handlePreferenceState}
							hintStyle={styles.hintStyle}
							inputStyle={{ color: `black` }}
							underlineStyle={styles.underlineStyle}
						/>
						<div>Gym Membership</div>
						<TextField type="text"
							name="gym"
							value={gym}
							onChange={this.handlePreferenceState}
							hintStyle={styles.hintStyle}
							inputStyle={{ color: `black` }}
							underlineStyle={styles.underlineStyle}
						/>
						<div>Liquor Store</div>
						<Checkbox type="checkbox"
							name="liquor_store"
							value={liquor_store}
							onCheck={this.handlePreferenceState} />
						<div>Convenience Store or Pharmacy</div>
						<Checkbox type="checkbox"
							name="convenience_store"
							value={convenience_store}
							onCheck={this.handlePreferenceState} />
						<div>Laundromat</div>
						<Checkbox type="checkbox"
							name="laundry"
							value={laundry}
							onCheck={this.handlePreferenceState} />
						<div>Haircare</div>
						<Checkbox type="checkbox"
							name="hair_care"
							value={hair_care}
							onCheck={this.handlePreferenceState} />
						<div>Transit Options</div>
						<Checkbox type="checkbox"
							name="transit_station"
							value={transit_station}
							onCheck={this.handlePreferenceState} />

						<RaisedButton primary={true} onClick={() => { this.sendPreferencesToServer() }}>Submit</RaisedButton>
					</Paper>
				</div>


				<br></br>

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