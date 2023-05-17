function Toggle2Terminal() {
    if (system.terminal.can) {
        if (system.window == 'terminal' || system.window == 'web') {
            system.terminal.can = false;
            system.terminal.status = !system.terminal.status;
            if (system.terminal.status) {
                printT('Se abrio la terminal');
                system.window='terminal';
                $('#bttn_clear_term').css({ transform: 'translateY(0vh)' });
                $('#ContentWeb').css({ transform: 'rotateY(-90deg)' });
                $('#BackTerminal').css({ display: 'block' });
                setTimeout(() => {
                    $('#ContentWeb').css({ display: 'none' });
                    $('#Terminal').css({ transform: 'rotateY(0deg)' });
                    system.terminal.can = true;
                    $("#Terminal").animate({ scrollTop: parseInt($('#Terminal')[0].scrollHeight + $('#Terminal').height()) }, 10);
                }, 500);

            } else {
                printT('Se cerro la terminal');
                system.window='web';
                $('#bttn_clear_term').css({ transform: 'translateY(10vh)' });
                $('#Terminal').css({ transform: 'rotateY(90deg)' });
                $('#ContentWeb').css({ display: 'block' });
                setTimeout(() => {
                    $('#BackTerminal').css({ display: 'none' });
                }, 500);
                setTimeout(() => {
                    $('#ContentWeb').css({ transform: 'rotateY(0deg)' });
                    system.terminal.can = true;
                }, 500);
            }
            actvTerm(true);
        } else {
            exec({ vr_cmd: 'login --gui --out' });
        }
    }

}
function ToggleMenu({t=undefined}) {
    if(typeof t==='boolean'){
        system.menu.state = !t;
    }
    system.menu.state = !system.menu.state;
    if (system.menu.state) {
        printT('Se abrio el menu.');
        $('aside').removeClass('aside_close');
        $('#bttn_menu').css({left: '14.5vw'}).html('👈');
        $('.BackContent').css({left: '15vw',width: '85vw'});
        $('.BackLogin').css({left: '15vw',width: '85vw'});
    } else {
        printT('Se cerro el menu.');
        $('aside').addClass('aside_close');
        $('#bttn_menu').css({left: '0vw'}).html('👉');
        $('.BackContent').css({left: '0vw',width: '100vw'});
        $('.BackLogin').css({left: '0vw',width: '100vw'});
    }
    actvTerm(true);
}
function parseCmd(vr_cmd) {
    let full = { str: '', cmd: '', argv: {}, flags: {}, echo: '', exist: false, syntax: true };
    full.str = vr_cmd;
    vr_cmd = vr_cmd.replace(/[ ]+/g, ' ');
    vr_cmd = (vr_cmd[vr_cmd.length - 1] == ' ') ? vr_cmd.substring(0, vr_cmd.length - 1) : vr_cmd;
    if (vr_cmd[0] == ' ') vr_cmd = vr_cmd.substring(1);
    vr_cmd = vr_cmd.split(' ');
    full.exist = (system.cmd[vr_cmd[0]]) ? true : false;
    if (full.exist) {
        let flagsG = [];
        let flagOpen = false;
        let leflag = '';
        for (let i in vr_cmd) {
            if (i > 0)
                if (vr_cmd[i].substring(0, 2) == '--' || vr_cmd[i].substring(0, 1) == '-') {
                    if (typeof (flagOpen) === 'object') {
                        print('flag open')
                        full.syntax = '\tUna bandera se quedo esperando parametro.';
                        flagOpen = false;
                    }
                    if (!system.cmd[vr_cmd[0]].flag[vr_cmd[i]]) {
                        full.syntax = '\tNo existe la bandera [' + vr_cmd[i] + ']';
                    } else if (flagsG.includes(system.cmd[vr_cmd[0]].flag[vr_cmd[i]].g)) {
                        full.syntax = '\tNo se puede utilizar la bandera [' + vr_cmd[i] + ']';
                    } else {
                        flagsG.push(system.cmd[vr_cmd[0]].flag[vr_cmd[i]].g);
                        flagOpen = system.cmd[vr_cmd[0]].flag[vr_cmd[i]].a;
                        leflag = vr_cmd[i];
                    }
                    full.flags[vr_cmd[i]] = '';
                } else {
                    if (typeof (flagOpen) === 'object') {
                        if (Object.keys(flagOpen).length == 0) {
                            full.flags[leflag] = vr_cmd[i];
                        } else if (flagOpen.includes(vr_cmd[i])) {
                            full.flags[leflag] = vr_cmd[i];
                        } else {
                            full.syntax = '\t[' + vr_cmd[i] + '] no es un parametro aceptado por la bandera ';
                        }
                        flagOpen = false;
                    } else full.argv[Object.keys(full.argv).length] = vr_cmd[i];
                }
        }
        if (typeof full.syntax == "boolean") {
            if (system.cmd[vr_cmd[0]].argc.length == 0 && Object.keys(full.argv).length > 0) full.syntax = '\tEl comando no recibe argumentos';
            else if (!flagsG.includes(0) && system.cmd[vr_cmd[0]].argc.length > 0 && !system.cmd[vr_cmd[0]].argc.includes(Object.keys(full.argv).length)) full.syntax = '\tEl numero de argumentos ingresados no es correcto';

            if (system.cmd[vr_cmd[0]].argc.length == 1 && parseInt(system.cmd[vr_cmd[0]].argc[0]) < 0 && parseInt(system.cmd[vr_cmd[0]].argc[0]) * -1 <= Object.keys(full.argv).length) {
                full.syntax = true;
            }
            if (typeof (flagOpen) === 'object') full.syntax = '\tUna bandera se quedo esperando parametro.';
            if (flagsG.includes(0) && (flagsG.length > 1 || Object.keys(full.argv).length > 0)) full.syntax = '\tLa bandera --help solo se puede utilizar sola sin parametros ni argumentos';
        }
        full.cmd = vr_cmd[0];


        let neoP = true, word = { i: -1, f: -1 };
        let tmpStr = full.str + ' ';
        let cmdis = false;
        let flgOpn = '';
        for (let i = 0; i < tmpStr.length; i++) {
            if (neoP) word.i = i;
            if (tmpStr[i] == ' ') {
                word.f = i;
                let wrdI = tmpStr.substring(0, word.i), wrdM = tmpStr.substring(word.i, word.f), wrdF = tmpStr.substring(word.f);
                if (wrdM.length > 0) {

                    if (!cmdis) {//is comand
                        cmdis = true;
                        let neoS = '<span style="color:#9dff00;font-weight: 600;">' + wrdM + '</span>'
                        tmpStr = wrdI + neoS + wrdF;
                        i = i + (neoS.length - wrdM.length);
                    } else if (wrdM[0] == '-') {//is flag
                        let neoS = '<span style="color:#b70a4b;font-weight: 600;">' + wrdM + '</span>';
                        tmpStr = wrdI + neoS + wrdF;
                        i = i + (neoS.length - wrdM.length);
                        flgOpn = full.flags[wrdM];
                    } else if (flgOpn) {
                        if (flgOpn == wrdM) {
                            let neoS = '<span style="color:#b5901e;font-weight: 600;">' + wrdM + '</span>';
                            tmpStr = wrdI + neoS + wrdF;
                            i = i + (neoS.length - wrdM.length);
                        } else {
                            flgOpn = '';
                        }
                    }
                }

            }
            neoP = (tmpStr[i] == ' ') ? true : false;
        }

        tmpStr = tmpStr.substring(0, tmpStr.length - 1);
        let tagOpen = false;
        for (let i = 0; i < tmpStr.length; i++) {
            if (!tagOpen && tmpStr[i] == '<') tagOpen = true;
            else if (tagOpen && tmpStr[i] == '>') tagOpen = false;
            let wrdI = tmpStr.substring(0, i), wrdF = tmpStr.substring(i + 1);

            if (!tagOpen && tmpStr[i] == ' ') {
                let neoS = '&nbsp;';
                tmpStr = wrdI + neoS + wrdF;
                i = i + 5;
            }
        }
        full.echo = tmpStr;
    } else {
        full.echo = full.str;
    }
    return full;
}
function parseCmdS(vr_cmd) {
    let rt = {};
    let other = '';
    if (vr_cmd.indexOf('&') == -1)
        rt[Object.keys(rt).length] = vr_cmd;
    else {

        while (vr_cmd.indexOf('&') != -1) {
            rt[Object.keys(rt).length] = vr_cmd.substring(0, vr_cmd.indexOf('&'));
            vr_cmd = vr_cmd.substring(vr_cmd.indexOf('&') + 1);
        }
        rt[Object.keys(rt).length] = vr_cmd;
    }

    for (let i in rt) {
        rt[i] = parseCmd(rt[i]);
    }

    return rt;
}
function startCMD(vr_cmd) {
    if (Object.keys(vr_cmd.argv).length != 1) {
        printT('start solo recibe un argumento');
        actvTerm(true);
        return;
    }
    if (system.daemon[vr_cmd.argv[0]])
        if (!system.daemon[vr_cmd.argv[0]].active) {
            system.daemon[vr_cmd.argv[0]].active = true;
            if (vr_cmd.argv[0] == 'web') {
                let f = new Date();
                $('.LeFoot div:nth-child(2)').html('ALHUBO &copy; ' + f.getFullYear());

                $("#inCMD").keyup((e) => {
                    if (e.keyCode == 13)
                        exec({ vr_cmd: $(e.target).val() });
                });
                $('#Terminal').click(() => {
                    $('#inCMD').focus();
                });
                $('#bttn_term').click(() => {
                    exec({ vr_cmd: 'toggle terminal' });
                });
                $('#bttn_menu').click(() => {
                    exec({ vr_cmd: 'toggle menu' });
                });
                $('#bttn_clear_term').click(() => {
                    exec({ vr_cmd: 'clear' });
                });
                actvTerm(true);
                printT('Se inicio correctamente el demonio [ ' + vr_cmd.argv[0] + ' ]');
                exec({ vr_cmd: 'page inicio&mkdir ALHUBOweb&mkdir usr', printo: false });
            }
            
        } else {
            printT('Ya esta iniciado el demonio [ ' + vr_cmd.argv[0] + ' ]');
            actvTerm(true);
        }
    else{
        printT('no se reconoce el demonio [ ' + vr_cmd.argv[0] + ' ]');
        actvTerm(true);
    }
    return;
}

