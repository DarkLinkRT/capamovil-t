import storage 
from 'local-storage';

export default class Localidad {

    ID = "";
    nombre = "";

    setID(value : string){
        this.ID = value;
    }

    setNombre(value : string){
        this.nombre = value;
    }

    getID(){
        return this.ID;
    }

    getNombre(){
        return this.nombre;
    }

    saveData(){
        storage( "localidadIDSelected", this.ID);
        storage( "localidadNombreSelected", this.nombre);
    }

    getData(){
        return {
          "id" : storage( "localidadIDSelected" ),
          "nombre" : storage( "localidadNombreSelected" )
        }
    }

    clean_data(){
        storage( "localidadIDSelected", "");
        storage( "localidadNombreSelected", "Seleccione");
    }

}