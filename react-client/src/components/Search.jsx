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
			favorites: [
  [
    { distance: '0.4 mi',
      travel_time: '4 mins',
      type: 'bank',
      place_lat: 40.7501328,
      place_long: -73.97649899999999,
      category_icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/bank_dollar-71.png',
      google_id: 'ChIJY9UK5gNZwokR60pPEpS1WKE',
      place_name: 'Chase Bank',
      rating: 3,
      place_address: '355 Lexington Ave, New York',
      thumbnail: '<a href="https://maps.google.com/maps/contrib/100338243655446815049/photos">Chase Bank</a>',
      price_level: '' },
    { distance: '0.5 mi',
      travel_time: '5 mins',
      type: 'bank',
      place_lat: 40.749611,
      place_long: -73.974712,
      category_icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/bank_dollar-71.png',
      google_id: 'ChIJt5cK5gNZwokR4S9PcCtCTcQ',
      place_name: 'Chase Bank',
      rating: 4.5,
      place_address: '633 3rd Ave, New York',
      thumbnail: '<a href="https://maps.google.com/maps/contrib/107222874427432551066/photos">Christopher N Flores</a>',
      price_level: '' }
  ],
  [
    { distance: '0.3 mi',
      travel_time: '3 mins',
      type: 'supermarket',
      place_lat: 40.7522358,
      place_long: -73.9756911,
      category_icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
      google_id: 'ChIJnaciOAJZwokR2eQCKWId9B8',
      place_name: 'Eli Zabar\'s',
      rating: 1,
      place_address: '89 East 42nd Street, New York',
      thumbnail: '<a href="https://maps.google.com/maps/contrib/101941738990436117323/photos">Gregory Weiss</a>',
      price_level: '' },
    { distance: '0.7 mi',
      travel_time: '6 mins',
      type: 'supermarket',
      place_lat: 40.74663890000001,
      place_long: -73.977746,
      category_icon: 'https://maps.gstatic.com/mapfiles/place_api/icons/shopping-71.png',
      google_id: 'ChIJw7VKFwRZwokRVJgwZnK-eEY',
      place_name: 'D\'Agostino',
      rating: 3.2,
      place_address: '528 3rd Avenue, New York',
      thumbnail: '<a href="https://maps.google.com/maps/contrib/114435253726526221846/photos">Dijon Davantes</a>',
      price_level: '' }
  ]
],
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
			savedPrefs: this.props.location.savedPrefs ? this.props.location.savedPrefs.userData : undefined
		}
		console.log('new prefs are', params.newPrefs)
		console.log('savedprefs are', params.savedPrefs)

		axios.post('/places', {params: params})
		.then(({data}) => {
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
			.then((resp) => {
					
				/*let fav = JSON.parse(resp.config.data)
				let newfaveState = this.state.favorites.slice();
				newfaveState.push(fav.params)

				this.setState({
					favorites: newfaveState
				});*/
		})
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