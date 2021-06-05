import storage 
from 'local-storage';

var almacenamiento = window.localStorage;

export default class SessionUser {

    isLogin = false;
    isEmptyLayout = false;
    darMode = false;

    idMasterUser = "";
    loginMU = "";
    passwordMU = "";
    isFingerPrintUserMaster = false;
    nombreUM = "";

    // constructor(){
    //     storage( "isFingerPrintUserMaster",false);
    // }

    setIsLogin(value : boolean){
        this.isLogin = value;
        storage( "isLogin",value);
    }

    setIsEmptyLayout(value : boolean){
        this.isEmptyLayout = value;
        storage( "isEmptyLayout", value);
    }

    setDarkMode(value : boolean){
        this.darMode = value;
        storage( "darMode", value);
    }

    setIdMasterUser( value : string ){
        this.idMasterUser = value;
        storage( "idMasterUser",value);
    }

    setLoginMU(value : string){
        this.loginMU = value;
        storage( "loginMU", value);
    }

    setPasswordMU( value : string){
        this.passwordMU = value;
        storage( "passwordMU", value);
    }

    setIsFingerPrintUserMaster( value : boolean ){
        this.isFingerPrintUserMaster = value;
        storage( "isFingerPrintUserMaster",value);
    }

    setNombreMU( value : string ){
        this.nombreUM = value;
        storage("nombreMU", value);
    }

    getIsLogin(){
        return  storage( "isLogin");
    }

    getIsEmptyLayout(){
        return storage( "isEmptyLayout");
    }

    getDarkMode(){
        return storage( "darMode");
    }

    getIsFingerPrintUM(){
        return storage( "isFingerPrintUserMaster");
    }

    getIdMasterU(){
        return storage( "idMasterUser");
    }

    getLoginUM(){
        return storage( "loginMU");
    }

    getPassUM(){
        return storage( "passwordMU");
    }

    getNombreUM(){
        return storage("nombreMU");
    }

    clean_data(){
        storage( "isLogin", false);
        storage( "isEmptyLayout", false);
        storage( "darMode", false);
        storage( "idMasterUser", "");
        storage( "isFingerPrintUserMaster", false);
        storage( "nombreMU" , "");
    }

}