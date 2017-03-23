import React, { Component } from 'react';
import ReactMap, { Layer, Feature } from 'react-mapbox-gl';

const accessToken = "pk.eyJ1IjoiYWxleDMxNjUiLCJhIjoiY2l4b3V0Z3RpMDAxczJ4cWk2YnEzNTVzYSJ9.MFPmOyHy8DM5_CVaqPYhOg";
const streetsStyle = "mapbox://styles/mapbox/streets-v9";
const basicStyle = "mapbox://styles/mapbox/basic-v9"
const darkStyle = "mapbox://styles/mapbox/dark-v9"

const MAP_STYLES = {
  street: streetsStyle,
  basic: basicStyle,
  dark: darkStyle
};

const STYLES = {
  app: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
  },
  button: {
    position: 'absolute',
    top: 16,
    left: 16,
    WebkitAppearance: 'none',
    padding: 8,
    fontWeight: 'bold',
    fontSize: 18,
    border: '1px solid',
    boxShadow: '2px 2px 1px',
    backgroundColor: 'bisque',
    outlineColor: 'bisque'
  },
  indicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    fontWeight: 'bold',
    fontSize: 18,
    border: '1px solid',
    boxShadow: '2px 2px 1px',
    backgroundColor: 'chartreuse'
  },
  container: {
    position: 'relative',
    height: '100vh',
    width: '100vw'
  }
}

const POSITION_CIRCLE_PAINT = {
    'circle-stroke-width': 2,
    'circle-radius': 10, //pixels
    'circle-blur': 0.15,
    'circle-color': '#0066EE',
    'circle-stroke-color': '#FFFFFF'
};
const DEFAULT_USER_POSITION = [-0.2416815, 51.5285582];

class App extends Component {
  state = {
    styleIndex: 0,
    userPosition: DEFAULT_USER_POSITION
  }

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(geo => {
      let {latitude, longitude} = geo.coords;
      this.setState({
        userPosition: [longitude, latitude]
      });
    }, err => {
      console.error('Cannot retrieve your current position', err);
    })
  }

  nextStyle = () => {
    let nextStyleIndex = this.state.styleIndex + 1;
    this.setState({
      styleIndex: nextStyleIndex >= Object.keys(MAP_STYLES).length ? 0 : nextStyleIndex
    });
  }

  getStyle = () => {
    return MAP_STYLES[this.getStyleKey()];
  }
  getStyleKey = () => {
    return Object.keys(MAP_STYLES)[this.state.styleIndex];
  }

  render() {
    return (
      <div style={ STYLES.app }>
        <ReactMap style={ this.getStyle() } accessToken={ accessToken } containerStyle={ STYLES.container } center={ this.state.userPosition }>
          <Layer type="circle" id="position-marker" paint={ POSITION_CIRCLE_PAINT }>
            <Feature coordinates={ this.state.userPosition } />
          </Layer>
        </ReactMap>
        <button style={ STYLES.button } onClick={ this.nextStyle }>Switch Style</button>
        <div style={ STYLES.indicator }>
          { `Using style: "${this.getStyleKey()}"` }
        </div>
      </div>
      );
  }
}

export default App;
