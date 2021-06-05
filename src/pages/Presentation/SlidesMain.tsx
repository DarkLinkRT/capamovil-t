import { IonReactRouter } from '@ionic/react-router';
import { Route , Switch } from 'react-router-dom';

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
import '../../theme/variables.css';
import '../../theme/global.css';

/**Scripts addicionals*/

import storage from 'local-storage';


import { Plugins , PushNotification, PushNotificationToken , PushNotificationActionPerformed  } from '@capacitor/core';

import { IonContent, IonSlide, IonSlides } from '@ionic/react';

const { LocalNotifications , BackgroundTask , App , PushNotifications  } = Plugins;

const Presentation: React.FC = () => {

  return (
    <IonReactRouter>
        <IonContent fullscreen>
            <IonSlides>

                <IonSlide>
                    
                </IonSlide>

            </IonSlides>
        </IonContent>
    </IonReactRouter>
  );

};

export default Presentation;
