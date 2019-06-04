import React from 'react'
import axios from 'axios'
//import {Link} from 'react-router-dom'
import Auth from '../lib/Auth'
import ShowMap from './ShowMap'
import LocationForm from './LocationForm'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'

class TripShow extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      center: [-0.07, 51.515],
      zoom: 10,
      data: {
        // trip: this.props.match.params.id
      },
      trip: {
        locations: []
      },
      errors: {},
      polylineCoords: [],
      newLocation: true
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.removeLocation = this.removeLocation.bind(this)

  }

  removeLocation(location) {
    axios.delete(`/api/trips/${this.props.match.params.id}/locations/${location.id}`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => this.setState({
        trip: res.data,
        newLocation: true,
        polylineCoords: []
      }))
      .catch((err) => this.setState({errors: err.response.data.error}))
  }



  handleChange(e) {
    const data =  {...this.state.data, [e.target.name]: e.target.value }
    this.setState({ data })
  }

  handleSubmit(e) {
    e.preventDefault()
    e.target.reset()

    axios.post(`/api/trips/${this.props.match.params.id}/locations`, this.state.data, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(res => this.setState({ trip: res.data, newLocation: true }))
      .catch((err) => this.setState({errors: err.response.data.error}))

  }

  componentDidMount() {
    axios.get(`/api/trips/${this.props.match.params.id}`)
      .then(res => this.setState({ trip: res.data }))
  }

  componentDidUpdate() {

  }

  render() {
    return (
      <div>
        <ShowMap
          locations={this.state.trip.locations}
          center={this.state.center}
          zoom={this.state.zoom}
          removeLocation={this.removeLocation}
          getDirections={this.getDirections}
          newLocation={this.state.newLocation}
        />
        <LocationForm
          passedChange={this.handleChange}
          passedSubmit={this.handleSubmit}
        />
      </div>
    )
  }
}

export default TripShow
