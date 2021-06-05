import storage 
from 'local-storage';

export default class Reporte {

    asunto = "";
    municipio = "";
    localidad = "";
    ubicacion_lat = "";
    ubicacion_lng = "";
    colonia = "";
    direccion = "";
    imagenes = [""];

    setAsunto(value : string){
        this.asunto = value;
        storage( "AS_R_asunto", value);
    }

    setMunicipio(value : string){
        this.municipio = value;
        storage( "AS_R_municipio", value);
    }

    setLocalidad(value : string){
        this.localidad = value;
        storage( "AS_R_localidad", value);
    }

    setUbicacionLat(value : string){
        this.ubicacion_lat = value;
        storage( "AS_R_lat", value);
    }

    setUbicacionLng(value : string){
        this.ubicacion_lng = value;
        storage( "AS_R_lng", value);
    }

    setColonia(value : string){
        this.colonia = value;
        storage( "AS_R_colonia", value);
    }

    setDireccion(value : string){
        this.direccion = value;
        storage( "AS_R_direccion", value);
    }

    setImagenes(value : string){
        this.imagenes.push(value);
        storage( "AS_R_imagenes", value);
    }

    getData(){
        return {
          "asunto" : storage( "AS_R_asunto"),
          "municipio" : storage( "AS_R_municipio"),
          "localidad" : storage( "AS_R_localidad"),
          "ubicacion_lat" : storage( "AS_R_lat"),
          "ubicacion_lng" : storage( "AS_R_lng"),
          "colonia" : storage( "AS_R_colonia"),
          "direccion" : storage( "AS_R_direccion"),
          "imagenes" : storage( "AS_R_imagenes")
        }
    }

    clean_data(){
        storage( "AS_R_asunto", "");
        storage( "AS_R_municipio", "");
        storage( "AS_R_localidad", "");
        storage( "AS_R_lat", "");
        storage( "AS_R_lng", "");
        storage( "AS_R_colonia", "");
        storage( "AS_R_direccion", "");
        storage( "AS_R_imagenes", "");
    }

}