function toggleCMD(vr_cmd) {
    if (Object.keys(vr_cmd.argv).length != 1) {
        printT('toggle solo recibe un argumento');
        actvTerm(true);
        return;
    }
    if (vr_cmd.argv[0] == 'terminal') {
        Toggle2Terminal();
    } else if (vr_cmd.argv[0] == 'menu') {
        if(vr_cmd.flags['-f']!==undefined||vr_cmd.flags['--false']!==undefined)ToggleMenu({t:false});
        else if(vr_cmd.flags['-t']!==undefined||vr_cmd.flags['--true']!==undefined)ToggleMenu({t:true});
        else ToggleMenu({});
        
    } else {
        actvTerm(true);
        printT('No existe [' + vr_cmd.argv[0] + ']');
    }
}

function login({show=false}){
    if(!system.login.GUI){
        system.login.GUI=true;
        system.menu.old=system.menu.state;
        exec({ vr_cmd: 'toggle menu -f', printo: false });
        $('#backgroundWeb').fadeOut('slow');
        $('.BackContent').css({transform: 'translateX(100vw)'});
        $('.BackLogin').css({transform: 'translateX(0vw)'});
        $('#bttn_term').css({transform: 'translateX(25vw)'});
        $('#bttn_clear_term').css({transform: 'translateY(10vw)'});
    }else{
        system.login.GUI=false;
        if(system.menu.old) exec({ vr_cmd: 'toggle menu -t', printo: false });
        else exec({ vr_cmd: 'toggle menu -f', printo: false });
        $('.BackContent').css({transform: 'translateX(0vw)'});
        $('.BackLogin').css({transform: 'translateX(-100vw)'});
        $('#bttn_term').css({transform: 'translateX(0vw)'});
        $('#backgroundWeb').fadeIn('slow');
        if(system.window=='terminal') $('#bttn_clear_term').css({transform: 'translateY(0vw)'});
    }
}
function mkdirCMD(vr_cmd) {
    actvTerm(true);

    return;
    if (Object.keys(vr_cmd.argv).length != 1) {
        printT('mkdir solo recibe un argumento');
        actvTerm(true);
        return;
    }

    if (system.store[vr_cmd.argv[0]]) {
        printT('Ya existe el directiorio [ ' + vr_cmd.argv[0] + ' ]');
        actvTerm(true);
        return;
    }
    let idx = Object.keys(system.store).length;
    system.store[vr_cmd.argv[0]] = {
        id: idx,
        parent: system.pwd,
        type: 'd',
        permisos: {
            u: 7,
            g: 7,
            o: 7
        },
        user: system.user.name,
        group: system.user.group
    }
    system.puntero[idx] = vr_cmd.argv[0];
    actvTerm(true);
}
function actvTerm(vr_tg) {
    system.terminal.can = vr_tg;
    if (system.terminal.can) $('#commandTerm').css({ display: 'block' })
    else $('#commandTerm').css({ display: 'none' })
}
function pwdCMD(printo) {
    let pwd = '/';
    let tmp = system.pwd;
    if (tmp != -1) {
        if (system.puntero[tmp]) {
            pwd = system.puntero[tmp] + pwd;
            while (tmp != -1) {
                tmp = system.store[system.puntero[tmp]].parent;
                if (tmp == -1) pwd = '/' + pwd; else pwd = system.puntero[tmp] + pwd;
            }
        } else {
            pwd = '*error*!';
        }
    }
    if (printo) printT(pwd);
    actvTerm(true);
    return pwd;
}
function exec({ vr_cmd = '', printo = true }) {
    if (system.terminal.can) {
        actvTerm(false);
        $('#inCMD').val('');
        let full = parseCmdS(vr_cmd);
        if (printo) printT(full);
        $("#Terminal").animate({ scrollTop: parseInt($('#Terminal')[0].scrollHeight + $('#Terminal').height()) }, 10);
        if (!(Object.keys(full).length == 1 && ![...full[0].str.matchAll(/[\d\w]+/g)].length)) {
            for (let i in full) {
                if (full[i].exist) {
                    if (full[i].syntax !== true) {
                        if (typeof full[i].syntax === "string") {
                            printT(full[i].syntax);
                        } else {
                            printT('\tError desconocido al ejecutar el comando');
                        }
                    } else {
                        if (full[i].flags['-h'] !== undefined || full[i].flags['--help'] !== undefined) {
                            printT(system.cmd[full[i].cmd].help);
                        } else {//execute
                            if (full[i].cmd == 'start') {
                                startCMD(full[i]);
                            } else if (full[i].cmd == 'toggle') {
                                system.terminal.can = true;
                                toggleCMD(full[i]);
                            } else if (full[i].cmd == 'clear' || full[i].cmd == 'cls') {
                                actvTerm(true);
                                if (Object.keys(full[i].argv).length == 0)
                                    $('#HistoryTerm').html('');
                                else
                                    printT('[ ' + full[i].cmd + ' ] no recibe argumentos');

                            } else if (full[i].cmd == 'mkdir') {
                                mkdirCMD(full[i]);
                            } else if (full[i].cmd == 'pwd') {
                                pwdCMD(true);
                            } else {
                                actvTerm(true);
                                printT('<div>No se ejecuto el comando correctamente: [ ' + full[i].cmd + ' ]</div>');
                            }
                        }
                    }
                    
                } else if (full[i].cmd.length > 0) {
                    actvTerm(true);
                    printT('<div>No se reconoce el comando o ejecutable: [ ' + full[i].cmd + ' ]</div>');
                }
            }
        }
        actvTerm(true);
    }
}
function printT(vr_cmd) {
    let befCmd = '<span style="color:#6fb80f;">' + system.user.name + '@alhuboweb</span><span style="font-weight: 900;">:[</span><span style="color:#007cff;font-weight: 900;"> ~ </span><span style="font-weight: 900;">]$</span>';
    $('#groupTerm').html(befCmd);
    if (typeof vr_cmd === "object") {
        let html = '<div>' + befCmd;

        for (let i in vr_cmd) {
            if (i == 0) html += vr_cmd[i].echo;
            else html += ' <span style="color:#007cff;font-weight: 900;">&</span> ' + vr_cmd[i].echo;
        }
        html += '</div>';
        $('#HistoryTerm').append(html);
    } else if (typeof vr_cmd === "string") {
        $('#HistoryTerm').append('<div>' + vr_cmd + '</div>');
    }

}



