app = function() {

    var defaultRouteInfo = {
        RouteType:          4,
        ID:                 "custom_route_info",
        Timeout:            365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
            ConnectionDrainGracePeriod: 5 * 1000000000,
            PerInstanceTimeout:         5 * 1000000000,
            DesiredInstances:           5,
            IsStateless:                true,
            Chain: [
                {
                    BaseImage:          "tutum/hello-world:latest",
                    HealthCheckURLPath: "/",
                    LaunchGracePeriod:  10 * 1000000000,
                    BindingPort:        80,
                }
            ]
        }
    };

    return {
        Name: function(c) {
            return "SslDemo";
        },
        IsRequestSupported: function(r, c) {
            return true;
        },
        Route: function(r, c) {
                return defaultRouteInfo;
        }
    };
}();
