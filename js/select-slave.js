(function($){
    function SlaveSelect(el, config){
      this.$el = $(el);
      var self = this ;
      var defaults = {
        dependsOn: self.$el.attr('data-depends-on'),
        fetchUrl: function(){
          return self.$el.attr('data-fetch-url')
        },
        payloadTransform: function(data){
          return data
        },
        filterRow: function(row){
          return true;
        },
        mapRow: function(row){
          return row;
        },
        parentEvent: 'change',
        ajaxConfig: {
          method: 'GET'
        },
      };
      var settings = $.extend(defaults, config)

      this.settings = settings;

      this.$relative = $(settings.dependsOn) 

      if(this.$relative.length == 0){
        throw new Error('parent element not found');
      }

      this.fetchUrl = settings.fetchUrl;
      this.payloadTransform = settings.payloadTransform;
      
      if(!$.isFunction(this.payloadTransform)){
        throw new Error('invalid value for setting "payloadTransform"');
      }

      if (!$.isFunction(this.fetchUrl)) {
        var fetchUrl = this.fetchUrl
        this.fetchUrl = function(){
          return fetchUrl
        }
      }

      this.attachEvents();
      this.handler();
    }


    SlaveSelect.prototype.handler = function () {
      this.clearControl();

      if(this.$relative.val()){
        this.doFetch(this.$relative.val());
      }
    }
    SlaveSelect.prototype.attachEvents = function () {
      var self = this;
      this.$relative.on(this.settings.parentEvent, function(e){
        self.handler()
      });
    }
    SlaveSelect.prototype.doFetch = function (value) {
      var self = this;
      var url = this.fetchUrl();
      var payload = this.payloadTransform({
        value: value
      })
      
      var ajaxConfig = $.extend({}, this.settings.ajaxConfig, {
        data: payload,
        url: url,
      });
      
      $.ajax(ajaxConfig).then(function(data, status, jqxhr){
        var content_type = jqxhr.getResponseHeader('content-type').split(' ').shift();
        if(!/(json)/.test(content_type)){
          data = JSON.parse(data);
        }
        data = data.filter(self.settings.filterRow).map(self.settings.mapRow)
        self.populate(data);
      })
    }

    SlaveSelect.prototype.clearControl = function(){
      this.$el.val('').trigger('change').trigger('cleared');
      this.$el.attr('disabled', 'disabled');
      this.$el.find('option').not('[data-keep]').remove();
    }

    SlaveSelect.prototype.populate = function(data){
      if (data.length == 0) {
        return;
      }

      var opts = data.map(function(row){
        return $('<option/>', {
          value: row.pk,
        }).text(row.label)
      })
      this.$el.append(opts);
      this.$el.removeAttr('disabled');
      this.$el.trigger('select-populated')
    }

    $.fn.slaveSelect = function(config){
      config = $.extend({}, config);
      this.each(function(){
        var $el = $(this);
        $el.data('select-dependiente', new SlaveSelect($el, config));
      })
    }
  })(jQuery)