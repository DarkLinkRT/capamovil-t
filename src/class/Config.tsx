export default class ConfigApp {

    url_local_apk_test = "http://192.168.0.7/Hackathon-2020-CAPA/";
    url_local = "http://localhost/Hackathon-2020-CAPA/";
    url_hosting_capa = "http://web.capa.gob.mx/appcapa/";
    url_host_jorge = "https://jorge.sm2test.com/capa/";
    url_API_CAPA_SERVICES = "http://www.capa.gob.mx/capanet/apiroo.php?ews_token=***wsjus2020dki34***...&";
    url_API_CAPA_CONSUMO = "http://www.capa.gob.mx/capanet/consumos.php?ews_token=***wsjus2389dki34***...&ews_no_contrato=8297&ews_id_municipio=1";
   
    getUrlServiceLocal(){
        return this.url_local;
    }

    getUrlServiceHost(){
        return this.url_host_jorge;
    }

    getUrlMasterHost(){
        return this.url_hosting_capa;
    }

    getUrlCapaServices(){
        return this.url_API_CAPA_SERVICES;
    }

    getUrlCapaConsumo(){
        return this.url_API_CAPA_CONSUMO;
    }

}