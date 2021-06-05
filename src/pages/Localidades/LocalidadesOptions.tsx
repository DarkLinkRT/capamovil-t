import {IonContent, IonHeader, IonPage, IonTitle , IonFab, IonFabButton, IonIcon ,  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonList, IonRadioGroup, IonItem, IonLabel, IonRadio } 
from '@ionic/react';

import { Fragment, useState } from 'react';

import ModelLocalidad
from '../../models/Localidad';

import axios , {AxiosResponse} from "axios";

import Localidad from '../../class/Localidad';

import Cliente from '../../class/Cliente';

import Reporte from '../../class/Reporte';

import Config from '../../class/Config';

let cliente = new Cliente();

let datos_cliente = cliente.getData();

let localidad = new Localidad();

let reporte = new Reporte();

let configApp = new Config();

let UrlService = configApp.getUrlServiceHost();

interface PropTypes{
    localidad : ModelLocalidad
}

const Localidades = (props : PropTypes) => {

    var [IonRadioSelected , SetIonRadioSelected] = useState<boolean>(false);

    const headers = {
      'Content-Type': 'application/json'
    };

    const getLocalidadValue = (event : any) => {
      if(!IonRadioSelected){
        var idLocalidad = event.target.value;
        localidad.clean_data();
        SetIonRadioSelected(true);
        getNameLocalidad(idLocalidad);
      }
    }

    const getNameLocalidad = ( id : string) => {

      const dataAccount = {
        "usuario_id": datos_cliente.id
      }
    
      axios.post( UrlService + "api/Localidades/getLocalidadName/" + id, dataAccount , {headers})
        .then(( response : AxiosResponse )  => {    
           response.data.result.forEach((item:any)=>{
              saveData( item.id , item.nombre )
           })
        })

    }

    const saveData = ( id : string , nombre : string ) => {
        localidad.setID(id);
        localidad.setNombre(nombre);
        localidad.saveData();
        reporte.setLocalidad(id);
    }

    return(
            <IonItem>
              <IonLabel >{ props.localidad.nombre }</IonLabel>
              <IonRadio slot="end" color="primary" value={ props.localidad.id } onIonFocus={ getLocalidadValue } ></IonRadio>
            </IonItem>
    );
}

export default Localidades;