/*
Variables globales para Angie app
Desarrollado por ALHUBO 
*/

function AjaxJson({vr_url='PHP/testAjaxJson.php',vr_data={test: 'Prueba'},fnc_success=(data)=>{console.log("Respuesta de AjaxJson");console.log(data);},fnc_error=(e)=>{console.log("Error en AjaxJson");console.log(e);}}){
    $.ajax({
        type: "POST",
        dataType:'json',
        url: vr_url,
        data:  vr_data,
        success: function (data){
            fnc_success(data);
        },
        error: function (e){
            fnc_error(e);
        }
    });
}

function AjaxHtml({vr_url='PHP/testAjaxHtml.php',vr_data={test: 'Prueba'},fnc_success=(data)=>{console.log("Respuesta de AjaxHtml");console.log(data);},fnc_error=(e)=>{console.log("Error en AjaxHtml");console.log(e);}}){
    $.ajax({
        type: "POST",
        url: vr_url,
        data:  vr_data,
        success: function(data){
            fnc_success(data);
            delete data;
        },
        error: function (e){
            fnc_error(e);
        }
    });
}

function AjaxForm({vr_url='PHP/testAjaxForm.php',vr_data={},fnc_success=(data)=>{console.log("Respuesta de AjaxForm");console.log(data);},fnc_error=(e)=>{console.log("Error en AjaxForm");console.log(e);}}){
    /*var formData = new FormData();
    var files = $('#image')[0].files[0];
    formData.append('file',files);*/
    $.ajax({
        url: vr_url,
        type: 'POST',
        dataType:'json',
        data: vr_data,
        contentType: false,
        processData: false,
        cache: false,
        beforeSend: function(){
            
        },
        success: function(data){
            fnc_success(data);
        },
        error: function (e){
            fnc_error(e);
        }
    });
}


var formatNumber = {
    separador: ",", // separador para los miles
    sepDecimal: '.', // separador para los decimales
    formatear:function (num){
        num +='';
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

        return this.simbol + splitLeft +splitRight;
    },
    new:function(num, simbol){
        this.simbol = simbol ||'';


        return this.formatear(num);
    }
}


function showSMS({vr_type='info',vr_state='make',vr_title='Información',vr_sms='Mensaje',vr_id='-1',vr_time=5}){
    if(vr_state=='make'){
        if(Object.keys(webConfig.sms).length==0){
            $("body").append('<div id="Notifs"></div>');
        }
        let max=-1;
        Object.keys(webConfig.sms).forEach(k=>{
            if(max<parseInt(k)){
                max=parseInt(k);
            }
        });
        webConfig.sms[''+(max+1)]={t: vr_time+1, T: (vr_time>2)?vr_time-1:vr_time,o: 0};
        let icon=(vr_type=='error')?'<i class="fas fa-times"></i>':
        (vr_type=='success')?'<i class="fas fa-check-circle"></i>':
        (vr_type=='warning')?'<i class="fas fa-exclamation-triangle"></i>':
        '<i class="fas fa-info-circle"></i>';
        $("#Notifs").append('<div id="smsNotif_'+(max+1)+'" class="smsNotif smsNotif_'+vr_type+'"><div>'+icon+'&nbsp;&nbsp;'+vr_title+'</div><div>'+vr_sms+'</div><div></div></div>')
        let neo=$("#smsNotif_"+(max+1));
        neo.mouseenter(function (){
            neo.css('transition','0.2s');
            neo.css('opacity','1');
            $("#smsNotif_"+(max+1)+" div:nth-child(3)").css("width",'100%');
            webConfig.sms[''+(max+1)].o=1;
        });
        neo.mouseleave(function (){
            webConfig.sms[''+(max+1)].o=2;
            webConfig.sms[''+(max+1)].t=1;
            webConfig.sms[''+(max+1)].T=1;
            neo.css('transition','1s');
            showSMS({vr_state: 'ctrl',vr_id:''+(max+1)});
        })
        neo.animate({
            opacity: '1',
            marginBottom: '1vh'
          }, 500,function(){
            neo.css('transition','0.2s');
            neo.css('transform','scale(1.2, 0.8) translateY(-4vh)');
            setTimeout(()=>{
                neo.css('transform','scale(1, 1) translateY(0vh)');
                setTimeout(()=>{
                    neo.css('transform','scale(1.2, 0.8) translateY(4vh)');
                    setTimeout(()=>{
                        neo.css('transform','scale(1, 1) translateY(0vh)');
                        setTimeout(()=>{
                            neo.css('transition','1s');
                            showSMS({vr_state: 'ctrl',vr_id:''+(max+1)});
                            
                        },200);
                    },200);
                },200);
            },200);
          });
        
    }else if(vr_state=='ctrl'){
        if(Object.keys(webConfig.sms).length>0){
            let cola=false;
            Object.keys(webConfig.sms).forEach(k=>{
                if(parseInt(k)<parseInt(vr_id)) cola=true;
            });
            Object.keys(webConfig.sms).forEach(k=>{
                if(!cola||webConfig.sms[k].o==2){
                    if(webConfig.sms[k].t>0&&vr_id==k&&(webConfig.sms[k].o==0||webConfig.sms[k].o==2)){
                        webConfig.sms[k].t--;
                        let div=webConfig.sms[k].t/webConfig.sms[k].T;
                        $("#smsNotif_"+k).css('opacity',''+(div));
                        $("#smsNotif_"+k+" div:nth-child(3)").css("width",((div>1)?100:(div*100))+'%');
                        setTimeout(()=>{showSMS({vr_state: 'ctrl',vr_id: k})},1000);
                    }else if(webConfig.sms[k].o==1){
                        $("#smsNotif_"+k).css('opacity','1');
                        $("#smsNotif_"+k+" div:nth-child(3)").css("width",'100%');
                    }else if(webConfig.sms[k].t<=0&&vr_id==k){
                        delete webConfig.sms[k];
                        $("#smsNotif_"+k).remove();
                        if(Object.keys(webConfig.sms).length==0){
                            $("#Notifs").remove();
                        }
                    }
                }else if(vr_id==k){
                        setTimeout(()=>{showSMS({vr_state: 'ctrl',vr_id: k})},1000);
                }
            });
            
        }
    }
}

/*showSMS({vr_title: 'Error',vr_sms: 'Mensaje de error',vr_type:'error',vr_time: 10});
showSMS({vr_title: 'Success',vr_type:'success'});
showSMS({vr_title: 'Info'});
showSMS({vr_title: 'Warning',vr_type:'warning'});*/




//
//AjaxJson({vr_data:{test: 'mejorado'}});
//AjaxHtml({});