import storage 
from 'local-storage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

import { IonRow, IonCol, IonAlert, IonLoading, IonToast, IonSearchbar, IonRadioGroup, IonSlides, IonMenuButton ,IonSlide, IonImg, IonContent,  IonHeader, IonList, IonPage, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonItem, IonTitle , IonModal, IonFab, IonFabButton, IonIcon , IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonToolbar, IonButtons } 
from '@ionic/react';

import React, { useState , useEffect , Fragment , SetStateAction } 
from 'react';

import { add , duplicateSharp , chevronBackOutline , camera , save} 
from 'ionicons/icons';

import BarraTop 
from '../../components/ToolBarBlue';

import Cliente
from '../../class/Cliente';

import ModelReporte
from '../../models/Reporte';

import ReporteCard
from './ReporteCard';

import axios , {AxiosError, AxiosResponse} 
from "axios";

import './Reportes.css';

import ReporteModel 
from '../../models/Reporte';

import Config from '../../class/Config';

import { usePhotoGallery } from '../../hooks/usePhotoGallery';

import MunicipioModel from '../../models/Municipio';

import LocalidadModel from '../../models/Localidad';


import Reporte from '../../class/Reporte';

import OptionsMunicipios from '../Municipios/MunicipiosOptions';

import OptionsLocalidades from '../Localidades/LocalidadesOptions';

import Map from '../Maps/UbicacionActual';

let reporte = new Reporte();

let configApp = new Config();

let UrlService = configApp.getUrlServiceHost();


let cliente = new Cliente();

let datos_cliente = cliente.getData();

