import { IonToolbar, IonButtons ,IonLoading , IonSelect , IonSlide ,IonFab, IonSlides,  IonFabButton,  IonIcon, IonTitle, IonApp, IonContent, IonPage , IonGrid, IonRow, IonCol , IonItem, IonLabel, IonInput, IonButton, IonAlert, IonModal ,IonHeader} 
from '@ionic/react';

import React, { useState , Component, EventHandler, KeyboardEventHandler, useEffect } 
from 'react';

import { add , duplicateSharp , chevronBackOutline , camera , save , fingerPrintOutline , fingerPrintSharp} 
from 'ionicons/icons';

import storage from 'local-storage';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { Plugins , PushNotification, PushNotificationToken , PushNotificationActionPerformed } from '@capacitor/core';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

import axios ,  {AxiosError, AxiosResponse} 
from "axios";

import { useHistory , Redirect } 
from "react-router-dom";

import './Login.css';

//Importar la clase cliente
import Cliente 
from '../../class/Cliente';

import MunicipioModel from '../../models/Municipio';

import Session from '../../class/Session';

import Config from '../../class/Config';

import  LocalidadCache from '../../class/Localidad';

import OptionsMunicipios from '../Municipios/MunicipiosOptionsOrigen';

let configApp = new Config();
let UrlService = configApp.getUrlServiceHost();

let cacheLocalidad = new LocalidadCache();

let cliente = new Cliente();
let session = new Session();

let finger = FingerprintAIO;


