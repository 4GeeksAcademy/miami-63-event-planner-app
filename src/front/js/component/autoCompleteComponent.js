import React, { useState } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];
const apiKey = process.env.REACT_APP_GOOGLE_API;

const AutoCompleteComponent = ({ address, setAddress }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState('');

  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      const formattedAddress = place.formatted_address || place.name;
      const location = place.geometry.location;
      setInputValue(formattedAddress);
      setAddress({
        location: formattedAddress,
        lat: location.lat(),
        lng: location.lng(),
      });
      console.log('Selected Address:', formattedAddress);
      console.log('Location:', { lat: location.lat(), lng: location.lng() });
    } else {
      console.log('Autocomplete is not loaded yet!');
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      libraries={libraries}
      loadingElement={<div>Loading...</div>}
      onLoad={() => console.log('Google Maps script has been loaded')}
      async
    >
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <input
          className="input-box"
          type="text"
          placeholder="Enter address"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </Autocomplete>
    </LoadScript>
  );
};

export default AutoCompleteComponent;