const Reportes: React.FC = () => {

  var [reportesList, setReportesList] = useState(Array<ModelReporte>());

  const name = "Nuevo Reporte";
  const mapUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBA4oo4JJFkkj6Du2rKfs2o2FHQRXaP8YA';
  var [municipiosList, setMunicipiosList] = useState(Array<MunicipioModel>());
  var [localidadesList, setLocalidadesList] = useState(Array<LocalidadModel>());
  var [municipioSelected , setMunicipioSelected] = useState<string>("");
  var [ubicacionActual , setUbicacionActual] = useState<string>(" Seleccione");
  var [IDBusquedaLocalidad, setIDBusquedaLocalidad] = useState<void>();
  var [paramLocalidad, setParamLocalidad] = useState<string>("");
  var [localidadSelected , setLocalidadSelected] = useState<void>();
  const [showModalAddReporte, setShowModalAddReporte] = useState(false);
  const [showModalLocalidades, setShowModalLocalidades] = useState(false);
  const [showModalUbicacion, setShowModalUbicacion] = useState(false);
  const [showModalCamara, setShowModalCamara] = useState(false);
  const [submitting , setSubmitting] = useState<boolean>(false);
  const [iserror, setIserror] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const { takePhoto , photos } = usePhotoGallery();

  const [asunto , setAsunto ] = useState<string>("");
  const [colonia , setColonia ] = useState<string>("");
  const [direccion , setDireccion ] = useState<string>("");

  const [isOpenCerrarReporte , setIsOpenCerrarReporte] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText , setLoadingText] = useState<string>("");

  var ReporteData = reporte.getData();

  let token =  datos_cliente.token;

  // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  const optionsAxios = {
    headers : {
      'Content-Type': 'application/json',
      // Authorization: "Bearer " + token, 
    }
  }

  const headers = {
    //  Authorization: "Bearer " + token,
    'Content-Type': 'application/json',
    //  Authorization: "Bearer " + token
  };

  useEffect(() => {

    const getMunicipios = async () => {

      let municipiosArray : Array<MunicipioModel> = [];
        
      const dataAccount = {
          "usuario_id": storage( "ID_USER")
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

     const getReportes = async () => {
        let reportesArray : Array<ModelReporte> = [];
    
        const dataAccount = {
            "usuario_id": storage( "ID_USER")
        }

        setLoadingText("Cargando reportes...");
        setIsLoading(true);

        axios.post( UrlService +"api/Reportes/getReportes", dataAccount , {headers})
          .then(( response : AxiosResponse )  => {    
            setIsLoading(false);
            response.data.result.forEach((item:any)=>{
                reportesArray.push({
                    id : item.id,
                    numero_reporte : item.numero_reporte,
                    co_usuario_id : item.co_usuario_id,
                    fecha_reporte : item.fecha_reporte,
                    direccion : item.direccion,
                    cat_municipio : item.cat_municipio,
                    colonia : item.colonia,
                    asunto : item.asunto,
                    latitud : item.latitud,
                    longitud : item.longitud,
                    coordenadas : item.coordenadas,
                    cat_estatus_reporte : item.cat_estatus_reporte,
                    activo : item.activo,
                    created : item.created,
                    modified : item.modified,
                    cat_localidade : item.cat_localidade,
                    co_usuario : item.co_usuario,
                    fotos : item.fotos[0]
                });
            })
            setReportesList(reportesArray);
          })
     }
     getMunicipios();
     getReportes();
     LocalidadSelected();
  } , [ setReportesList , setMunicipiosList , setLocalidadSelected , photos ])

  const getLocalidades = async () => {

    let localidadesArray : Array<LocalidadModel> = [];
    
    const dataAccountBusqueda = {
        "usuario_id": storage( "ID_USER"),
        "b" : paramLocalidad
    }

    axios.post( UrlService + "api/Localidades/getLocalidades/" + municipioSelected, dataAccountBusqueda , {headers})
      .then(( response : AxiosResponse )  => {    
         response.data.result.forEach((item:any)=>{
          localidadesArray.push({
              id : item.id,
              cat_municipios_id : item.cat_municipios_id,
              nombre : item.nombre,
              activo : item.activo,
              created : item.created,
              modified : item.modified
            });
         })
         setLocalidadesList(localidadesArray);
    })
  }


  const changeMunicipio = ( event : any) => {
    var idMunicipio = event.target.value;
    reporte.setMunicipio(idMunicipio);
    storage("localidadNombreSelected", "Seleccione");
    setMunicipioSelected(idMunicipio);
    setLocalidadesList([]);
  }
  

  const searchLocalidad = (event : any) => {
    var busqueda = event.target.value;
    setParamLocalidad(busqueda);
    getLocalidades();
  }

  const openCamera = () => {
    const foto = takePhoto();
  }

  const LocalidadSelected = () => {
    getLocalidadPreview();
    return(
     <div> { localidadSelected } </div>
    );
  }

  const getLocalidadPreview = () => {
    var localidad = storage("localidadNombreSelected") ;
    setLocalidadSelected( localidad );
  }

  const GetUbicacionActual = () => {
    return <div> { ubicacionActual } </div>
  }

  const onClicUbication = () => {
    setShowModalUbicacion(true);
    setUbicacionActual("Ubicación Actual");
  }


  //*** METODOS DE GUARDADO */

  const saveAsunto = ( event : any ) => {
    var asunto = event.target.value;
    reporte.setAsunto( asunto);
  }

  const saveColonia = ( event : any ) => {
    var colonia = event.target.value;
    reporte.setColonia(colonia);
  }

  const saveDireccion = ( event : any ) => {
    var direccion = event.target.value;
    reporte.setDireccion(direccion);
  }

  /*** ENVIO DE REPORTE */

  const sendReporte = () => {

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    setSubmitting(true);

    var dataReporte = reporte.getData();

    const dataAccountBusqueda = {
      "co_usuario_id":  storage( "ID_USER"),
      "asunto" : dataReporte.asunto,
      "cat_municipio_id" : dataReporte.municipio, 
      "cat_localidad_id"  : dataReporte.localidad,
      "colonia" :  dataReporte.colonia,
      "direccion" : dataReporte.direccion,
      "latitud" :  dataReporte.ubicacion_lat,
      "longitud" :  dataReporte.ubicacion_lng,
      "files" : photos,
      "fecha_reporte" : "",
      "cat_estatus_reporte_id" : "7ba2cd98-f1f8-44e5-ba48-0818dc028d88",
      "numero_reporte" : "25695412"
    }

    console.log(dataAccountBusqueda);

    axios.post( UrlService + "api/Reportes/add" , dataAccountBusqueda , { headers })
      .then(( response : AxiosResponse )  => {    

          const headers = {
            'Content-Type': 'application/json'
          };

          let reportesArray : Array<ModelReporte> = [];
      
          const dataAccount = {
              "usuario_id":storage( "ID_USER")
          }
          setSubmitting(false);
          setLoadingText("Actualizando...");
          setIsLoading(true);
        
          axios.post( UrlService +"api/Reportes/getReportes", dataAccount , {headers})
            .then(( response : AxiosResponse )  => {    
              setIsLoading(false);
              response.data.result.forEach((item:any)=>{
                  reportesArray.push({
                      id : item.id,
                      numero_reporte : item.numero_reporte,
                      co_usuario_id : item.co_usuario_id,
                      fecha_reporte : item.fecha_reporte,
                      direccion : item.direccion,
                      cat_municipio : item.cat_municipio,
                      colonia : item.colonia,
                      asunto : item.asunto,
                      latitud : item.latitud,
                      longitud : item.longitud,
                      coordenadas : item.coordenadas,
                      cat_estatus_reporte : item.cat_estatus_reporte,
                      activo : item.activo,
                      created : item.created,
                      modified : item.modified,
                      cat_localidade : item.cat_localidade,
                      co_usuario : item.co_usuario,
                      fotos : item.fotos[0]
                  });
              })
              setReportesList(reportesArray);
              setShowModalAddReporte(false);
          })
    })
    .catch ( ( error : AxiosError ) => {
      setSubmitting(false);
      setIserror(true);
      setMessage(error.toString());
    })

  }

  const cerrarReporteNuevo = () => {
    setIsOpenCerrarReporte(true);
  }

  return (
    <IonPage>
      <IonHeader>
        <BarraTop></BarraTop>
      </IonHeader>
      <IonContent fullscreen>
        <IonTitle id="titlePage">Reportes</IonTitle>
        {/* Area de reportes */}
         <div id="areaReportes" style={{ padding : "10px" }}>
            { reportesList.length > 0 && reportesList.map((item:ReporteModel, index:number) => {
              return(
                <ReporteCard key={index} reporte={item}></ReporteCard>
              );
            })}
         </div>
        {/* End:: Area de reportes */}
        {/*--------------------------> MODALES DE PRIMER NIVEL <-------------------- */}
        {/* MODAL NUEVO REPORTE*/}

        {/* ION LOADING */}
        <IonLoading
        isOpen = { submitting }
        message = "Guardando reporte"
        ></IonLoading>
         <IonLoading
            isOpen = { isLoading }
            message = { loadingText }
        ></IonLoading>

        <IonAlert
            isOpen={iserror}
            onDidDismiss={() => setIserror(false)}
            cssClass="my-custom-class"
            header={"Ocurrio un error al guardar"}
            message={message}
            buttons={["Reintentar"]}
        />

        <IonAlert
            isOpen={isOpenCerrarReporte}
            onDidDismiss={() => setIsOpenCerrarReporte(false)}
            cssClass='my-custom-class'
            header={'Cerrar reporte'}
            message={'¿Desea cancelar el nuevo reporte?'}
            buttons={[
              {
                text: 'Cancelar',
                role: 'cancel',
                cssClass: 'secondary',
                handler: blah => {
                  setIsOpenCerrarReporte(false)
                }
              },
              {
                text: 'Aceptar',
                handler: () => {
                  setShowModalAddReporte(false);
                  reporte.clean_data();
                  setAsunto("");
                  setColonia("");
                  setDireccion("");
                  setLocalidadesList([]);
                  setUbicacionActual(" Seleccione");
                  setLocalidadSelected();
                  photos.pop();
                  photos.pop();
                  photos.pop();
                  photos.pop();
                }
              }
            ]}
        />

        <div>
          {/*-- Boton fab para el registro de reportes --*/}
          <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ position : "fixed" }}>
              <IonFabButton id="btnFab" color="primary" onClick={() => setShowModalAddReporte(true)} >
                <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>
            {/*-- End::Boton fab para el registro de reportes --*/}
          <IonModal isOpen={showModalAddReporte} cssClass='my-custom-class'>
            <IonHeader>
              <IonToolbar>
                <IonTitle> <IonIcon onClick={() => cerrarReporteNuevo()} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Nuevo Reporte</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={ sendReporte }  ><span style={{  color: "#03a4d0" }}>Enviar</span></IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              
            <div  style={{ padding : "15px" }}>
                <IonList>
                    <IonItem>
                        <IonLabel position="floating">Asunto</IonLabel>
                        <IonTextarea rows={ 5 } onIonChange={ saveAsunto } value={ ReporteData.asunto == null ? "" : ReporteData.asunto + "" } ></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Municipio</IonLabel>
                        <IonSelect okText="Aceptar" cancelText="Cancelar" onIonChange={ changeMunicipio }>
                          { municipiosList.length > 0 && municipiosList.map((item:MunicipioModel, index:number) => {
                              return(
                              <OptionsMunicipios key={index} reporte={item}></OptionsMunicipios>
                              );
                          })}
                        </IonSelect>
                    </IonItem>
                    <IonItem onClick={() => setShowModalLocalidades(true)}>
                        <IonLabel>Localidad</IonLabel>
                        <div > <LocalidadSelected></LocalidadSelected> </div>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Ubicación</IonLabel>
                        <div onClick={ onClicUbication }> <GetUbicacionActual></GetUbicacionActual> </div>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Colonia</IonLabel>
                        <IonTextarea onIonChange={ saveColonia } rows={ 5 } value={ ReporteData.colonia == null ? ""  :  ReporteData.colonia + "" }></IonTextarea>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Dirección</IonLabel>
                        <IonTextarea onIonChange={ saveDireccion } rows={ 5 } value={ ReporteData.direccion == null ? "" :ReporteData.direccion + ""  }></IonTextarea>
                    </IonItem>
                </IonList>
                <IonTitle id="titlePage">Imágenes { photos.length }/4 </IonTitle>
                <div>
                  { photos.length > 0 ? 
                    <IonSlides>
                        {photos.map((photo, index) => ( 
                            <IonSlide>
                                <div className="slide" style={{  }}>
                                    <IonImg style={{ height : "250px" , width : "100%" , objectFit : "cover"}} src={"data:image/png;base64," + photo.webviewPath} />
                                    {/* <p>Toca para ver la imágen </p> */}
                                </div>
                            </IonSlide>
                        
                        ))}
                    </IonSlides>
                    : ""}
              </div>
                {/*-- Boton fab para tomar foto --*/}
                {photos.length < 4 ?
                    <IonFab vertical="bottom" horizontal="end" style={{ position : "fixed" }} slot="fixed" >
                        <IonFabButton id="btnFab" color="primary" onClick={ openCamera } >
                            <IonIcon icon={camera} />
                        </IonFabButton>
                    </IonFab>
                : "" }
                {/*-- End::Boton fab para tomar foto --*/}
                {/* MODAL LOCALIDADES */}
                <IonModal isOpen={showModalLocalidades} cssClass='my-custom-class'>
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle> <IonIcon onClick={() => setShowModalLocalidades(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Selecciona una localidad</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={() => setShowModalLocalidades(false)} ><span style={{  color: "#03a4d0" }}>Listo</span></IonButton>
                      </IonButtons>
                  </IonToolbar>
                  </IonHeader>
                  <IonContent>
                    <br/>
                    <IonSearchbar placeholder="Búsqueda" onIonChange={ searchLocalidad }></IonSearchbar>
                      <IonList id="ionListLocalidades">
                        <IonRadioGroup allowEmptySelection>
                          { localidadesList.length > 0 && localidadesList.map((item:LocalidadModel, index:number) => {
                            return ( <OptionsLocalidades key={index} localidad={item} ></OptionsLocalidades> );
                          })}
                        </IonRadioGroup>
                      </IonList>
                  </IonContent>
                </IonModal>
                {/* END::MODAL LOCALIDADES */}
                  {/* MODAL UBICACION */}
                  <IonModal isOpen={showModalUbicacion} cssClass='my-custom-class'>
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle>Ubicación</IonTitle>
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
                {/* END::MODAL UBICACION */}
                  {/* MODAL CAMARA */}
                  <IonModal isOpen={showModalCamara} cssClass='my-custom-class'>
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle>Agregar imágenes</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={() => setShowModalCamara(false)}>Cerrar</IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent>

                  </IonContent>
                </IonModal>
                {/* END::MODAL CAMARA */}
            </div>
            </IonContent>
          </IonModal>
        </div>
        {/* MODAL NUEVO REPORTE END:: */}
      </IonContent>
   </IonPage>
  );
};

export default Reportes;