const Login: React.FC = (props) => {

  const history = useHistory();
  const [iserror, setIserror] = useState<boolean>(false);
  const [isErrorRegister, setIsErrorRegister] = useState<boolean>(false);
  const [isSuccessRegister, setIsSuccessRegister] = useState<boolean>(false);
  const [isSendRecovery, setIsSendRecovery] = useState<boolean>(false);
  const [isAlertRecovery, setIsAlertRecovery] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageRegister, setMessageRegister] = useState<string>("");
  const [messageRecovery, setMessageRecovery] = useState<string>("");
  const [messageSuccessRegister, setMessageSuccessRegister] = useState<string>("");
  const [messageSendCode, setMessageSendCode] = useState<string>("");
  const [modalOpenRegistro, setModalOpenRegistro] = useState(false);
  const [modalOpenFinRegistro, setModalFinRegistro] = useState(false);
  const [modalOpenRecoveryAccount, setModalOpenRecoveryAccount] = useState(false);
  const [modalOpenCode, setModalOpenCode] = useState(false);
  const [modalOpenPasswordChange, setModalOpenPasswordChange] = useState(false);
  //VBariables de registro de nuevo usuario
  const [numeroContrato , setNumeroContrato] = useState<string>();
  const [user , setUser] = useState<string>();
  const [password , setPassword] = useState<string>();
  const [confirmPassword , setConfirmPassword] = useState<string>();
  const [email , setEmail] = useState<string>();
  const [municipio , setMunicipio] = useState<string>();
  const [nombre , setNombre] = useState<string>();
  const [paterno , setPaterno] = useState<string>();
  const [materno , setMaterno] = useState<string>();
  //Variables de recuperacion
  const [correoVerificacion , setCorreoVerificacion] = useState<string>();
  const [code , setCode] = useState<string>();

  const [newPassword , setNewPassword] = useState<string>();
  const [repeatNewPassword , setRepeatNewPassword] = useState<string>();
  const [showUIMasterUser, setShowUIMasterUser] = useState<Boolean>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText , setLoadingText] = useState<string>("");

  var [municipiosList, setMunicipiosList] = useState(Array<MunicipioModel>());


  useEffect(() => {
      setShowUIMasterUser( toBool(session.getIsFingerPrintUM()) );

      const getMunicipios = async () => {

        let municipiosArray : Array<MunicipioModel> = [];
          
        const headers = {
          'Content-Type': 'application/json'
        };

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
      getMunicipios();
  },[ setShowUIMasterUser ])

  const handleKeyDown = (event : any) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  }

  const handleLogin = () => {
    
    cacheLocalidad.clean_data();
    
    if (!cliente.getLogin()) {
        setMessage("Introduzca un usuario");
        setIserror(true);
        return;
    }

    const headers = {
      'Content-Type': 'application/json'
    };

    const loginData = {
        "login": cliente.getLogin(),
        "password": cliente.getPassword()
    }

    const dataDevice = {
      "token_device" :  storage("TOKEN_DEVICE")
    }

    const LoginAndToken = {
      "isLogin" : 1 ,
      "token_device" :  storage("TOKEN_DEVICE")
    }

    setLoadingText("Autenticando...");
    setIsLoading(true);

    axios.post( UrlService + "api/co-usuarios/access", loginData, { headers })
        .then(response => {             
            if(response["data"]["success"]){
                axios.post( UrlService + "api/co-usuarios/updateTokenDevice/" + response["data"]["usuario"]["id"], dataDevice, { headers })
                .then(TOKENRESPONSE => {
                  if(TOKENRESPONSE["data"] == 1){
                      axios.post( UrlService + "api/co-usuarios/updateLogIn/" + response["data"]["usuario"]["id"], LoginAndToken , { headers })
                      .then(loginResponse => {
                          if(loginResponse["data"] == 1){
                            session.setIsLogin(true);
                            cliente.setMunicipio(response["data"]["usuario"]["cat_municipios_id"]);
                            cliente.setImagenPerfil(response["data"]["usuario"]["icono_perfil"]);
                            cliente.setToken(response["data"]["token"]);
                            cliente.setEncuesta(response["data"]["usuario"]["encuesta"]);
                            cliente.setCuenta(response["data"]["usuario"]["numero_contrato"]);
                            cliente.setId(response["data"]["usuario"]["id"]);
                            cliente.setCorreo(response["data"]["usuario"]["correo"]);
                            cliente.setDomicilio(response["data"]["usuario"]["domicilio"]);
                            cliente.setNombre(response["data"]["usuario"]["nombre"]);
                            cliente.setPaterno(response["data"]["usuario"]["paterno"]);
                            cliente.setMaterno(response["data"]["usuario"]["materno"]);
                            setIsLoading(false);
                            window.location.href = '/Pagos';
                          } else{
                            setIsLoading(false);
                            setMessage("Ocurrio un error al iniciar sesi??n");
                            setIserror(true)
                          }
                      })
                      .catch(error=>{
                          setIsLoading(false);
                          setMessage("Ocurrio un error al iniciar sesi??n :" + error);
                          setIserror(true)
                       })
                  }
                  else{
                    setIsLoading(false);
                    setMessage("Ocurrio un error al iniciar sesi??n");
                    setIserror(true)
                  }
                })
                .catch(error=>{
                  setIsLoading(false);
                  setMessage("Ocurrio un error al iniciar sesi??n :" + error);
                  setIserror(true)
               })
            } else{
              setIsLoading(false);
              session.setIsLogin(false);
              setMessage("Datos incorrectos");
              setIserror(true)
            }
         })
         .catch(error=>{
            setIsLoading(false);
            setMessage("Ocurrio un error al iniciar sesi??n :" + error);
            setIserror(true)
         })
  };

  const insertNewUser = () => {


    setLoadingText("Validando informaci??n...");
    setIsLoading(true);

    if(showUIMasterUser){
        setUser(session.getLoginUM() + "");
    }

      //Validar que los campos esten seleccionados
      if(user != "" && nombre != "" && paterno != "" && materno != ""){
        if( password != ""){
           if(email != ""){
             if(municipio != ""){

              const datas = {
                "usuario" : user
              }

              const headers = {
                'Content-Type': 'application/json'
              };

              //Validar que el numero de contrato si exista en el municipio selecionado
                axios.post( UrlService + "api/co-usuarios/verifyRealUser/" + municipio + "&" + numeroContrato, datas, { headers })
                  .then(response => {     
                      if(response.data == 1){

                         //Validar que el usuario no este registrado
                          const headers = {
                            'Content-Type': 'application/json'
                          };

                          const data = {
                            "usuario" : user
                          }

                          axios.post( UrlService + "api/co-usuarios/verifyUser/" + user, data, { headers })
                            .then(response => {   
                                        
                                if(response.data == 1){

                                  //Validar que las contrase??as coincidan
                                  if( password == confirmPassword){

                                    //Validar que el correo electr??nico no este registrado
                                    axios.post( UrlService + "api/co-usuarios/verifyMail/" + email, data, { headers })
                                    .then(response => {     
                                      if(response.data == 1){

                                        //Insertar el nuevo usuario

                                        const userData = {
                                          "login" : user,
                                          "password" : password,
                                          "correo" : email,
                                          "cat_municipios_id" : municipio,
                                          "numero_contrato" : numeroContrato,
                                          "co_grupo_id" : "c01cd1fb-6dd6-4767-9540-900098533596",
                                          "nombre" : nombre,
                                          "paterno" : paterno,
                                          "materno" : materno
                                        }

                                        axios.post( UrlService + "api/co-usuarios/addCliente/", userData, { headers })
                                        .then(response => {     

                                            //Ahora verificar que el registro se hizo de manera correcta.. si es asi, mandar al login
                                            if(response.data == 1){
                                              setIsLoading(false);
                                              setMessageSuccessRegister("??Ya casi esta! Revisa tu correo que proporcionaste para activar la cuenta, asegurate de revisar igual en la secci??n de SPAM de tu correo.");
                                              setIsSuccessRegister(true);
                                              setModalOpenRegistro(false);
                                              setModalFinRegistro(false);
                                            } else{
                                              setIsLoading(false);
                                              setMessageRegister("Ocurrio un error al registrarse(" + response.data + ")");
                                              setIsErrorRegister(true)
                                            }

                                        })
                                        .catch(error=>{
                                          setIsLoading(false);
                                          setMessageRegister("Ocurrio un error al conectarse al servidor :" + error);
                                          setIsErrorRegister(true)
                                        })

                                      } else{
                                        setIsLoading(false);
                                        setMessageRegister("El correo electr??nico ya se encuentra registrado.");
                                        setIsErrorRegister(true)
                                      }
                                    })
                                    .catch(error=>{
                                      setIsLoading(false);
                                      setMessageRegister("Ocurrio un error al conectarse al servidor :" + error);
                                      setIsErrorRegister(true)
                                    })

                                  } else{
                                    setIsLoading(false);
                                    setMessageRegister("Las contrase??as no coinciden.");
                                    setIsErrorRegister(true)
                                  }

                                } else{
                                  setIsLoading(false);
                                  setMessageRegister("El nombre de usuario ya existe, elija otro.");
                                  setIsErrorRegister(true)
                                }
                        })
                        .catch(error=>{
                          setIsLoading(false);
                          setMessageRegister("Ocurrio un error al conectarse al servidor :" + error);
                          setIsErrorRegister(true)
                        })



                      } else{
                        setIsLoading(false);
                        setMessageRegister("Parece que el n??mero de contrato no coincide con el municipio seleccionado o mas bien ya se encuentra registrado, revise bien sus datos o inicie sesi??n.");
                        setIsErrorRegister(true)
                      }
                  })
                .catch(error=>{
                  setIsLoading(false);
                  setMessageRegister("Ocurrio un error al conectarse al servidor :" + error);
                  setIsErrorRegister(true)
                })

              

             } else{
              setIsLoading(false);
              setMessageRegister("Seleccione un municipio.");
              setIsErrorRegister(true)
             }
           } else{
            setIsLoading(false);
            setMessageRegister("El correo electr??nico no puede ir vacio.");
            setIsErrorRegister(true)
           }
        } else{
          setIsLoading(false);
          setMessageRegister("La contrase??a no puede estar vacia.");
          setIsErrorRegister(true)
        }
      } else{
        setIsLoading(false);
        setMessageRegister("El nombre de usuario no puede estar vacio.");
        setIsErrorRegister(true)
      }
  }

  const sendCodeRecovery = () => {

    setLoadingText("Enviando...");
    setIsLoading(true);
  
     const headers = {
      'Content-Type': 'application/json'
      };

      const data = {
        "usuario" : ""
      }

      axios.post( UrlService + "api/co-usuarios/sendCodeMail/" + correoVerificacion, data, { headers })
      .then(response => {     

        setIsLoading(false);
        setMessageSendCode("Si el correo que proporcionaste fue correcto, pronto te llegar?? un codig?? de verificaci??n.");
        setIsAlertRecovery(true);
        setModalOpenCode(true);


      }) 
      .catch(error=>{
        setIsLoading(false);
        setMessageRegister("Ocurrio un error al conectarse al servidor :" + error);
        setIsErrorRegister(true)
      })

  }

  const sendCode = () => {
    const headers = {
      'Content-Type': 'application/json'
      };

      const data = {
        "code" : code
      }

      setLoadingText("Enviando...");
      setIsLoading(true);

      axios.post( UrlService + "api/co-usuarios/verifyCode/" + correoVerificacion, data, { headers })
      .then(response => {     
        setIsLoading(false);
       if(response.data == 1){

           setModalOpenPasswordChange(true);

       } else{

          setMessageRegister("Parece que el c??digo no coincide.");
          setIsErrorRegister(true);

       }

      }) 
      .catch(error=>{
        setIsLoading(false);
        setMessageRegister("Ocurrio un error al conectarse al servidor :" + error);
        setIsErrorRegister(true)
      })
  }

  const updatePassword = () => {

    const headers = {
      'Content-Type': 'application/json'
      };

      const data = {
        "code" : code,
        "password" : newPassword
      }

      setLoadingText("Actualizando...");
      setIsLoading(true);

      if(newPassword == repeatNewPassword){
          axios.post( UrlService + "api/co-usuarios/updatePasswordRecovery/" + correoVerificacion, data, { headers })
        .then(response => {     
          setIsLoading(false);
            if(response.data == 1){

                setMessageSendCode("Tu contrase??a ha sido cambiada.");
                setIsAlertRecovery(true);
                setModalOpenPasswordChange(false);
                setModalOpenRecoveryAccount(false);
                setModalOpenCode(false);

            } else{

                setMessageRegister("Parece que el c??digo no coincide.");
                setIsErrorRegister(true);

            }

        }) 
        .catch(error=>{
          setIsLoading(false);
          setMessageRegister("Ocurrio un error al conectarse al servidor :" + error);
          setIsErrorRegister(true)
        })
      }

  }

  const openScanner = async  () => {
    const data = await BarcodeScanner.scan();

    if(data.text.length == 10){
      setNumeroContrato(data.text);
      setModalFinRegistro(true);
    } else{
      setMessageRegister("Parece que esto no es un n??mero de contrato valido, reintente de nuevo.");
      setIsErrorRegister(true);
    }
  }

  const procedLoginWithHuella = () => {
        finger.show({
          title: 'Huella digital', // (Android Only) | optional | Default: "<APP_NAME> Biometric Sign On"
          subtitle: 'Coloca tu huella en el sensor', // (Android Only) | optional | Default: null
          description: 'Primero debes autenticarte', // optional | Default: null
          fallbackButtonTitle: 'Cancelar', // optional | When disableBackup is false defaults to "Use Pin".
                                            // When disableBackup is true defaults to "Cancel"
          disableBackup:true,  // optional | default: false
      })
      .then((result: any) => {
        successHuellaLogin();
      })
      .catch((error: any) => {
        failLoginHuella()
      });
  }

  const successHuellaLogin = () => {
      cliente.setLogin(session.getLoginUM() + "");
      cliente.setPassword(session.getPassUM() + "");
      setUser(session.getLoginUM() + "");
      setPassword(session.getPassUM() + "");
      handleLogin();
  }

  const failLoginHuella = () => {

  }

  const noEsUsuarioMaster = () => {
    setShowUIMasterUser(false);
  }

  const toBool = (a : any) => {
    return Boolean(a).valueOf();
    //return true;
  }

  const setShowPresentattion = () =>{
    storage("SHOWED_APP_PRESENTATION",true);
    window.location.href = '/Login';
  }


  return (
    <IonApp >
      <IonPage>
         { !toBool(storage("SHOWED_APP_PRESENTATION")) ?

          <IonContent  fullscreen className="ion-padding ion-text-center">
             <IonSlides>

                  <IonSlide>
                       <div className="slide">
                        <img src="img/slide-1.png"/>
                        <h2>Hola</h2>
                        <p>La <b>Aplicaci??n M??vil de CAPA</b> tiene como proposito de facilitarte los pagos del servicio.</p>
                      </div>
                  </IonSlide>
                  <IonSlide>
                       <div className="slide">
                        <img src="img/slide-2.png"/>
                        <h2></h2>
                        <p>Podr??s consultar tu  <b>saldo </b> y tu fecha l??mite de pago</p>
                      </div>
                  </IonSlide>
                  <IonSlide>
                       <div className="slide">
                        <img src="img/slide-3.png"/>
                        <h2></h2>
                        <p>Con la aplicaci??n, podras enviar <b>reportes</b> de incidentes o anomal??as del servicio, para que nuestros operadores puedan brindarte una atenci??n.</p>
                      </div>
                  </IonSlide>
                  <IonSlide>
                       <div className="slide">
                        <img src="img/slide-4.png"/>
                        <h2>??Ya esta!</h2>
                        <p>Ahora es momento de que pruebas la <b>aplicaci??n</b>.</p>
                        <IonButton onClick={ setShowPresentattion } color="primary" expand="block">Continuar</IonButton>
                      </div>
                  </IonSlide>

              </IonSlides>
              </IonContent>
          :
        <IonContent  fullscreen className="ion-padding ion-text-center" id="contentMain">

          <IonGrid >
          <IonRow>
            <IonCol>
              <IonAlert
                  isOpen={iserror}
                  onDidDismiss={() => setIserror(false)}
                  cssClass="my-custom-class"
                  header={"??Error en la autenticaci??n!"}
                  message={message}
                  buttons={["Reintentar"]}
              />
            </IonCol>
          </IonRow>
          <IonRow>
          </IonRow>
            <IonRow>
              <IonCol>
              <img id="imgLogo" alt=""/>
              <br/>
              <div className="section mt-1 ">
                  <h1 style={{ color : "white" , fontSize : "34px" , fontWeight : 700}}>Inicia sesi??n para comenzar</h1>
                  { !showUIMasterUser ? 
                    <h4 style={{ color : "white" ,  fontSize : "15px" , fontWeight : 500}}>Introduzca usuario y contrase??a.</h4>
                  :
                    <h4 style={{ color : "white" ,  fontSize : "15px" , fontWeight : 500}}>Hola {  storage("NOMBRE_UM") + ""}, ingresa tu contrase??a para continuar.</h4>
                  }
              </div>
              { !showUIMasterUser ? 
                  <IonItem id="inputLogin">
                    <IonLabel position="floating"> Usuario</IonLabel>
                    <IonInput
                        type="text"
                        value={cliente.getLogin()}
                        onKeyDown={ handleKeyDown }
                        onIonChange={(e) => cliente.setLogin(e.detail.value!)}
                    >
                    </IonInput>
                  </IonItem>
              : "" }
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
              <IonItem  id="inputLogin">
                <IonLabel position="floating"> Contrase??a</IonLabel>
                <IonInput
                  type="password"
                  value={cliente.getPassword()}
                  onKeyDown={ handleKeyDown }
                  onIonChange={(e) => cliente.setPassword(e.detail.value!)}
                  >
                </IonInput>
              </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                { showUIMasterUser  ? 
                  <p style={{ fontSize: "medium" , color : "white"  }}>
                    <a href="#" style={{ color : "white"}} onClick={ () => { noEsUsuarioMaster() } }>  ??No eres  { storage("NOMBRE_UM") + "" } ?  </a>
                  </p>
                : "" }
                <p style={{ fontSize: "small" , color : "white" }}>
                    Al ingresar, aceptas nuestros t??rminos y condiciones <a href="#" style={{ color : "white"}}>Ver T??rminos y Condiciones</a>
                </p>
                <IonButton color="light" expand="block" onClick={handleLogin}>Iniciar Sesi??n</IonButton>
                <p style={{ fontSize: "medium" , color : "white"  }}>
                    ??No tienes una cuenta? <a href="#" style={{ color : "white"}} onClick={ () => { setModalOpenRegistro(true) } }> ??Reg??strate! </a>
                </p>
                <p style={{ fontSize: "medium" , color : "white"  }}>
                  <a href="#" style={{ color : "white"}} onClick={ () => { setModalOpenRecoveryAccount(true) } }>  ??Haz olvidado tu contrase??a?  </a>
                </p>
              </IonCol>
            </IonRow>
            <br/><br/>
          </IonGrid>

          {/*  SECCION DE MODALES */}
            {/*-- Boton fab para login --*/}
              { showUIMasterUser  ? 
              <div>
                <IonFab vertical="bottom" horizontal="end" slot="fixed" style={{ transform : "translateX(-15px) translateY(-15px)" }}>
                  <IonFabButton id="btnFab" color="light" onClick={ procedLoginWithHuella } >
                    <IonIcon icon={fingerPrintSharp} />
                  </IonFabButton>
                </IonFab>
              </div>
              : "" }
            {/*-- End::Boton fab para login --*/}
          {/* MODALES DE REGISTRO DE NUEVOS USUARIOS */}

          <IonAlert
                  isOpen={isErrorRegister}
                  onDidDismiss={() => setIsErrorRegister(false)}
                  cssClass="my-custom-class"
                  header={"Algo salio mal..."}
                  message={messageRegister}
                  buttons={["Reintentar"]}
          />

          <IonAlert
                  isOpen={isSuccessRegister}
                  onDidDismiss={() => setIsSuccessRegister(false)}
                  cssClass="my-custom-class"
                  header={"??Te has registrado correctamente!"}
                  message={messageSuccessRegister}
                  buttons={["Aceptar"]}
          />

          <IonAlert
                  isOpen={isSendRecovery}
                  onDidDismiss={() => setIsSendRecovery(false)}
                  cssClass="my-custom-class"
                  header={"Correo enviado"}
                  message={messageRecovery}
                  buttons={["Aceptar"]}
          />

          <IonAlert
                  isOpen={isAlertRecovery}
                  onDidDismiss={() => setIsAlertRecovery(false)}
                  cssClass="my-custom-class"
                  header={""}
                  message={messageSendCode}
                  buttons={["Aceptar"]}
          />

        <IonLoading
            isOpen = { isLoading }
            message = { loadingText }
        ></IonLoading>

          {/* MODAL DE LECTOR DE CODIGO */}
          <IonModal isOpen={modalOpenRegistro} cssClass='my-custom-class'>
            <IonHeader>
              <IonToolbar>
                <IonTitle> <IonIcon onClick={() => setModalOpenRegistro(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
               <div style={{ textAlign : "center" }}>
                 <br/>
                  <IonTitle id="titlePage">Registro</IonTitle>
                  <div style={{ padding : "10px" }}>
                    <p>Introduzca su n??mero de contrato para continuar</p>
                    <IonItem>
                        <IonLabel position="floating">N??mero de Contrato</IonLabel>
                        <IonInput maxlength={ 10 } readonly value={ numeroContrato } onIonChange={ (e) =>  setNumeroContrato(e.detail.value!) } ></IonInput>
                  </IonItem>
                  <br/><br/>
                  <IonButton onClick={ openScanner } color="primary" expand="block">Escanear N??mero</IonButton>
                  </div>
               </div>
            </IonContent>
          </IonModal>
          {/* MODAL DE REGISTRO */}
          <IonModal isOpen={modalOpenFinRegistro} cssClass='my-custom-class'>
            <IonHeader>
              <IonToolbar>
                <IonTitle> <IonIcon onClick={() => setModalFinRegistro(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
               <div style={{ textAlign : "center" }}>
                 <br/>
                  <IonTitle id="titlePage">Registro</IonTitle>
                  <div style={{ padding : "10px" }}>
                    <span>Complete los datos para continuar</span>
                    <br/>
                    <br/>
                    <br/>
                    <IonItem>
                        <IonLabel position="floating">N??mero de contrato</IonLabel>
                        <IonInput readonly value={ numeroContrato } ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Introduzca un nuevo usuario</IonLabel>
                        <IonInput onIonChange={ (e) =>  setUser(e.detail.value!) } ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Introduzca su Nombre(s)</IonLabel>
                        <IonInput onIonChange={ (e) =>  setNombre(e.detail.value!) } ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Introduzca su apellido paterno</IonLabel>
                        <IonInput onIonChange={ (e) =>  setPaterno(e.detail.value!) } ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Introduzca su apellido materno</IonLabel>
                        <IonInput onIonChange={ (e) =>  setMaterno(e.detail.value!) } ></IonInput>
                    </IonItem>
                    <br/>
                    <IonItem>
                        <IonLabel position="floating">Introduzca una contrase??a</IonLabel>
                        <IonInput  onIonChange={ (e) =>  setPassword(e.detail.value!) } ></IonInput>
                    </IonItem>
                    <br/>
                    <IonItem>
                        <IonLabel position="floating">Introduzca de nuevo su contrase??a</IonLabel>
                        <IonInput  onIonChange={ (e) =>  setConfirmPassword(e.detail.value!) } ></IonInput>
                    </IonItem>
                    <br/>
                    <IonItem>
                        <IonLabel position="floating">Direcci??n de correo electr??nico</IonLabel>
                        <IonInput  onIonChange={ (e) =>  setEmail(e.detail.value!) } ></IonInput>
                    </IonItem>
                    <br/>
                    <IonItem>
                        <IonLabel>Municipio</IonLabel>
                        <IonSelect okText="Aceptar" cancelText="Cancelar" onIonChange={ (e) =>  setMunicipio(e.detail.value) } >
                          { municipiosList.length > 0 && municipiosList.map((item:MunicipioModel, index:number) => {
                              return(
                              <OptionsMunicipios key={index} reporte={item}></OptionsMunicipios>
                              );
                          })}
                        </IonSelect>
                    </IonItem>
                  <br/><br/>
                  <IonButton onClick={ insertNewUser } color="primary" expand="block">Finalizar Registro</IonButton>
                  </div>
               </div>
            </IonContent>
          </IonModal>
          {/* Modal de recuperacion de cuenta */}
          <IonModal isOpen={modalOpenRecoveryAccount} cssClass='my-custom-class'>
            <IonHeader>
              <IonToolbar>
                <IonTitle> <IonIcon onClick={() => setModalOpenRecoveryAccount(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
               <div style={{ textAlign : "center" }}>
                 <br/>
                  <IonTitle id="titlePage">Recuperaci??n</IonTitle>
                  <div style={{ padding : "10px" }}>
                    <span>Si olvid?? su contrase??a, ingrese su correo electr??nico que tiene vinculado a su cuenta.</span>
                    <br/>
                    <br/>
                    <br/>
                    <IonItem>
                        <IonLabel position="floating">Correo</IonLabel>
                        <IonInput onIonChange={ (e) =>  setCorreoVerificacion(e.detail.value!) } ></IonInput>
                    </IonItem>
                  <br/><br/>
                  <IonButton onClick={ sendCodeRecovery } color="primary" expand="block">Enviar c??digo de recuperaci??n</IonButton>
                  </div>
               </div>
            </IonContent>
          </IonModal>
          {/* Modal para introducir el c??digo de verificci??n */}
          <IonModal isOpen={modalOpenCode} cssClass='my-custom-class'>
            <IonHeader>
              <IonToolbar>
                <IonTitle> <IonIcon onClick={() => setModalOpenCode(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
               <div style={{ textAlign : "center" }}>
                 <br/>
                  <IonTitle id="titlePage">C??digo de verificaci??n</IonTitle>
                  <div style={{ padding : "10px" }}>
                    <span>Se envio un c??digo a la direcci??n de correo que proporciono.</span>
                    <br/>
                    <br/>
                    <br/>
                    <IonItem>
                        <IonLabel position="floating">C??digo de verificaci??n</IonLabel>
                        <IonInput onIonChange={ (e) =>  setCode(e.detail.value!) } ></IonInput>
                    </IonItem>
                  <br/><br/>
                  <IonButton onClick={ sendCode } color="primary" expand="block">Enviar c??digo</IonButton>
                  </div>
               </div>
            </IonContent>
          </IonModal>
          {/* Modal para introducir la nueva contrase??a */}
          <IonModal isOpen={modalOpenPasswordChange} cssClass='my-custom-class'>
            <IonHeader>
              <IonToolbar>
                <IonTitle> <IonIcon onClick={() => setModalOpenPasswordChange(false)} style={{ fontSize: "20px" , transform : "translateY(3px) translateX(-5px)" , color: "#03a4d0" }} icon={chevronBackOutline}></IonIcon></IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
               <div style={{ textAlign : "center" }}>
                 <br/>
                  <IonTitle id="titlePage">Nueva contrase??a</IonTitle>
                  <div style={{ padding : "10px" }}>
                    <span>Escribe una nueva contrase??a para tu cuenta.</span>
                    <br/>
                    <br/>
                    <br/>
                    <IonItem>
                        <IonLabel position="floating">Nueva contrase??a</IonLabel>
                        <IonInput onIonChange={ (e) =>  setNewPassword(e.detail.value!) } ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Escribe de nuevo tu nueva contrase??a</IonLabel>
                        <IonInput onIonChange={ (e) =>  setRepeatNewPassword(e.detail.value!) } ></IonInput>
                    </IonItem>
                  <br/><br/>
                  <IonButton onClick={ updatePassword } color="primary" expand="block">Actualizar contrase??a</IonButton>
                  </div>
               </div>
            </IonContent>
          </IonModal>
          {/* END::MODALES  */}
        </IonContent>
         }
      </IonPage>
    </IonApp>
  );
};

export default Login;
