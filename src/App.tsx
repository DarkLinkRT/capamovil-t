import { IonReactRouter } from '@ionic/react-router';
import { Route , Switch } from 'react-router-dom';
import LayoutDefault from './components/Layouts/Default';
import LayoutLogin from './components/Layouts/Login';
import Presentation from './pages/Presentation/SlidesMain'

import React, { useState , useEffect , Fragment  } 
from 'react';

import axios , {AxiosError, AxiosResponse} 
from "axios";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';

/**Scripts addicionals*/

import storage from 'local-storage';


import { Plugins , PushNotification, PushNotificationToken , PushNotificationActionPerformed  } from '@capacitor/core';

import Config from './class/Config';
import { IonContent, IonSlide, IonSlides } from '@ionic/react';

let configApp = new Config();

let UrlService = configApp.getUrlServiceHost();

const { LocalNotifications , BackgroundTask , App , PushNotifications  } = Plugins;

const Apps: React.FC = () => {

  var [isLogin, setIsLogin] = useState<Boolean>();
  var [isEmptyLayout, setIsEmptyLayout] = useState<Boolean>();

  useEffect(() => {

  })

  App.addListener('appStateChange', (state) => {

    if (!state.isActive) {
      // The app has become inactive. We should check if we have some work left to do, and, if so,
      // execute a background task that will allow us to finish that work before the OS
      // suspends or terminates our app:
  
      let taskId = BackgroundTask.beforeExit(async () => {
        // In this function We might finish an upload, let a network request
        // finish, persist some data, or perform some other task
  
        // Example of long task
        var start = new Date().getTime();
        // for (var i = 0; i < 1e18; i++) {
        //   if ((new Date().getTime() - start) > 20000){
            if(storage("NOMBRE_RECORDATORIO") + "" != null && storage("IMPORTE_RECORDATORIO") + "" != null){
              const notifs = await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "Hola " +  storage("NOMBRE_RECORDATORIO"),
                    body: "Te recordamos que tu fecha de pago es el " +  storage("FECHA_LIMITE_RECORDATORIO") + " con un importe de $" +  storage("IMPORTE_RECORDATORIO"),
                    id: 1,
                    schedule: { at: new Date(Date.now() + 1000000 * 20) },
                    // sound: null,
                    // attachments: null,
                    actionTypeId: "",
                    extra: null
                  }
                ]
              });
            }
        //   }
        // }
        // Must call in order to end our task otherwise
        // we risk our app being terminated, and possibly
        // being labeled as impacting battery life
        BackgroundTask.finish({
          taskId
        });
      });
    }
  })

  PushNotifications.requestPermission().then( result => {
    if (result.granted) {
      // Register with Apple / Google to receive push via APNS/FCM
      PushNotifications.register();
    } else {
      // Show some error
    }
  });

  PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
         storage("TOKEN_DEVICE",token.value);
        // console.log(token.value);
        // alert('Push registration success, token: ' + token.value);
      }
    );

     // Some issue with our setup and push will not work
     PushNotifications.addListener('registrationError',
     (error: any) => {
      //  alert('Error on registration: ' + JSON.stringify(error));
     }
   );

   // Show us the notification payload if the app is open on our device
   PushNotifications.addListener('pushNotificationReceived',
     (notification: PushNotification) => {
      //  alert('Push received: ' + JSON.stringify(notification));
     }
   );

   // Method called when tapping on a notification
   PushNotifications.addListener('pushNotificationActionPerformed',
     (notification: PushNotificationActionPerformed) => {
      //  alert('Push action performed: ' + JSON.stringify(notification));
     }
   );

  const toBool = (a : any) => {
    return Boolean(a).valueOf();
  }


  return (
      <IonReactRouter>
        <Switch>
          <Route path={[ "/Pagos" , "/Facturas" , "/Consumo" , "/Reportes" , "/Reportes/Add" ]} 
            component={ LayoutDefault } />
            <Route path={[ "/Login" , "/"]}  component={LayoutLogin}/>
        </Switch>
      </IonReactRouter>
  );
};

export default Apps;
