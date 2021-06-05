import { IonContent, IonHeader, IonPage, IonTitle , IonProgressBar , IonLoading } 
from '@ionic/react';

import React, { useState , useEffect , Fragment  } 
from 'react';

import Config from '../../class/Config';

import BarraTop 
from '../../components/ToolBarBlue';

import './Consumo.css';

import ModelConsumo from '../../models/Consumo';

import axios , {AxiosResponse} 
from "axios";

let configApp = new Config();
let urlConsumo = configApp.getUrlCapaConsumo();

var Consumos: ModelConsumo[] = [
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"3",
    "lectura":"1305",
    "consumo":"0",
    "total":"19815.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"4",
    "lectura":"1313",
    "consumo":"8",
    "total":"19840.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"5",
    "lectura":"1317",
    "consumo":"4",
    "total":"19864.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"6",
    "lectura":"1325",
    "consumo":"8",
    "total":"19864.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"7",
    "lectura":"1330",
    "consumo":"5",
    "total":"39739.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"8",
    "lectura":"1334",
    "consumo":"4",
    "total":"19864.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"9",
    "lectura":"1337",
    "consumo":"3",
    "total":"19864.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"10",
    "lectura":"1343",
    "consumo":"6",
    "total":"39733.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"11",
    "lectura":"1347",
    "consumo":"4",
    "total":"19864.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2020",
    "mes":"12",
    "lectura":"1349",
    "consumo":"2",
    "total":"39747.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2021",
    "mes":"1",
    "lectura":"1351",
    "consumo":"2",
    "total":"19870.00"
  },
  {
    "no_contrato":"8297",
    "anio":"2021",
    "mes":"2",
    "lectura":"1351",
    "consumo":"0",
    "total":"40527.00"
  }
];

const Consumo: React.FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText , setLoadingText] = useState<string>("");
  const [consumos , setConsumos] = useState(Array<ModelConsumo>());

  const headers = {
    'Content-Type': 'application/json'
  };

  useEffect(() => {

    let consumoArray : Array<ModelConsumo> = [];

    setLoadingText("Cargando...");
    setIsLoading(false);
  
    const dataAccount = {
       "data"  : "true"
    }
  
  },[]);

  return (
    <IonPage>
        <IonLoading
            isOpen = { isLoading }
            message = { loadingText }
        ></IonLoading>
     <IonHeader>
        <BarraTop></BarraTop>
      </IonHeader>
      <IonContent fullscreen>
        <div style={{ padding : "10px" }}>
          <IonTitle id="titlePage">Consumo</IonTitle>
          <br/>
          {Consumos.map((consumo, index) => (
              <div>
                  <span> Promedio de consumo: {consumo.consumo} </span><br/>
                  <small> {consumo.mes == "1" ? "Enero" : consumo.mes == "2" ? "Febrero" : consumo.mes == "3" ? "Marzo" : consumo.mes == "4" ? "Abril" : consumo.mes == "5" ? "Mayo" : consumo.mes == "6" ? "Junio" : consumo.mes == "7" ? "Julio" : consumo.mes == "8" ? "Agosto" : consumo.mes == "9" ? "Septiembre" : consumo.mes == "10" ? "Octubre" : consumo.mes == "11" ? "Noviembre" : consumo.mes == "12" ? "Diciembre" : ""} del { consumo.anio } </small>
                 <IonProgressBar value={ parseFloat("0." + consumo.consumo) }></IonProgressBar><br />  <br/>
              </div>
           ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Consumo;