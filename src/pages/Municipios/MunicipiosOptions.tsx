import {IonContent, IonSelect,IonSelectOption, IonHeader, IonPage, IonTitle , IonFab, IonFabButton, IonIcon ,  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } 
from '@ionic/react';
import { Fragment } from 'react';

import ModelMunicipio
from '../../models/Municipio';

interface PropTypes{
    reporte : ModelMunicipio
}

const MunicipiosOptions = (props : PropTypes) => {
    return(
      <Fragment>
        <IonSelectOption value={props.reporte.id}>{ props.reporte.name }</IonSelectOption>
      </Fragment>
    );
}

export default MunicipiosOptions;