import React from 'react';
import axios from 'axios';

class Search extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			address: '',
			results: []
		}
		//this.props.location.prefs is the prefs object
		this.fetchClosestPlaces = this.fetchClosestPlaces.bind(this)
		this.handleAddressState = this.handleAddressState.bind(this)
		this.saveFavorite = this.saveFavorite.bind(this)
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
		.then((response) => {
			console.log('places fetched')
			console.log(response.data)
			// will need to update result state with data
			this.setState({results: response.data})
			
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
			username: this.props.location.username
		};
		axios.post('/save', {params: params})
			.then((resp) => console.log('resp after saving is', resp))
			.catch((err) => console.log('err trying to save fave is', err))
	}

	render(){
		return (
			<div>
				<h4>Search Component</h4>
				<pre>{JSON.stringify(this.state.results)}</pre>
				{this.state.results.map(result => {
					return (
						result.map(place => {
							return <div><li>
							<ul>{place.type}</ul>
							<ul><img src={place.category_icon}></img></ul>
							<ul>{place.place_name}</ul>
							<ul>{place.place_address}</ul>
							<ul>{place.distance} away</ul>
							<ul>{place.travel_time} away</ul>
							</li>
							<button onClick={() => {this.saveFavorite(place)}}>Save</button>
							</div>
					})
				)
				})}
				<input type="text"
							 value={this.state.address}
							 onChange={this.handleAddressState}/>
				<button onClick={() => {this.fetchClosestPlaces()}}>Search</button>	 
				
				<div>
				</div>
				<li>

				</li>
					}
			</div>
		)
	}
}
export default Search;