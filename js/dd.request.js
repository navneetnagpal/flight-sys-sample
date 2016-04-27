/* 
	Request js

*/
(function (module, $, undefined) {


    var Request = dd.module("dd.request", {
        options: {
            async:true,
            error:function(ex,response){
                if (console && console.log){
                    console.log([ex,response]);
                }
            }
        }, 
        sessionexpire: function (response, addParams) {
            throw { message: response.responseText, description: response.responseText };
        },
        checkResponse: function (response, dataType, callback, additionalParams) {
            try {
                if (dataType === "json") {
                    if (typeof (response) === "string") {
                        response = eval("(" + response + ")");
                    }
                    if (response.error) {
                        throw { message: response.message, description: response.description };
                    }
                    else if (response.session === false) {
                        that.sessionexpire(response, additionalParams);
                    }
                    else {
                        callback(response, additionalParams);
                    }

                }
                else {
                    callback(response, additionalParams);
                }
            }
            catch (ex) { this.onError(ex, response); }
        },
        onError:function(obj,response){
            
            this._trigger(this,'error',[obj,response])
        },
        post: function (requrl, dataParams, dataType, callback, additionalParams, async) {
            var self=this;
            $.ajax({ url: requrl,
                type: "POST",
                data: dataParams,
                async: (dd.isNullorUndefined(this.options.async) ? true:this.options.async),
                dataType: dataType,
                success: function (response) {
                    self.checkResponse(response, dataType, callback, additionalParams);
                },
                error: function (response, error) {
                    self.onError({ message: "source:" + requrl + "; " + error, description: response.responseText })
                }
            });

        }
    });
   
    module.request=new Request();

})(dd, jQuery);