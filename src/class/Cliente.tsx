import storage 
from 'local-storage';
import { cleanupOutdatedCaches } from 'workbox-precaching';

export default class Usuario {

    login : string = "";
    password : string = "";

    id : string = "";
    nombre : string = "";
    token : string = "";
    municipio: string = "";
    cuenta : string = "";
    imagenPerfil : string = "";
    encuesta : boolean = true;
    paterno : string = "";
    materno : string = "";
    correo : string = "";
    domicilio : string = "";

    //Setters

    setId(value : string){
      this.id = value;
      storage( "ID_USER", value);
    }

    setLogin(value: string){
      this.login = value;
      storage( "LOGIN_USER", value);
    }

    setPassword(value : string){
      this.password = value;
      storage( "PASSWORD_USER", value);
    }
  
    setNombre(value : string){
      this.nombre = value;
      storage( "NOMBRE_USER", value);
    }

    setPaterno( value : string){
      this.paterno = value;
      storage( "PATERNO_USER", value);
    }

    setMaterno( value : string){
      this.materno = value;
      storage( "MATERNO_USER", value);
    }
  
    setToken(value : string){
      this.token = value;
      storage( "TOKEN_USER", value);
    }
    
    setMunicipio(value : string){
      this.municipio = value;
      storage( "MUNICIPIO_USER", value);
    }
  
    setCuenta(value : string){
      this.cuenta = value;
      storage( "CUENTA_USER", value);
    }
  
    setImagenPerfil(value : string){
      this.imagenPerfil = value;
      storage( "PROFILE_IMG_USER", value);
    }
  
    setEncuesta(value : boolean){
      this.encuesta = value;
      storage( "ENCUESTA_USER", value);
    }

    setDomicilio(value : string){
      this.domicilio = value;
      storage( "DOMICILIO_USER", value);
    }

    setCorreo(value : string){
      this.correo = value;
      storage( "CORREO_USER", value);
    }

    //Getters

    getId(){
      return this.id;
    }

    getLogin(){
      return this.login;
    }

    getPassword(){
      return this.password;
    }

    getNombre(){
      return this.nombre;
    }

    getToken(){
      return this.token;
    }

    getMunicipio(){
      return this.municipio;
    }

    getCuenta(){
      return this.cuenta;
    }

    getImagenPerfil(){
      return this.imagenPerfil;
    }

    getEncuesta(){
      return this.encuesta;
    }

    // saveData(){
    //   // storage( "login", this.login);
    //   // storage( "nombre", this.nombre);
    //   // storage( "token", this.token);
    //   // storage( "municipio", this.municipio);
    //   // storage( "cuenta", this.cuenta);
    //   // storage( "imagenPerfil", this.imagenPerfil);
    //   // storage( "encuesta", this.encuesta);
    //   // storage( "id_user" , this.id)
    //   // storage( "password" , this.password)
    // }

    getData(){
      return {
        "id" : storage( "id_user" ),
        "login" : storage( "login" ),
        "nombre" : storage( "nombre" ),
        "token" : storage( "token"),
        "municipio" : storage( "municipio" ),
        "cuenta" : storage( "cuenta" ),
        "imagenPerfil" : storage( "imagenPerfil" ),
        "encuesta" : storage( "encuesta" ),
        "password" : storage( "password" )
      }
    }

    clean_data(){
      storage( "login", "");
      storage( "nombre", "");
      storage( "token", "");
      storage( "municipio", "");
      storage( "cuenta", "");
      storage( "imagenPerfil", "");
      storage( "encuesta", "");
      storage( "id_user" , true);
      storage( "password" , "");
    }
  
}