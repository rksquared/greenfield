import React from 'react';
import axios from 'axios';

class Search extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			address: '',
			results: []
		}
		this.fetchClosestPlaces = this.fetchClosestPlaces.bind(this)
		this.handleAddressState = this.handleAddressState.bind(this)
	}

	fetchClosestPlaces(){
		let addressObj = {address: this.state.address}

		axios.post('/googleApi', addressObj)
		.then((response) => {
			console.log('places fetched')
			// will need to update result state with data
		})
		.catch((err) => console.log('error in fetching places'))
	}

	handleAddressState(event) {
		this.setState({
			address: event.target.value
		}, console.log(this.state.address))
	}

	render(){
		return (
			<div>
				<h4>Search Component</h4>
				<input type="text"
							 value={this.state.address}
							 onChange={this.handleAddressState}/>
				<button onClick={() => {this.fetchClosestPlaces()}}>Search</button>	 
				
				<div>
				</div>

			</div>
		)
	}
}
export default Search;