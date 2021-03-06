import React from 'react'
import mapboxgl from 'mapbox-gl'
import * as turf from '@turf/turf'
import axios from 'axios'

mapboxgl.accessToken = process.env.MAPBOX_TOKEN

class ShowMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      distance: 0
    }

    this.markers = []
    this.bounds = new mapboxgl.LngLatBounds()
    this.animate = this.animate.bind(this)
  }

  componentDidMount() {
    this.createMap()
    this.markCurrLoc()
    this.flyToView(this.currentLocation, 12)
  }

  createMap() {
    this.map = new mapboxgl.Map({
      container: this.mapCanvas,
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: this.props.zoom,
      center: this.props.center
    })
  }

  markCurrLoc() {
    const markerElement = document.createElement('div')
    markerElement.className = 'current-marker'
    markerElement.innerText = '🏠'

    navigator.geolocation.getCurrentPosition(pos => {
      this.currentLocation = new mapboxgl.Marker(markerElement)
        .setLngLat([pos.coords.longitude,pos.coords.latitude])
        .addTo(this.map)
    })
  }

  flyToView(center, zoom) {
    this.map.flyTo({
      center: center,
      zoom: zoom
    })
  }

  updateMapView(location) {
    this.bounds.extend([location.longitude, location.latitude])
    this.flyToView(this.bounds.getCenter(), 12)
  }

  generatePopup(location) {
    const popupEl = document.createElement('DIV')
    const locationName = document.createElement('DIV')
    const button = document.createElement('BUTTON')

    locationName.classList.add('popup-location')
    locationName.innerText = location.name
    button.innerText = 'Remove Location'
    button.onclick = () => this.props.removeLocation(location)

    popupEl.appendChild(locationName)
    popupEl.appendChild(button)

    return new mapboxgl.Popup({offset: 25})
      .setDOMContent(popupEl)
      .addTo(this.map)
  }

  //generate marker for a new location added to the trip
  generateMarker(location) {
    const popup = this.generatePopup(location)

    const marker = new mapboxgl.Marker()
      .setLngLat([location.longitude, location.latitude])
      .setPopup(popup)
      .addTo(this.map)

    this.updateMapView(location)
    return marker
  }

  removeRoute() {
    const mapRouteLayer = this.map.getLayer('route')
    const mapPointLayer = this.map.getLayer('point')

    if(mapRouteLayer) {
      this.map.removeLayer('route').removeSource('route')
    }

    if(mapPointLayer) {
      this.map.removeLayer('point').removeSource('point')
    }
  }

  generatePolyline(polylineCoords) {
    this.route = {
      'id': 'route',
      'type': 'line',
      'source': {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': polylineCoords
          }
        }
      },
      'layout': {
        'line-join': 'round',
        'line-cap': 'round'
      },
      'paint': {
        'line-color': '#888',
        'line-width': 8
      }
    }

    this.map.addLayer(this.route)
    this.generatePoint(polylineCoords)
  }

  generatePoint(polylineCoords) {
    this.pointData = {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'Point',
        'coordinates': polylineCoords[0]
      }}

    this.point = {
      'id': 'point',
      'type': 'symbol',
      'source': 'point',
      'layout': {
        'icon-image': 'airport-15',
        'icon-rotate': ['get', 'bearing'],
        'icon-rotation-alignment': 'map',
        'icon-allow-overlap': true,
        'icon-ignore-placement': true
      }
    }

    this.map.addSource('point', {
      'type': 'geojson',
      'data': this.pointData
    })

    this.map.addLayer(this.point)
    this.animatePrep(polylineCoords)
  }

  animatePrep(polylineCoords) {
    const lineString = turf.lineString(polylineCoords)
    const lineDistance = turf.length(lineString, {units: 'kilometers'})
    this.setState({ distance: lineDistance.toFixed(2) })

    this.path = []
    //set the frame rate to 100 steps per kilometer
    this.steps = Math.ceil(lineDistance * 100)
    this.counter = 0

    for (var i = 0; i < lineDistance; i += lineDistance/this.steps) {
      var segment = turf.along(lineString, i, {units: 'kilometers'})
      this.path.push(segment.geometry.coordinates)
    }

    this.animate()
  }

  animate() {
    this.pointData.geometry.coordinates = this.path[this.counter]

    this.pointData.properties.bearing = turf.bearing(
      turf.point(this.path[this.counter >= this.steps ? this.counter - 1 : this.counter]),
      turf.point(this.path[this.counter >= this.steps ? this.counter : this.counter + 1])
    )

    if(this.map.getSource('point')) this.map.getSource('point').setData(this.pointData)

    if (this.counter < this.steps) {
      requestAnimationFrame(this.animate)
    }

    this.counter = this.counter + 1

    if(this.counter === this.steps - 1) {
      this.counter = 0
    }
  }

  createURLstr() {
    const locations = this.props.locations
      .sort((a, b) => a.id - b.id)
      .map(location => `${location.longitude},${location.latitude}`)
      .join(';')

    this.getDirections(locations)
  }

  getDirections(coordinates) {
    axios.get(`https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}.json`, {
      params: {
        access_token: process.env.MAPBOX_TOKEN,
        geometries: 'geojson'
      }
    })
      .then(res => {
        this.generatePolyline(res.data.routes[0].geometry.coordinates)
      })
      .catch((err) => this.setState({errors: err}))
  }

  componentDidUpdate(prevProps) {
    if(prevProps.locations.length === this.props.locations.length) return false
    //reset the markers
    this.markers.forEach(marker => marker.remove())
    this.markers = this.props.locations.map(location => this.generateMarker(location))

    //trigger the sequence for getting the polyline data if there is > one location
    this.createURLstr()
    this.removeRoute()
  }

  render() {
    return (
      <div>
        <div ref={el => this.mapCanvas = el} className="map" />
        <div className="map-form-info map-extra">
          <p>Total Distance: {this.state.distance} km</p>
          <p>Number of Stops: {this.props.locations.length}</p>
        </div>
      </div>
    )
  }
}

export default ShowMap
