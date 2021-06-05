import {IonContent, IonSelect,IonSelectOption, IonHeader, IonPage, IonTitle , IonFab, IonFabButton, IonIcon ,  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } 
from '@ionic/react';
import { Fragment } from 'react';

import ModelMunicipio
from '../../models/Municipio';

interface PropTypes{
    reporte : ModelMunicipio
}

const MunicipiosOptionsOrigen = (props : PropTypes) => {
    return(
      <Fragment>
        <IonSelectOption value={props.reporte.id_origen}>{ props.reporte.name }</IonSelectOption>
      </Fragment>
    );
}

export default MunicipiosOptionsOrigen;