import { IonModal, IonTitle, IonAlert,  IonHeader, IonButton, IonInput, IonToolbar, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonToggle } 
from '@ionic/react';

import { useLocation } from 'react-router-dom';

import { chevronBackOutline , fingerPrintOutline , fingerPrintSharp ,homeOutline, homeSharp, personOutline, personSharp, cardOutline, cardSharp, bookOutline, bookSharp, informationOutline, informationSharp, documentOutline, documentSharp, logOutOutline, logOutSharp, moonSharp, moonOutline } 
from 'ionicons/icons';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

import Cliente 
from '../class/Cliente';

import Session
from '../class/Session';

import storage from 'local-storage';

import './Menu.css';
import { FormEventHandler, useEffect, useState } from 'react';

let cliente = new Cliente();
let session = new Session();
let finger = FingerprintAIO;
var datos_cliente = cliente.getData()

interface AppPage {
  id : string;
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  redirect : string;
}

var appPages: AppPage[] = [ ];

if(!finger.isAvailable()){
  var appPages: AppPage[] = [ 
      {
        id : "inicio",
        title: 'Inicio',
        url: '/Pagos',
        iosIcon: homeOutline,
        mdIcon: homeSharp,
        redirect : ""
      },
      {
        id : "tarjetas",
        title: 'Medios de Pago',
        url: '/Tarjetas',
        iosIcon: cardOutline,
        mdIcon: cardSharp,
        redirect : ""
      },
      // {
      //   id : "contratar",
      //   title: '¿Cómo Contratar?',
      //   url: '/Contratar',
      //   iosIcon: informationOutline,
      //   mdIcon: informationSharp,
      //   redirect : ""
      // },
      // {
      //   id : "terminos",
      //   title: 'Terminos y Condiciones',
      //   url: '/Terminos',
      //   iosIcon: documentOutline,
      //   mdIcon: documentSharp,
      //   redirect : ""
      // },
      {
        id : "cerrarsesion",
        title: 'Cerrar Sesión',
        url: '/Login',
        iosIcon: logOutOutline,
        mdIcon: logOutSharp,
        redirect : "/Login"
      }
  ];
} else{
  var appPages: AppPage[] = [ 
    {
      id : "inicio",
      title: 'Inicio',
      url: '/Pagos',
      iosIcon: homeOutline,
      mdIcon: homeSharp,
      redirect : ""
    },
    {
      id : "tarjetas",
      title: 'Medios de Pago',
      url: '/Tarjetas',
      iosIcon: cardOutline,
      mdIcon: cardSharp,
      redirect : ""
    },
    {
      id : "fingerprint",
      title: 'Configurar Huella',
      url: '/Huella',
      iosIcon: fingerPrintOutline,
      mdIcon: fingerPrintSharp,
      redirect : ""
    },
    // {
    //   id : "contratar",
    //   title: '¿Cómo Contratar?',
    //   url: '/Contratar',
    //   iosIcon: informationOutline,
    //   mdIcon: informationSharp,
    //   redirect : ""
    // },
    // {
    //   id : "terminos",
    //   title: 'Terminos y Condiciones',
    //   url: '/Terminos',
    //   iosIcon: documentOutline,
    //   mdIcon: documentSharp,
    //   redirect : ""
    // },
    {
      id : "cerrarsesion",
      title: 'Cerrar Sesión',
      url: '/Login',
      iosIcon: logOutOutline,
      mdIcon: logOutSharp,
      redirect : "/Login"
    }
  ];
}

 


