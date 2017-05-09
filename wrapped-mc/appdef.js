app = function() {

  var customerChainComponentProducer = 
    function(imageName, bindingPort, wrapinfo) {
      return {
        BaseImage:          imageName, 
        Env:                wrapinfo.envs,
        ExtraHosts:         wrapinfo.hosts,
        HealthCheckURLPath: "/",
        LaunchGracePeriod:  5 * 60 * 1000000000,
        BindingPort:        parseInt(bindingPort)
      };
    };

  var modSecComponentProducer = 
    function(bindingPort) {
      return {
        BaseImage:          "polyverse-tools.jfrog.io/modsecurity:7d99f4dfe9683e27f207a81d1de73be255dd967f",
        HealthCheckURLPath: "/health" ,
        LaunchGracePeriod:  60 * 1000000000,
        Cmd: [
          "/entrypoint.sh",
          "-proxy-pass=http://next:" + bindingPort,
          "-SecRuleEngine=On"
        ],
        Env:                [],
        BindingPort:        8080
      };
    };

  var routeInfoProducer =
    function(imageName, bindingPort, wrapinfo) {
      return {
        RouteType:                  4,
        ID:                         "default_route",
        Timeout:                    365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
          ConnectionDrainGracePeriod: 3 * 60 * 1000000000,
          PerInstanceTimeout:         300 * 1000000000,
          DesiredInstances:           2,
          IsStateless:                true,
          Chain: [
            //modSecComponentProducer(bindingPort),
            customerChainComponentProducer(imageName, bindingPort, wrapinfo)
          ]
        }
      };
    };

  return {
    Name: function() {
      return "default_appdef";
    },
    IsRequestSupported: function(r,c) {
      return true;
    },
    Route: function(r,c) {
      var bindingport = c.Kv.Get("binding_port");
      var imagename   = c.Kv.Get("image_name");
      var wrapinfo    = c.Kv.Get("wrapinfo");
      var wrapinfoj   = JSON.parse(wrapinfo);

      c.Log.Infof("Image Name: %s", imagename);
      c.Log.Infof("Binding Port: %d", bindingport);
      c.Log.Infof("wrapinfo: %s", wrapinfo);
      c.Log.Infof("wrapinfoj: %s", wrapinfoj);

      return routeInfoProducer(imagename, bindingport, wrapinfoj);
    },
    ValidationInfo: function() {
      return {
        PositiveRequests: [],
        NegativeRequests: []
      };
    }
  };
}();
