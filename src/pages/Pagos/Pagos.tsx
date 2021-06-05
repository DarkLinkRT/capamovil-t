import { IonContent,  useIonActionSheet, IonRadioGroup , IonListHeader  ,IonButtons ,  IonToolbar, IonLoading, IonRadio, IonCheckbox, IonTitle , IonInput, IonModal, IonHeader, IonPage, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonLabel, IonButton, IonIcon, IonList, IonAvatar, IonImg, IonText, IonTextarea} 
from '@ionic/react';

import React, { useState , useEffect , Fragment  } 
from 'react';

import { useBarcode } from 'react-barcodes';

/** icons */
import {  callSharp , cardSharp, barcodeSharp , closeSharp , chevronBackOutline} 
from 'ionicons/icons';

import BarraTop 
from '../../components/ToolBarBlue';

import axios , {AxiosResponse} 
from "axios";

import './Pagos.css';

import storage from 'local-storage';

//Importar la clase
import Cliente
from '../../class/Cliente';

import Map from '../Maps/UbicacionSucursales';


import Config from '../../class/Config';

import ModelPregunta from '../../models/Pregunta';

import { Plugins } from '@capacitor/core';

import { BackgroundMode } from '@ionic-native/background-mode';

const { LocalNotifications  , Browser} = Plugins;

let configApp = new Config();
let UrlService = configApp.getUrlServiceHost();
let CapaApi = configApp.getUrlCapaServices();

let cliente = new Cliente();

let datos_cliente = cliente.getData();

let background = BackgroundMode;

function BarCode({textobarcode} : any) {
  const { inputRef } = useBarcode({
    value: textobarcode==""?"vacio":textobarcode,
    options: {
      background: '#ffffff',
    }
  });
  
  return <img ref={inputRef} />;
};