const Menu: React.FC = () => {

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  var [isDark , setDark] = useState<boolean>(false);
  const location = useLocation();

  const [modalTarjetas, setModalTarjetas] = useState(false);

  const [modalFingerPrint, setModalFingerPrint] = useState(false);
  const [isCheckedHuella , setIsCheckedHuella ] = useState(false);

  const [isOpenAlertHuella , setIsOpenAlertHuella ] = useState(false);

  const [isOpenAlert , setIsOpenAlert] = useState(false);
  const [headerAlert , setHeaderAlert] = useState("");
  const [messageAlert , setMessageAlert] = useState("");
  const [buttonAlertText , setButtonAlertText] = useState("");

  const [nombreUserMenu , setNombreUserMenu] = useState("");
  const [correoUserMenu , setCorreoUserMenu] = useState("");
  
  useEffect(() => {
      setDark( toBool(session.getDarkMode()) );
      setNombreUserMenu(storage("NOMBRE_USER") + "");
      setCorreoUserMenu(storage("CORREO_USER") + "");
      if( toBool( session.getIsFingerPrintUM() ) ){
          if( storage("ID_USER") == session.getIdMasterU() ) {
            setIsCheckedHuella(true);
          }
      }
  })

  const toBool = (a : any) => {
    return Boolean(a).valueOf();
  }

  const changeTheme = (event : any) => {
    document.body.classList.toggle('dark');
    if(event.detail.checked){
      setDark(true);
      session.setDarkMode(true);
    } else{
      setDark(false);
      session.setDarkMode(false);
    }
  }

  const setupHuella = ( event : any) => {
    if(event.detail.checked){
        finger.show({
          title: 'Huella digital', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
          subtitle: 'Coloca tu huella en el sensor', // (Android Only) | optional | Default: null
          description: 'Primero debes autenticarte', // optional | Default: null
          fallbackButtonTitle: 'Cancelar', // optional | When disableBackup is false defaults to "Use Pin".
                                            // When disableBackup is true defaults to "Cancel"
          disableBackup:true,  // optional | default: false
        })
      .then((result: any) => {
        successSaveHuella();
      })
      .catch((error: any) => { 
        failedSaveHuella();
       });
    } else{
      setIsCheckedHuella(false);
      session.setIsFingerPrintUserMaster(false);
      session.setIdMasterUser("");
      session.setLoginMU("");
      session.setPasswordMU("");
    }
  }

  const successSaveHuella = () => {
    if( toBool( session.getIsFingerPrintUM()) && session.getIdMasterU() != storage("ID_USER") ){
        setIsOpenAlertHuella(true);
    } else{
      setIsCheckedHuella(true);
      session.setIsFingerPrintUserMaster(true);
      session.setIdMasterUser( storage("ID_USER") + "");
      session.setLoginMU(storage("LOGIN_USER") + "");
      session.setPasswordMU(storage("PASSWORD_USER") + "");
      storage("NOMBRE_UM", storage("NOMBRE_USER") + " " + storage("PATERNO_USER"));
    }
  }

  const failedSaveHuella = () => {
    if(isCheckedHuella){
      setIsCheckedHuella(false);
      setHeaderAlert("Error de autenticación");
      setMessageAlert("No se reconocio la huella digital, intente de nuevo");
      setButtonAlertText("Reintentar");
      setIsOpenAlert(true);
    } else{
      setHeaderAlert("Error al detectar el lector de huellas");
      setMessageAlert("Parece que esta opción no esta soportada para tu dispostivo");
      setButtonAlertText("Aceptar");
      setIsOpenAlert(true);
      setIsCheckedHuella(false);
    }

  }

  const logOut = () => {
    cliente.clean_data()
    //session.clean_data();
    window.location.href = '/Login';
  }
  
  
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonAlert
              isOpen={isOpenAlert}
              onDidDismiss={() => setIsOpenAlert(false)}
              cssClass="my-custom-class"
              header={headerAlert}
              message={messageAlert}
              buttons={[buttonAlertText]}
          />
        <IonAlert
          isOpen={isOpenAlertHuella}
          onDidDismiss={() => setIsOpenAlertHuella(false)}
          cssClass='my-custom-class'
          header={'AVISO'}
          message={'Por motivos de seguridad, esta opción solo puede ser activada por un usuario, si la activas, se desactivará automaticamente el acceso por huella del usuario que actualmente la esta usuando. ¿Deseas proceder con la configuración?'}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: blah => {
                setIsOpenAlertHuella(false);
                session.clean_data();
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                setIsCheckedHuella(true);
                session.setIsFingerPrintUserMaster(true);
                session.setIdMasterUser( storage("ID_USER") + "");
                session.setLoginMU(storage("LOGIN_USER") + "");
                session.setPasswordMU(storage("PASSWORD_USER") + "");
                storage("NOMBRE_UM", storage("NOMBRE_USER") + " " + storage("PATERNO_USER"));
              }
            }
          ]}
        />
        <IonList id="inbox-list">
          <IonListHeader>{ nombreUserMenu }</IonListHeader>
          <IonNote>{ correoUserMenu }</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                { appPage.id == "cerrarsesion" ?
                    <IonItem className={location.pathname === appPage.url ? 'selected' : ''} onClick={logOut} routerDirection="none" lines="none" detail={false}>
                      <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                      <IonLabel>{appPage.title}</IonLabel>
                    </IonItem>
                : appPage.id == "fingerprint" ?
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''}  onClick={ () => { setModalFingerPrint(true) } }  routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                : appPage.id == "tarjetas" ?
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''}  onClick={ () => { setModalTarjetas(true) } }  routerDirection="none" lines="none" detail={false}>
                  <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
                :
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                }
              </IonMenuToggle>
            );
          })}
        </IonList>

        <IonList id="labels-list">
          <IonListHeader>Tema</IonListHeader>
          <IonItem lines="full">
            <IonIcon slot="start" ios={moonOutline} md={moonSharp}></IonIcon>
              <IonLabel>
                Modo Oscuro
              </IonLabel>
            <IonToggle checked={ isDark } id="themeToggle" onIonChange={changeTheme} slot="end"></IonToggle>
          </IonItem>
        </IonList>

        {/* SECCION DE MODALES */}
         {/* Modal para introducir la nueva contraseña */}
         <IonModal isOpen={modalFingerPrint} cssClass='my-custom-class'>
            <IonHeader>
              <IonToolbar>
                <IonTitle> <IonIcon onClick={() => setModalFingerPrint(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
               <div style={{ textAlign : "center" }}>
                 <br/>
                  <IonTitle id="titlePage">Inicio por huella digital</IonTitle>
                  <div style={{ padding : "10px" }}>
                    <span>¡Cuidado! Si configuraste huellas digitales adicionales a las tuyas, la persona agregada podrá acceder a la información de tu cuenta de la aplicación, una vez que ingrese su huella.</span>
                    <br/>
                    <br/>
                    <br/>
                    <IonItem lines="full">
                      <IonIcon slot="start" ios={fingerPrintSharp} md={fingerPrintSharp}></IonIcon>
                        <IonLabel>
                          Huella Digital
                        </IonLabel>
                      <IonToggle checked={ isCheckedHuella } onIonChange={setupHuella} slot="end"></IonToggle>
                    </IonItem>
                  </div>
               </div>
            </IonContent>
          </IonModal>
          {/* end:: modal */}
          {/* Modal de tarjetas */}
            <IonModal isOpen={modalTarjetas} cssClass='my-custom-class'>
                <IonHeader>
                <IonToolbar>
                    <IonTitle> <IonIcon onClick={() => setModalTarjetas(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon> Tarjetas </IonTitle>
                </IonToolbar>
                </IonHeader>
                <IonContent>

                </IonContent>
            </IonModal>
           {/* End::Modal de tarjetas */}

      </IonContent>
    </IonMenu>
  );
};


export default Menu;
