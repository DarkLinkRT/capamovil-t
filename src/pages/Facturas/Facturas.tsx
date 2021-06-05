import { IonContent, IonHeader, IonPage , IonItem, IonLabel, IonList, IonAvatar, IonListHeader } 
from '@ionic/react';

import BarraTop 
from '../../components/ToolBarBlue';

import { Plugins } from '@capacitor/core';

import './Facturas.css';

const { LocalNotifications  , Browser} = Plugins;

const Facturas: React.FC = () => {

  const openRecibo = async () => {
    await Browser.open({ url:'http://test.capa.gob.mx/capanetpdf?cta=66852&org=5'});
  }

  return (
    <IonPage id="pageFacturas">
      <IonHeader>
        <BarraTop></BarraTop>
      </IonHeader>
      <IonContent fullscreen>
          {/*-- List of Text Items --*/}
          <IonList>
            <IonListHeader id="titleFacturas"> Facturas </IonListHeader>
            <IonItem onClick={ () => { openRecibo(); } } >
              <IonAvatar id="avaEncuesta">
                <img  id="iconCheck"/>
              </IonAvatar>
              <IonLabel id="lblAvatar">Recibo pagado
                <p>15 de Marzo del 2021</p>
              </IonLabel>
            </IonItem>
            <IonItem onClick={ () => { openRecibo(); } }>
              <IonAvatar id="avaEncuesta">
                <img  id="iconCheck"/>
              </IonAvatar>
              <IonLabel id="lblAvatar">Recibo pagado
                <p>15 de Febrero del 2021</p>
              </IonLabel>
            </IonItem>
            <IonItem onClick={ () => { openRecibo(); } }>
              <IonAvatar id="avaEncuesta">
                <img  id="iconCheck"/>
              </IonAvatar>
              <IonLabel id="lblAvatar">Recibo pagado
                <p>15 de Enero del 2021</p>
              </IonLabel>
            </IonItem>
            </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Facturas;