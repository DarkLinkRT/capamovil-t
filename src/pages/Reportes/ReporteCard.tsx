import {IonContent, IonSlides , IonItem , IonLabel, IonTextarea,  IonSlide, IonImg ,IonHeader, IonPage, IonTitle , IonFab, IonFabButton, IonIcon ,  IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent , IonModal , IonToolbar} 
from '@ionic/react';
import { useState } from 'react';

import ModelReporte
from '../../models/Reporte';

import axios , {AxiosResponse , AxiosError} 
from "axios";

import Config from '../../class/Config';

import { chevronBackOutline , fingerPrintOutline , fingerPrintSharp ,homeOutline, homeSharp, personOutline, personSharp, cardOutline, cardSharp, bookOutline, bookSharp, informationOutline, informationSharp, documentOutline, documentSharp, logOutOutline, logOutSharp, moonSharp, moonOutline } 
from 'ionicons/icons';

let configApp = new Config();

let UrlService = configApp.getUrlServiceHost();

interface PropTypes{
    reporte : ModelReporte
}

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

const ReporteCard = (props : PropTypes) => {

    const [openReporte , setOpenReporte] = useState(false);

    const [asunto , setAsunto] = useState<string>("");
    const [status , setStatus] = useState<string>("");
    const [municipio , setMunicipio] = useState<string>("");
    const [localidad , setLocalidad] = useState<string>("");
    const [colonia , setColonia] = useState<string>("");
    const [direccion , setDireccion] = useState<string>("");
    const [observaciones , setObservaciones] = useState(Array<ObservacionModel>());
    const [fotos, setFotos] = useState(Array<FotoModel>());

    const headers = {
      'Content-Type': 'application/json',
    };

    const formatDateReport = (date : string) => {
      var fecha_alterada = "";
      var fecha_array = date.split("T");
      var fecha_arrayn = fecha_array[0].split("-");
      var dia = fecha_arrayn[2];
      var mes = fecha_arrayn[1];
      var anio = fecha_arrayn[0];
      if( mes == "01"){ mes = "Enero"; }
      if( mes == "02"){ mes = "Febrero"; }
      if( mes == "03"){ mes = "Marzo"; }
      if( mes == "04"){ mes = "Abril"; }
      if( mes == "05"){ mes = "Mayo"; }
      if( mes == "06"){ mes = "Junio"; }
      if( mes == "07"){ mes = "Julio"; }
      if( mes == "08"){ mes = "Agosto"; }
      if( mes == "09"){ mes = "Septiembre"; }
      if( mes == "10"){ mes = "Octubre"; }
      if( mes == "11"){ mes = "Noviembre"; }
      if( mes == "12"){ mes = "Diciembre"; }
      fecha_alterada = dia + " de " + mes + " del " + anio
      return fecha_alterada;
    }

    const abrirReporte = ( id : string) => {
      setOpenReporte(true);
      let observacionesArray : Array<ObservacionModel> = [];
      let fotosArray : Array<FotoModel> = [];
      axios.post( UrlService + "api/Reportes/getReporte/" +  id , {} , {headers})
      .then(( response : AxiosResponse )  => {    
         setAsunto(response.data.result.reporte.asunto);
         setMunicipio(response.data.result.reporte.cat_municipio.name);
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

    return(
       <div>
          <IonCard onClick={ () =>  abrirReporte(props.reporte.id) } style={{  }}>
          <img className="imgReportPreview" src={ props.reporte.fotos?.ruta }/>
          <IonCardHeader>
            <IonCardSubtitle id=""> { formatDateReport(props.reporte.fecha_reporte) } </IonCardSubtitle>
            <IonCardTitle  id="">{ props.reporte.cat_localidade.nombre } , { props.reporte.cat_municipio.name }</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
           <div>
             { props.reporte.asunto }
           </div>
          </IonCardContent>
        </IonCard>
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
                        <div>{ municipio }</div>
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
       </div>
    );
}

export default ReporteCard;