(function (module, $, undefined) {


    var FlightSerachPage = dd.module("flight.search", {
        
        init:function() {
            module.searchResults = dd.initialize('flight.searchResultsController',{
                
            },$("#searchResults"));

            module.searchLeft = dd.initialize('flight.searchController',{
                search:function(criteria,data){
                    module.searchResults.updateCriteria(criteria,data.length);
                    if (data.length===0){
                        module.searchResults.showNoResults();
                    }else {
                        module.searchResults.renderResults(data,criteria.mode);
                    }
                },
                refine:function(criteria,data){
                    module.searchResults.updateCriteria(criteria,data.length);
                    if (data.length===0){
                        module.searchResults.showNoResults();
                    }else {
                        module.searchResults.renderResults(data,criteria.mode);
                    }
                }
            },$("#searchLeft"));
            
        }
    });

   
    module.search=new FlightSerachPage();

})(Flight, jQuery);