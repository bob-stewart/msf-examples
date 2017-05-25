app = function() {

  var customerChainComponentProducer = 
    function(imageName, bindingPort, wrapInfo) {
      return {
        BaseImage:          imageName,
        Args:               wrapInfo.args,
        Env:                wrapInfo.envs,
        ExtraHosts:         wrapInfo.hosts,
        Mounts:             wrapInfo.mounts,
        HealthCheckURLPath: "/",
        LaunchGracePeriod:  5 * 60 * 1000000000,
        BindingPort:        parseInt(bindingPort)
      };
    };

  var routeInfoProducer =
    function(imageName, bindingPort, wrapInfo) {
      return {
        RouteType:                  4,
        ID:                         "default-route",
        Timeout:                    30 * 1000000000,
        ContainerChain: {
          ConnectionDrainGracePeriod: 60 * 60 * 1000000000,
          PerInstanceTimeout:         60 * 1000000000,
          DesiredInstances:           2,
          Chain: [
            customerChainComponentProducer(imageName, bindingPort, wrapInfo)
          ]
        }
      };
    };

  return {
    Name: function() {
      return "default-appdef";
    },
    IsRequestSupported: function(r,c) {
      return true;
    },
    Route: function(r,c) {
      var bindingPort = c.Kv.Get("bindingPort");
      var imageName   = c.Kv.Get("imageName");
      var wrapInfo    = c.Kv.Get("wrapInfo");
      var wrapInfoJ   = JSON.parse(wrapInfo);

      c.Log.Infof("imageName: %s", imageName);
      c.Log.Infof("bindingPort: %d", bindingPort);
      c.Log.Infof("wrapInfo: %s", wrapInfo);
      c.Log.Info(wrapInfoJ);

      return routeInfoProducer(imageName, bindingPort, wrapInfoJ);
    },
    ValidationInfo: function() {
      return {
        PositiveRequests: [],
        NegativeRequests: []
      };
    }
  };
}();

