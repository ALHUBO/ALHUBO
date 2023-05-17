/*
Variables globales para ALHUBOWeb
Desarrollado por ALHUBO 
*/
//configuracion del sitio
var system = {
    pwd: -1,
    store: {},
    puntero: {},
    window: 'terminal',//terminal|web|login
    menu: {
        state: false,
        old: false
    },
    login: {
        GUI: false
    },
    terminal: {
        status: true,
        can: true,
        home: '/ALHUBOweb/'
    },
    daemon: {
        'web': {
            active: false
        }
    },
    user: {
        id: 0,
        name: 'ALHUBO',
        group: 'ALHUBOWeb'
    },
    cmd: {
        'start': {
            argc: [1],
            argv: ['web'],
            flag: { '--true': { g: 1, a: false }, '-t': { g: 1, a: false }, '--false': { g: 1, a: false }, '-f': { g: 1, a: false }, '--help': { g: 0, a: false }, '-h': { g: 0, a: false } },
            help: '\tInicia un Demonio'
        },
        'toggle': {
            argc: [1],
            argv: ['terminal', 'menu'],
            flag: { '--true': { g: 1, a: false }, '-t': { g: 1, a: false }, '--false': { g: 1, a: false }, '-f': { g: 1, a: false }, '--help': { g: 0, a: false }, '-h': { g: 0, a: false } },
            help: '\tCambia o establece el estado entre una propiedad de la web'
        },
        'clear': {
            argc: [],
            argv: [],
            flag: { '--help': { g: 0, a: false }, '-h': { g: 0, a: false } },
            help: '\tLimpia la terminal'
        },
        'cls': {
            argc: [],
            argv: [],
            flag: { '--help': { g: 0, a: false }, '-h': { g: 0, a: false } },
            help: '\tLimpia la terminal'
        },
        'mkdir': {
            argc: [-1],
            argv: [],
            flag: { '--help': { g: 0, a: false }, '-h': { g: 0, a: false } },
            help: '\tLimpia la terminal'
        },
        'pwd': {
            argc: [],
            argv: [],
            flag: { '--help': { g: 0, a: false }, '-h': { g: 0, a: false } },
            help: '\tLimpia la terminal'
        }
    }
};


//react globales
const useState=React.useState;
const useEffect=React.useEffect;
