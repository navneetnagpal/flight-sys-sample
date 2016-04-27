(function (module, $, undefined) {


    var SearchView = dd.module("flight.searchView", {
        options: {
            mode:"oneway",
            maxPrice:30000            
        },
       
        _init:function() {
            this.$tickettypes= this.element.find('.ticket-type');
            this.$origincity=this.element.find ('.origin-city');
            this.$destcity=this.element.find('.dest-city');
            this.$deptdate=this.element.find('.dept-date');
            this.$returndate=this.element.find('.return-date');
            this.$returndatelabel=this.element.find('label[for=return-date]');
            this.$passengers=this.element.find('.passengers');
            this.$searchButton=this.element.find('.search-btn');
            this.$priceRange=this.element.find('.price-range');
            this.$priceRangeLabel=this.element.find('.price-range-label');
            this.$refineSearch=this.element.find('.refine-search-container');
            this.initializeControls();
            this.bindEvents();
        },
        initializeControls:function(){
            var self=this;
            this.$deptdate.datepicker();
            this.$returndate.datepicker({defaultDate:+1});
            this.$deptdate.datepicker('setDate',new Date());
            this.$returndate.datepicker('setDate',new Date());
            this.$priceRange.slider({
                range: true,
                min: 0,
                max: this.options.maxPrice,
                step:500,
                values: [ 0, this.options.maxPrice ],
                slide: function( event, ui ) {
                    self.$priceRangeLabel.text(  ui.values[ 0 ] + " - " + ui.values[ 1 ] );
                    //self._tigger(self.element,'refine',[criteria])
                },
                change: function( event, ui ) {
                    if (self.searchPerformed){
                        self.minPrice = ui.values[ 0 ];
                        self.maxPrice = ui.values[ 1 ];
                        self._trigger(self.element,'refine',[self.getcriteria()]);
                    }
                }
            });
            this.switchMode(this.options.mode);
            this.$refineSearch.hide();

        },
        switchMode:function(mode){
            switch(mode){
                case "oneway":
                    this.$returndatelabel.hide();
                    this.$returndate.hide()
                    break;
                case "return":
                    this.$returndatelabel.show();
                    this.$returndate.show()
                    break;
            }
        },
        tickettypes_click:function(e){
            if ($(e.target).attr('type')){
                if ($(e.target).hasClass('selected')){
                    return;
                }
                this.$tickettypes.find("li").removeClass('selected');
                $(e.target).addClass('selected');
                this.options.mode=$(e.target).attr('type');
                this.switchMode(this.options.mode);
                this._trigger(this.element,'modeChanged',[this.options.mode]);
            }
        },
        getcriteria:function(){
            return {
                from:this.$origincity.val().toUpperCase(),
                to:this.$destcity.val().toUpperCase(),
                mode:this.options.mode,
                deptDate:this.$deptdate.val(),
                retDate:this.$returndate.val(),
                minPrice:this.minPrice || 0,
                maxPrice:this.maxPrice || this.options.maxPrice
            };
        },
        search_click:function(e){
            this.searchPerformed=true;
            this.options.criteria=this.getcriteria();
            this.$refineSearch.show();
            this._trigger(this.element,'search',[this.options.criteria]);
        },
        bindEvents:function(){
            this._on(this.$tickettypes,'click',this.tickettypes_click);
            this._on(this.$searchButton,'click',this.search_click);
        }
    }),
    SearchModel = dd.module("flight.searchModel",{
        getData:function(){
          
            /*  var data;
            //returning dummy data can be called via ajax
            dd.request.post('services/flights.js',{},'json',function(response){
                data=response;
            },{},false);*/
            return globalFlights;
        },
        filter:function(criteria){
            // filter json data
            return _.filter(this.getData(),function(item){
                var itemState=true;
                if ((item.From===criteria.from && item.To===criteria.to)){
                    if (item.Price>=criteria.minPrice && item.Price<=criteria.maxPrice){
                        if (criteria.mode=="return"){
                            return item.isReturn;
                        }
                        return true
                    }
                }

                return false;
            });
        }
    }),
    SearchController = dd.module("flight.searchController",{
        
        search:function(criteria){
            this._trigger(this.element,'search',[criteria,this.model.filter(criteria)])
        },
        refine:function(criteria){
            this._trigger(this.element,'refine',[criteria,this.model.filter(criteria)]);
        },

         _init:function() {
            var self=this;
            this.view=new SearchView({
                search:function(criteria){
                    self.search(criteria);
                },
                refine:function(criteria){
                    self.refine(criteria);
                }
            },this.element),
            this.model=new SearchModel();
        }
    });

})(Flight, jQuery);