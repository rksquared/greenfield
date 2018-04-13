import React from 'react';
import axios from 'axios';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
// import MaterialButton from './MaterialButton';

class Search extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			address: '',
			results: [],
			favorites: [],
			swapFaves: false
		}
		//this.props.location.prefs is the prefs object
		this.fetchClosestPlaces = this.fetchClosestPlaces.bind(this)
		this.handleAddressState = this.handleAddressState.bind(this)
		this.saveFavorite = this.saveFavorite.bind(this)
		this.swapSeachtoFavorites = this.swapSeachtoFavorites.bind(this)
	}

	fetchClosestPlaces(){
		let params = {
			address: this.state.address,
			newPrefs: this.props.location.prefs,
			savedPrefs: this.props.location.savedPrefs
		}
		console.log('new prefs are', params.newPrefs)
		console.log('savedprefs are', params.savedPrefs)

		axios.post('/places', {params: params})
		.then(({data}) => {
			console.log('places fetched')
			console.log('whats the response', data)
			// will need to update result state with data
			this.setState({
				results: [data]
			});
			
		})
		.catch((err) => console.log('error in fetching places'))
	}

	handleAddressState(event) {
		this.setState({
			address: event.target.value
		}, console.log(this.state.address))
	}

	saveFavorite(place) {
		const params = {
			place: place,
			address: this.state.address,
			username: this.props.location.username,
			create_time: new Date()
		};
		axios.post('/save', {params: params})
			.then((resp) => console.log('resp after saving is', resp))
			.catch((err) => console.log('err trying to save fave is', err))
	}

	swapSeachtoFavorites(){
		this.setState({
			swapFaves: !this.state.swapFaves
		})
	}

	render(){
		return (
			<div>
				<AppBar title="TravelHero"> </AppBar>
				{
					this.state.swapFaves ? this.state.favorites.map((result) => {
					return (
						result.map((place) => {
							return <Card>
								<CardHeader
									title={place.place_name}
									avatar={place.category_icon}
									subtitle={place.type}
									actAsExpander={true}
									showExpandableButton={true}
								/>
								<CardText expandable={true}>
								{place.place_address}<br></br>
								{place.distance}<br></br>
								{place.travel_time} <br></br>
								</CardText>
							<CardActions>
								<FlatButton onClick={() => {this.saveFavorite(place)}}>Save</FlatButton>
							</CardActions>
							</Card>
					})
				)
				}) : 
				
				this.state.results.map((result) => {
					return (
						result.map((place) => {
							return <Card>
								<CardHeader
									title={place.place_name}
									avatar={place.category_icon}
									subtitle={place.type}
									actAsExpander={true}
									showExpandableButton={true}
								/>
								<CardText expandable={true}>
								{place.place_address}<br></br>
								{place.distance}<br></br>
								{place.travel_time} <br></br>
								</CardText>
							<CardActions>
								<FlatButton onClick={() => {this.saveFavorite(place)}}>Save</FlatButton>
							</CardActions>
							</Card>
					})
				)
				})
			}
				<TextField 
							 hintText="Enter your destination"
							 type="text"
							 value={this.state.address}
							 onChange={this.handleAddressState}/>
				<RaisedButton onClick={() => {this.fetchClosestPlaces()}}>Search</RaisedButton>	 
				<RaisedButton onClick={() => {this.swapSeachtoFavorites()}}>{this.state.swapFaves ? "Searches" : "Save"}</RaisedButton>
			</div>
		)
	}
}
export default Search;