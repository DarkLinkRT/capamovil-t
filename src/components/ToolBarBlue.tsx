import {IonGrid, IonCard, IonLoading, IonAvatar , IonSlides , IonTextarea, IonSlide, IonImg,  IonButtons, IonBadge , IonSelect, IonCardHeader , IonCardContent ,IonCardTitle , IonCardSubtitle,  IonRow, IonCol , IonMenuButton , IonModal, IonTitle, IonAlert,  IonHeader, IonButton, IonInput, IonToolbar, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonToggle } 
from '@ionic/react';

import { FormEventHandler, useEffect, useState } from 'react';

import { Plugins , PushNotification, PushNotificationToken , PushNotificationActionPerformed   } from '@capacitor/core';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import Cliente 
from '../class/Cliente';

import Session
from '../class/Session';

import Config from '../class/Config';

import MunicipioModel from '../models/Municipio';

import NotificacionModel from '../models/Notification';

import axios ,  {AxiosError, AxiosResponse} 
from "axios";

import OptionsMunicipios from '../pages/Municipios/MunicipiosOptionsOrigen';

import storage from 'local-storage';


/** icons */
import { notificationsOutline , addOutline , chevronBackOutline , pencilOutline , personCircleSharp , lockClosedSharp, notificationsSharp } 
from 'ionicons/icons';

import './ToolBarBlue.css';

let cliente = new Cliente();
let session = new Session();
var datos_cliente = cliente.getData();
let configApp = new Config();
let UrlService = configApp.getUrlServiceHost();
let CapaApi = configApp.getUrlCapaServices();

const { LocalNotifications , BackgroundTask , App , PushNotifications  } = Plugins;


interface ObservacionModel{
    activo : boolean,
    co_usuario : { co_grupo_id : string, login : string , nombre : string , paterno : string , materno : string, icono_perfil : string },
    observacion : string,
    created : string
  }
  
  interface FotoModel{
    activo : boolean,
    id : string,
    name : string,
    ruta : string
  }

  
