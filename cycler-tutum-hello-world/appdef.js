app = function() {

  var HTTPComponentProducer = 
    function(appImageName, appHTTPPort, wrapInfo) {
      return {
        BaseImage:          appImageName, 
        Args:               wrapInfo.args,
        Env:                wrapInfo.envs,
        ExtraHosts:         wrapInfo.hosts,
        Mounts:             wrapInfo.mounts,
        HealthCheckURLPath: "/",
        LaunchGracePeriod:  10 * 1000000000,
        BindingPort:        parseInt(appHTTPPort)
      };
    };

  var HTTPRouteProducer =
    function(remoteId, appImageName, appHTTPPort, wrapInfo) {
      return {
        RouteType:                  4,
        ID:                         "default-http",
        Timeout:                    365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
          ConnectionDrainGracePeriod: 3 * 60 * 1000000000,
          PerInstanceTimeout:         5 * 1000000000,
          DesiredInstances:           3,
          Chain: [
            HTTPComponentProducer(appImageName, appHTTPPort, wrapInfo)
          ]
        }
      };
    };

  var HTTPSComponentProducer = 
    function(appImageName, appHTTPSPort, wrapInfo) {
      return {
        BaseImage:          appImageName, 
        Args:               wrapInfo.args,
        Env:                wrapInfo.envs,
        ExtraHosts:         wrapInfo.hosts,
        Mounts:             wrapInfo.mounts,
        HealthCheckURLPath: "/",
        LaunchGracePeriod:  10 * 1000000000,
        BindingPort:        parseInt(appHTTPSPort),
	URLScheme:          'https'
      };
    };

  var HTTPSRouteProducer =
    function(remoteId, appImageName, appHTTPSPort, wrapInfo) {
      return {
        RouteType:         4,
        ID:                "default-https",
        Timeout:           365 * 24 * 60 * 60 * 1000000000,
	SSLSkipCertVerify: true,
        ContainerChain: {
          ConnectionDrainGracePeriod: 3 * 60 * 1000000000,
          PerInstanceTimeout:         5 * 1000000000,
          DesiredInstances:           3,
          Chain: [
            HTTPSComponentProducer(appImageName, appHTTPSPort, wrapInfo)
          ]
        }
      };
    };

  var appProducer =
    function() {
      return {
        Name: function() {
          return "default-appdef";
        },
        IsRequestSupported: function(r,c) {
          return true;
        },
        Route: function(r,c) {
          var remoteId       = r.RemoteAddr.replace(/[^a-zA-Z0-9]/g,'-').replace(/-{2,}/g, '-');
          var appHTTPPort    = c.Kv.Get("appHTTPPort");
          var appHTTPSPort   = c.Kv.Get("appHTTPSPort");
          var appImageName   = c.Kv.Get("appImageName");
          var wrapInfo       = c.Kv.Get("wrapInfo");
          var wrapInfoJ      = JSON.parse(wrapInfo);

          c.Log.Infof("appProducer: r: %s", r);
          c.Log.Infof("appProducer: remoteId: %s", remoteId);
          c.Log.Infof("appProducer: appImageName: %s", appImageName);
          c.Log.Infof("appProducer: appHTTPPort: %d", appHTTPPort);
          c.Log.Infof("appProducer: appHTTPSPort: %d", appHTTPSPort);
          c.Log.Infof("appProducer: wrapInfo: %s", wrapInfo);
          c.Log.Info(wrapInfoJ);

          if ( r.TLS && appHTTPSPort != "" ) {
          	return HTTPSRouteProducer(remoteId, appImageName, appHTTPSPort, wrapInfoJ);
          } else {
          	return HTTPRouteProducer(remoteId, appImageName, appHTTPPort, wrapInfoJ);
          }
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
