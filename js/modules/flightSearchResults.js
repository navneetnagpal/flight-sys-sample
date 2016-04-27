(function (module, $, undefined) {


    var SearchResultsView = dd.module("flight.searchResultsView", {
        options: {
            messages:{
                title:"Search Results",
                welcomeMessage:"Click on search button to perform search",
                noResultsMessage:"No results found",
                totalText:"Total results found: "
            }
            
        }, 
        _init:function() {
          this.$header=this.element.find('.header');
          this.$headertitle=this.element.find('.search-title');
          this.$deptdatelabel=   this.element.find('.depart-date');
          this.$returndatelabel=   this.element.find('.return-date');
          this.$contentvport=this.element.find('div.vport');
          this.$resultsMessage=this.element.find('span.results-message');
          this.$totalResults=this.element.find('span.total-results');
          this.initializeControls();
          Handlebars.registerHelper('list', function(items, options) {
              var out = "";

              for(var i=0, l=items.length; i<l; i++) {
                out = out +  options.fn(items[i]) ;
              }

              return out ;
            });
        },
        initializeControls:function(){
            this.resetResults();
        },
        resetResults:function(){
             this.$headertitle.text(this.options.messages.title);
             this.$deptdatelabel.text("");
             this.$returndatelabel.text("");
             this.$contentvport.empty();
             this.$resultsMessage.text(this.options.messages.welcomeMessage).removeClass('error');
             this.$totalResults.hide();
        },
        updateCriteria:function(criteria,count){
            this.$headertitle.text(
                    criteria.mode==="return"?
                    [criteria.from,criteria.to,criteria.from].join(' > '):
                    [criteria.from,criteria.to].join(' > ')
                );
                this.$deptdatelabel.text('Depart Date: ' + criteria.deptDate);
                if (criteria.mode=="return") {
                    this.$returndatelabel.text('Return Date: ' +criteria.retDate);
                }else{
                    this.$returndatelabel.text("");
                }
                if (count===0){
                    this.$totalResults.hide();
                }else{
                    this.$totalResults.html(this.options.messages.totalText+ count).show();
                }
        },
        showNoResults:function(){
            this.$resultsMessage.text(this.options.messages.noResultsMessage).addClass('error').fadeIn();
            this.$contentvport.empty();

        },
        getTemplate:function(mode){
            if (mode=="return"){
               return $("#entry-template-return").html()
            }else{
                return $("#entry-template").html();
            }
        },
        showResults:function(data,mode){
            this.$resultsMessage.fadeOut();
            var source   = this.getTemplate(mode);
            var template = Handlebars.compile(source);
            this.$contentvport.html(template({results:data}));

        }
    }),
   
    SearchResultsController = dd.module("flight.searchResultsController",{
        options:{

        },
         _init:function() {           
            this.view=new SearchResultsView({},this.element);

        },
        updateCriteria:function(criteria,count){
            this.view.updateCriteria(criteria,count);
        },
        renderResults:function(data,mode){
            this.view.showResults(data,mode);
        },
        showNoResults:function(){
            this.view.showNoResults();
        }
        
    });

})(Flight, jQuery);