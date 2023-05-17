/*
Plugin de notificaciones ALHUBONotifier.
Desarrollado por ALHUBO © 2023.
v1.0.0
    showSMS:crea una notificación que se muestra sobre todo el sitio (z-index: 10000).

    --Argumentos--
    Algunos argumentos solo es recomendable dejar el uso al plugin.
    
    vr_type:Tipo de notificacion.:user
        [ info | error | success | warning ]
        def:[ info ]
    vr_state:Controla si se esta creando o editando la notificacion.:plugin
        [ make | ctrl ]
        def:[ make ]
    vr_title:Titulo de la notificacion.:user
        def:[ Información ]
    vr_sms:Mensaje de la notificacion.:user
        def:[ Mensaje ]
    vr_id:Identificador de la notificacion:plugin
        def:[ Plugin deside ]
    vr_time:Tiempo en segundos que dura:user
        def:[ 5 ]

*/

var ALHUBONotifier_sms={};
function showSMS({ vr_type = 'info', vr_state = 'make', vr_title = 'Información', vr_sms = 'Mensaje', vr_id = '-1', vr_time = 5 }) {
    if (vr_state == 'make') {
        if (Object.keys(ALHUBONotifier_sms).length == 0) {
            $("body").append('<div id="ALHUBONotifier"></div>');
        }
        let max = -1;
        Object.keys(ALHUBONotifier_sms).forEach(k => {
            if (max < parseInt(k)) {
                max = parseInt(k);
            }
        });
        ALHUBONotifier_sms['' + (max + 1)] = { t: vr_time + 1, T: (vr_time > 2) ? vr_time - 1 : vr_time, o: 0 };
        let icon = (vr_type == 'error') ? '🚨' :
            (vr_type == 'success') ? '✅' :
                (vr_type == 'warning') ? '⚡' :
                    '❕';
        $("#ALHUBONotifier").append('<div id="ALHUBONotifier_smsNotif_' + (max + 1) + '" class="ALHUBONotifier_smsNotif ALHUBONotifier_smsNotif_' + vr_type + '"><div>' + icon + '&nbsp;&nbsp;' + vr_title + '</div><div>' + vr_sms + '</div><div></div></div>')
        let neo = $("#ALHUBONotifier_smsNotif_" + (max + 1));
        neo.mouseenter(function () {
            neo.css('transition', '0.2s');
            neo.css('opacity', '1');
            $("#ALHUBONotifier_smsNotif_" + (max + 1) + " div:nth-child(3)").css("width", '100%');
            ALHUBONotifier_sms['' + (max + 1)].o = 1;
        });
        neo.mouseleave(function () {
            ALHUBONotifier_sms['' + (max + 1)].o = 2;
            ALHUBONotifier_sms['' + (max + 1)].t = 1;
            ALHUBONotifier_sms['' + (max + 1)].T = 1;
            neo.css('transition', '1s');
            showSMS({ vr_state: 'ctrl', vr_id: '' + (max + 1) });
        })
        neo.animate({
            opacity: '1',
            marginBottom: '1vh'
        }, 500, function () {
            neo.css('transition', '0.2s');
            neo.css('transform', 'scale(1.2, 0.8) translateY(-4vh)');
            setTimeout(() => {
                neo.css('transform', 'scale(1, 1) translateY(0vh)');
                setTimeout(() => {
                    neo.css('transform', 'scale(1.2, 0.8) translateY(4vh)');
                    setTimeout(() => {
                        neo.css('transform', 'scale(1, 1) translateY(0vh)');
                        setTimeout(() => {
                            neo.css('transition', '1s');
                            showSMS({ vr_state: 'ctrl', vr_id: '' + (max + 1) });

                        }, 200);
                    }, 200);
                }, 200);
            }, 200);
        });

    } else if (vr_state == 'ctrl') {
        if (Object.keys(ALHUBONotifier_sms).length > 0) {
            let cola = false;
            Object.keys(ALHUBONotifier_sms).forEach(k => {
                if (parseInt(k) < parseInt(vr_id)) cola = true;
            });
            Object.keys(ALHUBONotifier_sms).forEach(k => {
                if (!cola || ALHUBONotifier_sms[k].o == 2) {
                    if (ALHUBONotifier_sms[k].t > 0 && vr_id == k && (ALHUBONotifier_sms[k].o == 0 || ALHUBONotifier_sms[k].o == 2)) {
                        ALHUBONotifier_sms[k].t--;
                        let div = ALHUBONotifier_sms[k].t / ALHUBONotifier_sms[k].T;
                        $("#ALHUBONotifier_smsNotif_" + k).css('opacity', '' + (div));
                        $("#ALHUBONotifier_smsNotif_" + k + " div:nth-child(3)").css("width", ((div > 1) ? 100 : (div * 100)) + '%');
                        setTimeout(() => { showSMS({ vr_state: 'ctrl', vr_id: k }) }, 1000);
                    } else if (ALHUBONotifier_sms[k].o == 1) {
                        $("#ALHUBONotifier_smsNotif_" + k).css('opacity', '1');
                        $("#ALHUBONotifier_smsNotif_" + k + " div:nth-child(3)").css("width", '100%');
                    } else if (ALHUBONotifier_sms[k].t <= 0 && vr_id == k) {
                        delete ALHUBONotifier_sms[k];
                        $("#ALHUBONotifier_smsNotif_" + k).remove();
                        if (Object.keys(ALHUBONotifier_sms).length == 0) {
                            $("#ALHUBONotifier").remove();
                        }
                    }
                } else if (vr_id == k) {
                    setTimeout(() => { showSMS({ vr_state: 'ctrl', vr_id: k }) }, 1000);
                }
            });

        }
    }
}

/*showSMS({vr_title: 'Error',vr_sms: 'Mensaje de error',vr_type:'error',vr_time: 10});
showSMS({vr_title: 'Success',vr_type:'success'});
showSMS({vr_title: 'Info'});
showSMS({vr_title: 'Warning',vr_type:'warning'});*/
