app = function() {

  var customerChainComponentProducer = 
    function(appImageName, appHTTPPort, wrapInfo) {
      return {
        BaseImage:          appImageName,
        Args:               wrapInfo.args,
        Env:                wrapInfo.envs,
        ExtraHosts:         wrapInfo.hosts,
        Mounts:             wrapInfo.mounts,
        HealthCheckURLPath: "/",
        LaunchGracePeriod:  5 * 60 * 1000000000,
        BindingPort:        parseInt(appHTTPPort)
      };
    };

  var routeInfoProducer =
    function(remoteId, appImageName, appHTTPPort, wrapInfo) {
      return {
        RouteType: 4,
        ID:        remoteId,
        Timeout:   10 * 1000000000,
        ContainerChain: {
          Stateful:  true,
          ConnectionDrainGracePeriod: 60 * 60 * 1000000000,
          Chain: [
            customerChainComponentProducer(appImageName, appHTTPPort, wrapInfo)
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
          var remoteId       = r.RemoteAddr.replace(/[^a-zA-Z0-9]/g,'-').replace(/-{2,}/g, '-');
          var appHTTPPort    = c.Kv.Get("appHTTPPort");
          var appImageName   = c.Kv.Get("appImageName");
          var wrapInfo       = c.Kv.Get("wrapInfo");
          var wrapInfoJ      = JSON.parse(wrapInfo);

          c.Log.Infof("r: %s", r);
          c.Log.Infof("remoteId: %s", remoteId);
          c.Log.Infof("appImageName: %s", appImageName);
          c.Log.Infof("appHTTPPort: %d", appHTTPPort);
          c.Log.Infof("wrapInfo: %s", wrapInfo);
          c.Log.Info(wrapInfoJ);

          return routeInfoProducer(remoteId, appImageName, appHTTPPort, wrapInfoJ);
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

