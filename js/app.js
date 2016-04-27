/* 
    Request js

*/
(function (module, $, undefined) {


    var FlightApp = dd.module("flight.app", {
        options: {
            error:function(ex,response){
                if (console && console.log){
                    console.log([ex,response]);
                }
            }
        },
        start:function(){
           var routing = $("body").attr("class") || "",
           arrRoute=routing.split(' '),route;
           for(var count=0,max=arrRoute.length;count<max;count++ ){
                route=arrRoute[count]
                if (!!route){
                    if (module[route] && module[route].init && typeof(module[route].init)=="function"){
                        module[route].init();
                    }
                }  
           }
        }
        
    });
   
    module.app=new FlightApp();

})(window.Flight || (window.Flight={}), jQuery);


$(document).ready(function(){
    Flight.app.start();
});