$('.loginGUI_tabs_input input').val('');
if($('#loginGUI .checkbox-face .check input[type="checkbox"]').prop('checked')) $('#loginGUI .checkbox-face .check input[type="checkbox"]').click();
$('.loginGUI_tabs_input input').on( "focus", function() {
    $(".loginGUI_tabs_input label[for='"+this.id+"']").css({transform: 'translate(0vw,-1vh)',color:'#000',fontWeight: 900})
    $(".loginGUI_tabs_input span[for='"+this.id+"']").css({transform: 'translate(0vw,-1.7vh)'})
});
$('.loginGUI_tabs_input input').on("blur", function() {
    if($(this).val().length==0){
        $("label[for='"+this.id+"']").css({transform: 'translate(1vw,3.7vh)',color:'#bebebe',fontWeight: 0});
        $(".loginGUI_tabs_input span[for='"+this.id+"']").css({transform: 'translate(-2vw,-1.7vh)'});
        if(this.id=='passU')$(".loginGUI_tabs_input span[for='"+this.id+"']").html('🔒');
    }else{
        if(this.id=='passU')$(".loginGUI_tabs_input span[for='"+this.id+"']").html('🔓');
    }
});

$('.loginGUI_tabs_input input').on("keyup", function() {
    if($(this).val().length==0){
        if(this.id=='passU')$(".loginGUI_tabs_input span[for='"+this.id+"']").html('🔒');
    }else{
        if(this.id=='passU')$(".loginGUI_tabs_input span[for='"+this.id+"']").html('🔓');
    }
});
