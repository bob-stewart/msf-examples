app = function() {

    var defaultRouteInfoProducer = function(baseImage) {
       return  {
        RouteType:          4,
        ID:                 "dynamic_image_name",
        Timeout:            365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
            ConnectionDrainGracePeriod: 5 * 1000000000,
            PerInstanceTimeout:         5 * 1000000000,
            DesiredInstances:           5,
            IsStateless:                true,
            Chain: [
                {
                    BaseImage:          baseImage,
                    HealthCheckURLPath: "/",
                    LaunchGracePeriod:  10 * 1000000000,
                    BindingPort:        8080,
                }
            ]
        }
      };
    };

    return {
        Name: function(c) {
            return "SslDemo";
        },
        IsRequestSupported: function(r, c) {
            return true;
        },
        Route: function(r, c) {
		//Base image isn't known at the time of app-def writing/testing. It is
                //Bound at runtime from the configuration yaml file
                return defaultRouteInfoProducer(c.Kv.Get("base_image"));
        }
    };
}();
