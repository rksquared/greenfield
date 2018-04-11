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
	}

	fetchClosestPlaces(){
		let params = {
			address: this.state.address,
			prefs: this.props.location.prefs
		}

		axios.post('/places', {params: params})
		.then((response) => {
			console.log('places fetched')
			console.log(response.data)
			// will need to update result state with data
			this.setState({results: response})
			
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
				<pre>{JSON.stringify(this.props.location.prefs)}</pre>
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