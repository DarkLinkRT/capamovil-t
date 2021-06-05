import { GoogleMap, withScriptjs, withGoogleMap , Marker } 
from 'react-google-maps';

import Reporte from '../../class/Reporte';

import React, { useState , useEffect , Fragment, SetStateAction  } 
from 'react';

import { Plugins } from '@capacitor/core';

import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

import { Geolocation , Geoposition } from '@ionic-native/geolocation';

let reporte = new Reporte();

interface LocationError {
  showError : boolean,
  message : string
}

const MapActual: React.FC = (props) => {

  const GenerateMap = () =>{
    return(
      <div>
        <GoogleMap 
            defaultZoom={15} 
            defaultCenter={{ lat : 18.5014467, lng : -88.297182 }} 
        ></GoogleMap>
        <Marker position = {{ lat : 18.5014467, lng : -88.297182 }}></Marker>
      </div>
    );
  }
  
  return (
    <div id="contenedorMapa">
      <GenerateMap></GenerateMap>
    </div>
  );
};

export default withScriptjs(withGoogleMap(MapActual));
