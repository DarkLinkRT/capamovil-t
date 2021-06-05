import { IonRouterOutlet, IonIcon, IonLabel,IonTabBar,IonTabButton, IonTabs , IonMenuButton} 
from '@ionic/react';

import { IonReactRouter } 
from '@ionic/react-router';

import { Route } from 'react-router-dom';

// @ts-ignore
import Helmet from 'react-helmet';

import { cashSharp, walletSharp, speedometerSharp, albumsSharp , menuOutline } 
from 'ionicons/icons';

import Menu from '../../components/Menu';
import Page from '../../pages/Page';
import Pagos from '../../pages/Pagos/Pagos';
import Facturas from '../../pages/Facturas/Facturas';
import Consumo from '../../pages/Consumo/Consumo';
import Reportes from '../../pages/Reportes/Reportes';

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

const LayoutDefault: React.FC = () => {

  return (
      <IonReactRouter>
         <Menu />
           <IonTabs>
          <IonRouterOutlet id="main">
            <Route path="/page/:name" exact={true} component={ Page }></Route>
            <Route path="/Pagos" component={ Pagos }></Route>
            <Route path="/Facturas" component={ Facturas }></Route>
            <Route path="/Consumo" component={ Consumo }></Route>
            <Route path="/Reportes" component={ Reportes }></Route>
          </IonRouterOutlet>
           {/* TABS */}
          <IonTabBar slot="bottom" id="tabBarBottom">
            <IonTabButton tab="Menu">
              {/* <IonIcon icon={menuOutline} /> */}
              {/* <IonLabel>Menú</IonLabel> */}
              <IonMenuButton id="menuBtn" />
            </IonTabButton>
            <IonTabButton tab="Pagos" href="/Pagos">
              <IonIcon icon={cashSharp} />
              {/* <IonLabel>Pagos</IonLabel> */}
            </IonTabButton>
            <IonTabButton tab="Facturas" href="/Facturas">
              <IonIcon icon={walletSharp} />
              {/* <IonLabel>Facturas</IonLabel> */}
            </IonTabButton>
            <IonTabButton tab="Consumo" href="/Consumo">
              <IonIcon icon={speedometerSharp} />
              {/* <IonLabel>Consumo</IonLabel> */}
            </IonTabButton>
            <IonTabButton tab="Reportes" href="/Reportes">
              <IonIcon icon={albumsSharp} />
              {/* <IonLabel>Reportes</IonLabel> */}
            </IonTabButton>
          </IonTabBar>
          </IonTabs>
           {/** END::TABS */}
            <>
              <Helmet>
                <script src="scripts/theme.js" type="text/javascript" />
              </Helmet>
            </>
      </IonReactRouter>
  );
};

export default LayoutDefault;