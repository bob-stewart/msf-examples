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
    function(routeId, imageName, bindingPort, wrapInfo) {
      return {
        RouteType: 4,
        ID:        routeId,
        Timeout:   10 * 1000000000,
        ContainerChain: {
          Stateful:  true,
          ConnectionDrainGracePeriod: 60 * 60 * 1000000000,
          Chain: [
            customerChainComponentProducer(imageName, bindingPort, wrapInfo)
          ]
        }
      };
    };

  var appProducer =
    function() {
      return {
        Name: function() {
          return "wrapped-mc";
        },
        IsRequestSupported: function(r,c) {
          return true;
        },
        Route: function(r,c) {
          var routeId     = r.RemoteAddr.replace(/[^a-zA-Z0-9]/g,'-').replace(/-{2,}/g, '-');
          var bindingPort = c.Kv.Get("bindingPort");
          var imageName   = c.Kv.Get("imageName");
          var wrapInfo    = c.Kv.Get("wrapInfo");
          var wrapInfoJ   = JSON.parse(wrapInfo);

          c.Log.Infof("r: %s", r);
          c.Log.Infof("routeId: %s", routeId);
          c.Log.Infof("imageName: %s", imageName);
          c.Log.Infof("bindingPort: %d", bindingPort);
          c.Log.Infof("wrapInfo: %s", wrapInfo);
          c.Log.Info(wrapInfoJ);

          return routeInfoProducer(routeId, imageName, bindingPort, wrapInfoJ);
        },
        ValidationInfo: function() {
          return {
            PositiveRequests: [],
            NegativeRequests: []
          };
        }
      };
    };

  return appProducer();
}();