const BarraTop: React.FC = () => {

    const[ hayRecibo , setHayRecibo ] = useState(false);
    const[ isFull , setIsFull ] = useState(false);

    const [modalNuevoRecibo, setModalNuevoRecibo] = useState(false);
    const [modalNotificaciones , setModalNotificaciones] = useState(false);
    const [modalPerfil , setModalPerfil] = useState(false);
    const [modalData , setModalData] =  useState(false);
    const [modalPassword , setModalPassword] =  useState(false);

    const [ isOpenAlert , setIsOpenAlert ] = useState(false);
    const [ MessageAlert, setMessageAlert ] = useState<string>("");
    const [ headerAlert, setHeaderAlert] = useState<string>("");

    const [nombre, setNombre] = useState<String>("");
    const [totalPago, setTotalPago] = useState<String>("");
    const [fechaVencimiento, setFechaVencimiento] = useState<String>("");

    const [numeroContrato , setNumeroContrato] = useState<string>();
    const [municipio , setMunicipio] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingText , setLoadingText] = useState<string>("");

    var [municipiosList, setMunicipiosList] = useState(Array<MunicipioModel>());
    
    var [notifications , setNotifications]  = useState(Array<NotificacionModel>());

    const [openReporte , setOpenReporte] = useState(false);

    const [asunto , setAsunto] = useState<string>("");
    const [status , setStatus] = useState<string>("");
    const [municipioR , setMunicipioR] = useState<string>("");
    const [localidad , setLocalidad] = useState<string>("");
    const [colonia , setColonia] = useState<string>("");
    const [direccion , setDireccion] = useState<string>("");
    const [observaciones , setObservaciones] = useState(Array<ObservacionModel>());
    const [fotos, setFotos] = useState(Array<FotoModel>());

    const [nombreuser ,setNombreuser] = useState<string>( storage("NOMBRE_USER") +  "");
    const [apellidopaterno ,setApellidoPaterno] = useState<string>(storage("PATERNO_USER") + "");
    const [apellidomaterno ,setApelldioMaterno] = useState<string>(storage("MATERNO_USER") + "");
    const [domcilioUser ,setDomicilioUser] = useState<string>(storage("DOMICILIO_USER") + "");

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
        (notification: PushNotification) => {
            // alert('Push received: ' + JSON.stringify(notification));
            
            const getNotifications = async () => {

                const notifs = await LocalNotifications.schedule({
                    notifications: [
                      {
                        title: notification.title + "",
                        body: notification.body + "",
                        id: 1,
                        actionTypeId: "",
                        extra: null
                      }
                    ]
                  });

                let notificacionesArray : Array<NotificacionModel> = [];
                
    
                const dataAccount = {
                "usuario_id": ""
                }
            
                axios.post(UrlService + "api/Notificaciones/getAllNotifications/" + storage( "ID_USER"), dataAccount , {headers})
                .then(( response : AxiosResponse )  => {    
                response.data.result.forEach((item:any)=>{
                    notificacionesArray.push({
                        id : item.id,
                        co_usuario_id : item.co_usuario_id,
                        titulo : item.titulo,
                        descripcion : item.descripcion,
                        enlace : item.enlace,
                        type : item.type,
                        visto : item.visto,
                        entregado : item.entregado
                    });
                })
                setNotifications(notificacionesArray);
                })
            }
            getNotifications();
        }
    );


    const headers = {
        'Content-Type': 'application/json'
    };

    useEffect(() => {
  
        const getMunicipios = async () => {
  
          let municipiosArray : Array<MunicipioModel> = [];
            
  
          const dataAccount = {
              "usuario_id": ""
          }
        
          axios.post(UrlService + "api/Municipios/getMunicipios", dataAccount , {headers})
            .then(( response : AxiosResponse )  => {    
              response.data.result.forEach((item:any)=>{
                  municipiosArray.push({
                    id : item.id,
                    id_origen : item.id_origen,
                    name : item.name,
                    activo : item.activo,
                    created : item.created,
                    modified : item.modified
                  });
              })
              setMunicipiosList(municipiosArray);
            })
        }

        const getNotifications = async () => {

            let notificacionesArray : Array<NotificacionModel> = [];
            
  
            const dataAccount = {
              "usuario_id": ""
            }
        
            axios.post(UrlService + "api/Notificaciones/getAllNotifications/" + storage( "ID_USER"), dataAccount , {headers})
            .then(( response : AxiosResponse )  => {    
              response.data.result.forEach((item:any)=>{
                notificacionesArray.push({
                    id : item.id,
                    co_usuario_id : item.co_usuario_id,
                    titulo : item.titulo,
                    descripcion : item.descripcion,
                    enlace : item.enlace,
                    type : item.type,
                    visto : item.visto,
                    entregado : item.entregado
                  });
              })
              setNotifications(notificacionesArray);
            })
        }

        getMunicipios();
        getNotifications();

    },[ setMunicipiosList ,  setNotifications])

    const openScanner = async  () => {
        const data = await BarcodeScanner.scan();
    
        if(data.text.length == 10){
            setNumeroContrato(data.text);
            verifyForm();
        } else{
          setHeaderAlert("Parece que ocurrio un problema");
          setMessageAlert("Parece que esto no es un número de contrato valido, reintente de nuevo.");
          setIsOpenAlert(true);
        }
    }

    const verifyForm = () => {
        if( numeroContrato != "" && municipio != ""){
            setIsFull(true);
        }
    }

    const confirmarRecibo = () => {

        setLoadingText("Cargando...")
        setIsLoading(true);
        
        const dataAccount = {
             "data"  : "true"
        }
        
        axios.get(CapaApi + "ews_no_contrato=" + numeroContrato + "&ews_id_municipio=" + municipio, {headers})
        .then(( response : AxiosResponse )  => {    
            setIsLoading(false);
            if(response.data["nombre"] != "" && response.data["nombre"] != null){
                setNombre(response.data["nombre"]);
                setTotalPago(response.data["importe"]);
                setFechaVencimiento(response.data["fechalimite"]);
            } else{
                setIsLoading(false);
                setMessageAlert("Parece que el municipio no coincide con el número de contrato");
                setHeaderAlert("Ocurrio un problema");
                setIsOpenAlert(true);
            }
        })
        
        setIsLoading(false);
    }

    const abrirReporte = ( id : string) => {
        setOpenReporte(true);
        let observacionesArray : Array<ObservacionModel> = [];
        let fotosArray : Array<FotoModel> = [];
        axios.post( UrlService + "api/Reportes/getReporte/" +  id , {} , {headers})
        .then(( response : AxiosResponse )  => {    
           setAsunto(response.data.result.reporte.asunto);
           setMunicipioR(response.data.result.reporte.cat_municipio.name);
           setLocalidad(response.data.result.reporte.cat_localidade.nombre);
           setDireccion(response.data.result.reporte.direccion);
           setColonia(response.data.result.reporte.colonia);
           setStatus(response.data.result.reporte.cat_estatus_reporte.id)
           //Observaciones
           response.data.result.observacion.forEach((item:any)=>{
              observacionesArray.push({
                activo : item.activo,
                co_usuario : { co_grupo_id : item.co_grupo_id, login : item.login , nombre : item.nombre , paterno : item.paterno , materno : item.materno, icono_perfil : item.icono_perfil },
                observacion : item.observacion,
                created : item.created
              });
            })
            setObservaciones(observacionesArray);
            //Fotos
            response.data.result.reporte.fotos.forEach((item:any)=>{
              fotosArray.push({
                activo : item.activo,
                id : item.id,
                name : item.name,
                ruta : item.ruta
              });
            })
            setFotos(fotosArray);
        })
        .catch ( ( error : AxiosError ) => {
        })
      }



















    return (
        <IonToolbar color="tertiary" id="toolBarApp" >
            <IonGrid>
            <IonRow>
                <IonCol size="4" id="colMenu">
                    <img id="logoTopBar"/>
                    {/* <IonMenuButton id="menuBtn"/> */}
                </IonCol>
                <IonCol size="2" id="colLogo">
                    {/* <img id="logoTopBar"/> */}
                </IonCol>
                {/* <IonCol size="2"></IonCol> */}
                <IonCol size="6" id="colProfile">
                    <IonIcon id="iconAddRecibo" icon={addOutline} onClick={ () => { setModalNuevoRecibo(true) } } />
                    { notifications.length > 0 ? 
                         <IonBadge style={{ position : "absolute" , transform : "translateY(-6px) translateX(5px)" , zIndex : 10 }} color="danger">{ notifications.length }</IonBadge>
                    :
                            ""
                    }
                    <IonIcon id="iconNotificaciones" icon={notificationsOutline} onClick={ () => { setModalNotificaciones(true) } }>
                    </IonIcon>
                    <img  src={ storage( "PROFILE_IMG_USER") + "" } id="imgProfile" onClick={ () => { setModalPerfil(true) } } />
                </IonCol>
            </IonRow>
            </IonGrid>
            <IonLoading
                isOpen = { isLoading }
                message = { loadingText }
            ></IonLoading>
            <IonAlert
                  isOpen={isOpenAlert}
                  onDidDismiss={() => setIsOpenAlert(false)}
                  cssClass="my-custom-class"
                  header={headerAlert}
                  message={MessageAlert}
                  buttons={["Aceptar"]}
            />
             {/* SECCION DE MODALES */}
             {/* Modal de notificaciones */}
             <IonModal isOpen={modalNotificaciones} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalNotificaciones(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Notificaciones </IonTitle>
                </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        { notifications.map((notification, index) => ( 

                            <IonItem onClick={ () =>  abrirReporte(notification.enlace) }>
                                <IonAvatar id="avaEncuesta">
                                    <img  id="iconResponse"/>
                                </IonAvatar>
                                <IonLabel id="lblAvatar"> { notification.titulo }
                                    <p>{ notification.descripcion }</p>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                </IonContent>
            </IonModal>
             {/* End::Modal de notificaciones */}

































             {/* Modal de perfil de usuario */}
             <IonModal isOpen={modalPerfil} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalPerfil(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Perfil </IonTitle>
                </IonToolbar>
                </IonHeader>
                <IonContent>
                    {/* Content perfil */}
                    <div>
                        <div style={{ display: "flex" ,  justifyContent: "center" , marginTop: "50px" }}>
                            <IonAvatar id="avaEncuesta" style={{ width: "100px" , height: "100px" ,objectFit: "cover" }}>
                                <img src={ storage( "PROFILE_IMG_USER") + ""}/>
                                <IonBadge style={{ position : "absolute" , transform : "translateY(69px) translateX(-24px)" , zIndex : 10 , borderRadius : "20px"}} color="secondary">
                                    <IonIcon id="editPhotoProfile" style={{ fontSize: "20px" }} icon={pencilOutline} onClick={ () => { } }>
                                    </IonIcon>
                                </IonBadge>
                            </IonAvatar>
                        </div>
                        <br/><br/>
                        <div>
                            <IonItem>
                                <IonLabel>Usuario</IonLabel>
                                <div> { storage( "LOGIN_USER") } </div>
                            </IonItem>
                        </div>
                        <br/><br/>
                        <div>
                            <IonItem onClick={ () => { setModalData(true) }}>
                                <IonIcon id="editPhotoProfile" style={{ fontSize: "20px" }} icon={personCircleSharp} onClick={ () => { } }>
                                </IonIcon>
                                <IonLabel style={{ marginLeft: "5px" }}>Datos personales</IonLabel>
                                <div> {  } </div>
                            </IonItem>
                            <IonItem onClick={ () => { setModalPassword(true) }}>
                                <IonIcon id="editPhotoProfile" style={{ fontSize: "20px" }} icon={lockClosedSharp} onClick={ () => { } }>
                                </IonIcon>
                                <IonLabel  style={{ marginLeft: "5px" }}>Cambiar contraseña</IonLabel>
                                <div></div>
                            </IonItem>
                            {/* <IonItem>
                                <IonIcon id="editPhotoProfile" style={{ fontSize: "20px" }} icon={notificationsSharp} onClick={ () => { } }>
                                </IonIcon>
                                <IonLabel  style={{ marginLeft: "5px" }}>Alertas de notificación</IonLabel>
                                <div></div>
                            </IonItem> */}
                        </div>
                    </div>
                    {/* End::Content perfil */}
                </IonContent>
            </IonModal>
             {/*  End::Modal de perfil de usuario */}
             {/* Modal de datos del usuario */}
             <IonModal isOpen={modalData} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalData(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Datos del usuario </IonTitle>
                    <IonButtons slot="end">
                            <IonButton onClick={ confirmarRecibo }  ><span style={{  color: "#03a4d0" }}>Guardar</span></IonButton>
                    </IonButtons>
                </IonToolbar>
                </IonHeader>
                <IonContent>
                    {/* Content perfil */}
                    <div>
                        <div style={{ padding : "10px" }}>
                            <br/>
                            <IonItem>
                                <IonLabel position="floating">Nombre (s)</IonLabel>
                                <IonInput value={ nombreuser }  ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Apellido Paterno</IonLabel>
                                <IonInput value={ apellidopaterno }  ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Apellido Materno</IonLabel>
                                <IonInput value={ apellidomaterno } ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Domicilio</IonLabel>
                                <IonTextarea rows={ 5 } value={ domcilioUser }  ></IonTextarea>
                            </IonItem>
                            <br/>
                        </div>
                    </div>
                    {/* End::Content perfil */}
                </IonContent>
            </IonModal>
            {/* End::Modal de datos del usuario */}
            {/* Modal para cambiar contraseña */}
            <IonModal isOpen={modalPassword} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalPassword(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Actualizar contraseña </IonTitle>
                    <IonButtons slot="end">
                            <IonButton onClick={ confirmarRecibo }  ><span style={{  color: "#03a4d0" }}>Guardar</span></IonButton>
                    </IonButtons>
                </IonToolbar>
                </IonHeader>
                <IonContent>
                    {/* Content perfil */}
                    <div>
                        <div style={{ padding : "10px" }}>
                            <br/>
                            <IonItem>
                                <IonLabel position="floating">Escriba su contraseña actual</IonLabel>
                                <IonInput value={ numeroContrato }  ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Escriba la nueva contraseña</IonLabel>
                                <IonInput value={ numeroContrato }  ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Escriba de nuevo la nueva contraseña</IonLabel>
                                <IonInput value={ numeroContrato } ></IonInput>
                            </IonItem>
                            <br/>
                        </div>
                    </div>
                    {/* End::Content perfil */}
                </IonContent>
            </IonModal>
            {/* End::Modal para las notificaiones alerts  */}

            {/* <IonModal isOpen={modalPassword} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalPassword(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Actualizar contraseña </IonTitle>
                    <IonButtons slot="end">
                            <IonButton onClick={ confirmarRecibo }  ><span style={{  color: "#03a4d0" }}>Guardar</span></IonButton>
                    </IonButtons>
                </IonToolbar>
                </IonHeader>
                <IonContent> */}
                    {/* Content perfil */}
                    {/* <div>
                        <div style={{ padding : "10px" }}>
                            <br/>
                            <IonItem>
                                <IonLabel position="floating">Escriba su contraseña actual</IonLabel>
                                <IonInput value={ numeroContrato }  ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Escriba la nueva contraseña</IonLabel>
                                <IonInput value={ numeroContrato }  ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Escriba de nuevo la nueva contraseña</IonLabel>
                                <IonInput value={ numeroContrato } ></IonInput>
                            </IonItem>
                            <br/>
                        </div>
                    </div> */}
                    {/* End::Content perfil */}
                {/* </IonContent>
            </IonModal> */}
            {/* End::Modal para las notificaciones alerts  */}





































            {/* Modal para el nuevo recibo */}
            <IonModal isOpen={modalNuevoRecibo} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalNuevoRecibo(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Pagar otro recibo</IonTitle>
                    { isFull ? 
                        <IonButtons slot="end">
                            <IonButton onClick={ confirmarRecibo }  ><span style={{  color: "#03a4d0" }}>Confirmar</span></IonButton>
                        </IonButtons>
                    :
                        ""
                    }
                </IonToolbar>
                </IonHeader>
                <IonContent>
                <div style={{ textAlign : "center" }}>
                    <br/>
                    <IonTitle id="titlePage"></IonTitle>
                    <div style={{ padding : "10px" }}>

                        { hayRecibo ? 

                        <div>
                            <IonCard style={{ width : "90%" }}>
                                <IonCardHeader>
                                    <IonCardSubtitle id="cardSaludo">¡Hola { nombre } , Tu monto a pagar es de:</IonCardSubtitle>
                                    <IonCardTitle  id="cardTotal">$ { totalPago } </IonCardTitle>
                                    <IonCardSubtitle  id="cardFechaLimiteMSG">Tu fecha limite de pago es:</IonCardSubtitle>
                                    <IonCardTitle  id="cardFechaLimite"> { fechaVencimiento } </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    {/* BOTON DE PAGO */}
                                    <IonButton color="primary" expand="block">Pagar</IonButton>
                                    {/* END::BOTON DE PAGO */}
                                </IonCardContent>
                            </IonCard>
                            <br/>
                            <IonButton color="primary" onClick={ () => { setHayRecibo(false) } } expand="block">Escanear otro recibo</IonButton>
                        </div>

                        :
                        <div>
                             <p>Introduzca su número de contrato para continuar</p>
                            <IonItem>
                                <IonLabel position="floating">Número de Contrato</IonLabel>
                                <IonInput maxlength={ 10 } readonly value={ numeroContrato } onIonChange={ (e) =>  setNumeroContrato(e.detail.value!) } ></IonInput>
                            </IonItem>
                            <br/>
                            <IonItem>
                                <IonLabel>Municipio</IonLabel>
                                <IonSelect okText="Aceptar" cancelText="Cancelar" onIonChange={ (e) =>  {setMunicipio(e.detail.value); verifyForm()} } >
                                { municipiosList.length > 0 && municipiosList.map((item:MunicipioModel, index:number) => {
                                    return(
                                    <OptionsMunicipios key={index} reporte={item}></OptionsMunicipios>
                                    );
                                })}
                                </IonSelect>
                            </IonItem>
                            <br/>
                            <br/>
                            <IonButton color="primary" onClick={ openScanner } expand="block">Escanear recibo</IonButton>
                        </div>
                       

                        }
                      
                    </div>
                </div>
                </IonContent>
            </IonModal>
            {/* end:: modal */}
            {/* Modal de info */}
          <IonModal isOpen={openReporte} cssClass='my-custom-class'>
              <IonHeader>
              <IonToolbar>
                  <IonTitle> <IonIcon onClick={() => setOpenReporte(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Reporte </IonTitle>
              </IonToolbar>
              </IonHeader>
              <IonContent>
                <div  style={{ padding : "15px" }}>
                    <IonItem>
                        <IonLabel>Asunto</IonLabel>
                        <div>{ asunto }</div>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Estatus del reporte</IonLabel>
                        <div>{ status == "491820c1-cbb0-497f-b3e8-7cc9c140aa0d" ? "Atendido" : status == "7ba2cd98-f1f8-44e5-ba48-0818dc028d88" ? "Pendiente" : "En revisión" }</div>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Municipio</IonLabel>
                        <div>{ municipioR }</div>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Localidad</IonLabel>
                        <div>{ localidad }</div>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Colonia</IonLabel>
                        <div>{ colonia }</div>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Dirección</IonLabel>
                        <div>{ direccion }</div>
                    </IonItem>
                    <br/>
                    <IonTitle id="titlePage"> Observaciones </IonTitle>
                     { observaciones.map((observacion, index) => ( 

                        <IonItem>
                            <IonLabel>{ observacion.observacion }</IonLabel>
                        </IonItem>

                      ))}
                    <IonTitle id="titlePage"> Fotos </IonTitle>
                    <IonSlides>
                      { fotos.map((foto, index) => ( 

                            <IonSlide>
                              <div className="slide" style={{  }}>
                                  <IonImg style={{ height : "250px" , width : "100%" , objectFit : "cover"}} src={foto.ruta} />
                                  {/* <p>Toca para ver la imágen </p> */}
                              </div>
                            </IonSlide>

                        ))}
                    </IonSlides>
                </div>
              </IonContent>
          </IonModal>
        {/* End::Modal de info */}
        {/* END::SECCION DE MODALES */}
        </IonToolbar>
    );
  };
  
  
  export default BarraTop;
  