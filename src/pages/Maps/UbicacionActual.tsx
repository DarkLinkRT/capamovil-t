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

  const [position , setPosition] = useState<Geoposition>();

  useEffect(() => {
    const getLocation = async () => {
      try{
        const position = await Geolocation.getCurrentPosition();
        setPosition(position);
        reporte.setUbicacionLat(position.coords.latitude.toString());
        reporte.setUbicacionLng(position.coords.longitude.toString());
      } catch(e){
      
      }
    }

    getLocation();
  } , [setPosition])

  const GenerateMap = () =>{
    return(
      <div>
        <GoogleMap 
            defaultZoom={15} 
            defaultCenter={{ lat : position?.coords.latitude, lng : position?.coords.longitude }} 
        ></GoogleMap>
        <Marker position = {{ lat : position?.coords.latitude, lng : position?.coords.longitude }}></Marker>
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
