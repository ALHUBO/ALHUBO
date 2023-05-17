/*
Funciones globales
Desarrollado por ALHUBO 
*/

function AjaxJson({ vr_url = 'PHP/testAjaxJson.php', vr_data = { test: 'Prueba' }, fnc_success = (data) => { console.log("Respuesta de AjaxJson"); console.log(data); }, fnc_error = (e) => { console.log("Error en AjaxJson"); console.log(e); } }) {
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: vr_url,
        data: vr_data,
        success: function (data) {
            fnc_success(data);
        },
        error: function (e) {
            fnc_error(e);
        }
    });
}

function AjaxHtml({ vr_url = 'PHP/testAjaxHtml.php', vr_data = { test: 'Prueba' }, fnc_success = (data) => { console.log("Respuesta de AjaxHtml"); console.log(data); }, fnc_error = (e) => { console.log("Error en AjaxHtml"); console.log(e); } }) {
    $.ajax({
        type: "POST",
        url: vr_url,
        data: vr_data,
        success: function (data) {
            fnc_success(data);
            delete data;
        },
        error: function (e) {
            fnc_error(e);
        }
    });
}

function AjaxForm({ vr_url = 'PHP/testAjaxForm.php', vr_data = {}, fnc_success = (data) => { console.log("Respuesta de AjaxForm"); console.log(data); }, fnc_error = (e) => { console.log("Error en AjaxForm"); console.log(e); } }) {
    /*var formData = new FormData();
    var files = $('#image')[0].files[0];
    formData.append('file',files);*/
    $.ajax({
        url: vr_url,
        type: 'POST',
        dataType: 'json',
        data: vr_data,
        contentType: false,
        processData: false,
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {
            fnc_success(data);
        },
        error: function (e) {
            fnc_error(e);
        }
    });
}


var formatNumber = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear: function (num) {
        num += '';
        var splitStr = num.split('.');
        var splitLeft = splitStr[0];

        var splitRight = splitStr.length > 1 ? this.sepDecimal + splitStr[1] : '';
        var regx = /(\d+)(\d{3})/;
        while (regx.test(splitLeft)) {
            splitLeft = splitLeft.replace(regx, '$1' + this.separador + '$2');
        }

        var s = splitRight.toString();
        var l = s.length;
        var decimalLength = s.indexOf('.') + 1;
        var splitRight = s.substr(0, decimalLength + 2);

        return this.simbol + splitLeft + splitRight;
    },
    new: function (num, simbol) {
        this.simbol = simbol || '';


        return this.formatear(num);
    }
}





//
//AjaxJson({vr_data:{test: 'mejorado'}});
//AjaxHtml({});
function LoadScript(vr_src) {
    $.getScript(vr_src, function (data, textStatus, jqxhr) {
        //console.log( data ); // datos del script
        //console.log( textStatus ); // codigo
        //console.log( jqxhr.status ); // 200
    });
}
function LoadStyle(vr_src) {
    $('head').
        append($('<link rel="stylesheet" type="text/css" />').
            attr('href', vr_src));
}

function print(log) {
    console.log(log);
}