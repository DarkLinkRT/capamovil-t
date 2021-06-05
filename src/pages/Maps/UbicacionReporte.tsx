import { GoogleMap, withScriptjs, withGoogleMap } 
from 'react-google-maps'; 


const MapReporte: React.FC = () => {

  return (
    <div id="contenedorMapa">
      <GoogleMap defaultZoom={10} defaultCenter={{ lat : -34.397, lng : 150.644 }} ></GoogleMap>
    </div>
  );
};

export default withScriptjs(withGoogleMap(MapReporte));