const Pagos: React.FC = (props) => {

  const [preguntas , setPreguntas] = useState(Array<ModelPregunta>());
  const [check1, setCheck1] = useState<boolean>(false);
  const [check2, setCheck2] = useState<boolean>(false);
  const [sugerencia, setSugerencia] = useState<string>("");

  const mapUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBA4oo4JJFkkj6Du2rKfs2o2FHQRXaP8YA';

  var [nombre, setNombre] = useState<String>();
  var [totalPago, setTotalPago] = useState<String>();
  var [fechaVencimiento, setFechaVencimiento] = useState<String>();
  var [recibo, setRecibo] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText , setLoadingText] = useState<string>("");

  const [modalPago , setModalPago] = useState<boolean>(false);
  const [modalUbicaciones , setModalUbicaciones] = useState<boolean>(false);
  const [modalEncuesta , setModalEncuesta] = useState<boolean>(false);

  const [showModalUbicacion, setShowModalUbicacion] = useState(false);

  const [hayEncuesta, setHayEncuesta] = useState<boolean>(true);

  const [present, dismiss] = useIonActionSheet();

  const headers = {
    'Content-Type': 'application/json'
  };

  useEffect(() => {

    let preguntasArray : Array<ModelPregunta> = [];

    setLoadingText("Cargando...");
    setIsLoading(true);
  
    const dataAccount = {
       "data"  : "true"
    }
  
    axios.get(CapaApi + "ews_no_contrato=" + storage("CUENTA_USER") + "&ews_id_municipio=" + storage("MUNICIPIO_USER"), {headers})
      .then(( response : AxiosResponse )  => {    
          setIsLoading(false);
          storage("NOMBRE_RECORDATORIO" , response.data["nombre"]);
          storage("IMPORTE_RECORDATORIO" , response.data["importe"]);
          storage("FECHA_LIMITE_RECORDATORIO" , response.data["fechalimite"]);
          setNombre(response.data["nombre"]);
          setTotalPago(response.data["importe"]);
          setFechaVencimiento(response.data["fechalimite"]);
          setRecibo(response.data["importe"]);
      })

      
      axios.post( UrlService +"api/Preguntas/getPreguntas", dataAccount , {headers})
      .then(( response : AxiosResponse )  => {    
        setIsLoading(false);
        response.data.result.forEach((item:any)=>{
            preguntasArray.push({
              id : item.id,
              name: item.name,
              activo : item.activo,
              orden : item.orden
            });
        })
        setPreguntas(preguntasArray);
        verifyEncuesta();
    })

  },[]);

  const toBool = (a : any) => {
    return Boolean(a).valueOf();
  }

  const verifyEncuesta = () => {
    if(toBool( storage("ENCUESTA_USER") )){
      setHayEncuesta(true);
    } else{
      setHayEncuesta(false);
    }
  }

  const openPayMethod = async () => {
    await Browser.open({ url: 'https://jorge.sm2test.com/capa/pagos/proceed?contrato=' +  parseInt(storage("CUENTA_USER")+"") + '&municipio=' + storage("MUNICIPIO_USER") });
  }

  const openCapaPage = async () => {
    await Browser.open({ url:'https://www.qroo.gob.mx/CAPA'});
  }

  const sendEncuesta = () => {
    if(check1 != null){
      if(check2 != null){
        if(sugerencia != null){
          var data = {
            "co_usuario_id" : storage("ID_USER"),
            "pregunta_uno" : "4105f8cb-112d-44a6-8d06-41989dd14a92",
            "respuesta_uno" : check1,
            "pregunta_dos" : "99dc0ffa-82e5-47f5-bbd2-17d8b82fdd84",
            "respuesta_dos" : check2,
            "pregunta_tres" : "1877c111-2ae5-472f-9e9f-6442b6314321",
            "sugerencia" : sugerencia
          }

          axios.post( UrlService +"api/Respuestas/saveRespuestas", data , {headers})
            .then(( response : AxiosResponse )  => {    
              storage("ENCUESTA_USER", false);
              verifyEncuesta();
              setModalEncuesta(false);
          })
        }
      }
    }
  }

  return (
    <IonPage id="pagePagos">
       <IonLoading
            isOpen = { isLoading }
            message = { loadingText }
        ></IonLoading>
      <IonHeader>
        <BarraTop></BarraTop>
      </IonHeader>
      <IonContent fullscreen>
        {/* DISEÑO TOP */}
        <div>
          <div id="principalDisenio">

          </div>
        </div>
        {/* END::DISEÑO TOP */}
        <div id="contentPagePagos" style={{ justifyContent : "center" , display : "flex" , textAlign : "center" }}>
          {/* CARD DE INFORMACION DE PAGO */}
            <IonCard style={{ width : "90%" }}>
             
                <IonCardHeader>
                    <IonCardSubtitle id="cardSaludo">¡Hola { nombre } , Tu monto a pagar es de:</IonCardSubtitle>
                    <IonCardTitle  id="cardTotal">$ { totalPago } </IonCardTitle>
                    <IonCardSubtitle  id="cardFechaLimiteMSG">Tu fecha limite de pago es:</IonCardSubtitle>
                    <IonCardTitle  id="cardFechaLimite"> { fechaVencimiento } </IonCardTitle>
                </IonCardHeader>

                <IonCardContent>
                {/* BOTON DE PAGO */}
                <IonButton color="primary" expand="block"  onClick={() =>
                    present({
                      buttons: [ 
                        { 
                          text: 'Tarjeta de crédito / débito' ,
                          icon : cardSharp,
                          handler : () => {
                            // setModalPago(true);
                            openPayMethod()
                          }
                        }, 
                        { 
                          text: 'Por referencia' ,
                          icon : barcodeSharp,
                          handler : () => {
                            setModalPago(true);
                          }
                        },  
                        { 
                          text: 'Cancelar' ,
                          icon : closeSharp
                        } 
                      ],
                      header: 'Opciones de pago'
                    })
                  } >Pagar</IonButton>
                {/* END::BOTON DE PAGO */}
              </IonCardContent>
            </IonCard>
          {/* END:: CARD INFORMACION DE PAGO */}
        </div>
        <div id="contentPageEncuestas" style={{ justifyContent : "center" , display : "flex" , textAlign : "center" }}>
          {/* CARD DE ENCUESTAS Y UBICACIONES */}
          <IonCard style={{ width : "90%" }}>
              <IonCardContent>
                 {/*-- List of Text Items --*/}
                <IonList>
                  { hayEncuesta ?  
                    <IonItem onClick={ () => { setModalEncuesta(true) }}>
                      <IonAvatar id="avaEncuesta">
                        <img  id="iconEncuesta"/>
                      </IonAvatar>
                      <IonLabel id="lblAvatar">Encuesta de Satisfacción
                        <p>Queremos ver tu satisfacción con esta app</p>
                      </IonLabel>
                    </IonItem>
                   : "" }
                  <IonItem onClick={ () => { setShowModalUbicacion(true) }}>
                    <IonAvatar>
                      <img  id="iconUbicacion"/>
                    </IonAvatar>
                    <IonLabel id="lblAvatar">Ubicación 
                      <p>Ver las sucursales mas cercanas</p> 
                     </IonLabel>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          {/* END::CARD DE ENCUESTAS Y UBICACIONES */}
        </div>
        <div id="contentPageEncuestas" style={{ justifyContent : "center" , display : "flex" , textAlign : "center" }}>
           {/* CARD DE INFORMACION */}
           <IonCard style={{ width : "90%" }}>
              <IonCardContent>
                <h2 id="txtPrincipalFooter">Contáctanos</h2>
                <br/>
                <p className="card-text" id="txtTelefono">
                  <IonIcon id="iconTelefono" icon={callSharp} /> 073<br/><br/>
                  <a id="linkCapa" onClick={ () => { openCapaPage() } }>www.qroo.gob.mx/CAPA</a>   
                </p>
              </IonCardContent>
            </IonCard>
           {/* END::CARD DE INFORMACION */}
        </div>
        {/* Modal de pago */}
            <IonModal isOpen={modalPago} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalPago(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Otra forma de pago </IonTitle>
                </IonToolbar>
                </IonHeader>
                <IonContent>
                  <div style={{ textAlign : "center" }}>
                  <br/>
                    <IonTitle id="titlePage">Código de referencia</IonTitle>
                    <div style={{ padding : "10px" }}>
                      <span>Presenta este código a las espresas participantes (Por ejemplo: OXXO) para poder pagar tu recibo</span>
                      <br/>
                      <br/>
                      <br/>
                      <BarCode textobarcode={recibo}></BarCode>
                    </div>
                </div>
                </IonContent>
            </IonModal>
        {/* End::modal de pago */}
        {/* Modal de encuestas */}
              <IonModal isOpen={modalEncuesta} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalEncuesta(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Encuesta </IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={ () => { sendEncuesta() } }  ><span style={{  color: "#03a4d0" }}>Enviar</span></IonButton>
                    </IonButtons>
                </IonToolbar>
                </IonHeader>
                <IonContent>
                  <div style={{ textAlign : "center" }}>
                  <br/>
                    <IonTitle id="titlePage">Encuesta de satisfacción</IonTitle>
                    <div style={{ padding : "10px" }}>
                      <IonList>
                          {preguntas.map((pregunta, index) => (
                              <div> 
                                { pregunta.orden == "1" ?
                                 <IonRadioGroup value={check1} onIonChange={e => setCheck1(e.detail.value)}>
                                    <IonListHeader>
                                      <IonLabel>{ pregunta.name }</IonLabel>
                                    </IonListHeader>
                                    <IonItem>
                                      <IonLabel>Si</IonLabel>
                                      <IonRadio slot="start" value="1" />
                                    </IonItem>
                                    <IonItem>
                                      <IonLabel>No</IonLabel>
                                      <IonRadio slot="start" value="0" />
                                    </IonItem>
                                  </IonRadioGroup>
                                : pregunta.orden == "2" ?
                                <IonRadioGroup value={check2} onIonChange={e => setCheck2(e.detail.value)}>
                                    <IonListHeader>
                                      <IonLabel>{ pregunta.name }</IonLabel>
                                    </IonListHeader>
                                    <IonItem>
                                      <IonLabel>Si</IonLabel>
                                      <IonRadio slot="start" value="1" />
                                    </IonItem>
                                    <IonItem>
                                      <IonLabel>No</IonLabel>
                                      <IonRadio slot="start" value="0" />
                                    </IonItem>
                                </IonRadioGroup>
                                : 
                                <div>
                                   <IonListHeader>
                                      <IonLabel>{ pregunta.name }</IonLabel>
                                    </IonListHeader>
                                      <IonItem>
                                      <IonTextarea rows={ 5 } value={ sugerencia } onIonChange={ (e) =>  setSugerencia(e.detail.value!) } ></IonTextarea>
                                    </IonItem>
                                </div>
                                }
                              </div>
                            ))}
                        </IonList>
                    </div>
                </div>
                </IonContent>
            </IonModal>
        {/* Modal de encuestas */}
        {/* Modal de ubicaciones */}
          <IonModal isOpen={showModalUbicacion} cssClass='my-custom-class'>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Sucursales</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setShowModalUbicacion(false)}><span style={{  color: "#03a4d0" }}>Listo</span></IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <Map
                googleMapURL = { mapUrl }
                containerElement = {<div style={{ height : "100%" }} />}
                mapElement = {<div style={{ height : "100%" }} />}
                loadingElement = {<p> Cargando... </p>}
              />
            </IonContent>
          </IonModal>
        {/* End::Modal de ubicaciones */}
      </IonContent>
    </IonPage>
  );
};

export default Pagos;