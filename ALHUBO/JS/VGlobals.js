/*
Variables globales para Angie app
Desarrollado por ALHUBO 
*/

//objetos

function ListProductos(data){
    this.data=data;
    this.len=()=>{
        return Object.keys(this.data).length;
    }
    this.forEach=(fnc)=>{
        return Object.keys(this.data).forEach(fnc);
    };
    this.map=(fnc)=>{
        return Object.keys(this.data).map(fnc);
    };
    this.add=(id,obj)=>{
        this.data[id]=obj;
        this.forEach=(fnc)=>{
            return Object.keys(this.data).forEach(fnc);
        };
    }
}

//configuracion del sitio
var webConfig={
    Menu:{
        open: pageMenuOpen//Default open?
    },
    Page:{
        start: page2Load
    },
    Item: itemInit,
    sms: {},
    Categoris: {

    },
    win: {}
};

//user propiedades
var user={
    load: false,//verifica si hay sesion [false | aun no verifica] [true | ya verifico]
    login: false,//inicio sesion [false | invitado] [true | inicio sesion]
    id: '',//id del usuario
    name: ''//nombre del usuario
};

//base de datos propiedades
var db={
    status: false,//hay conexion?
    load: false,//ya hizo una consulta
    destacados: new ListProductos({})
};


//react globales
const useState=React.useState;
const useEffect=React.useEffect;
