app = function() {
    /*
     * NOTE! pv* variables will be subject to change by downstream processes.
     * These are dev friendly defaults.
     */
    var pvModsecImage   = 'polyverse-tools.jfrog.io/modsecurity:latest';
    var pvRedirectImage = 'polyverse-internal.jfrog.io/redirect:0d31234d945e6e9f7c15f28493a747fc1d6d8030';

    var defaultRouteInfo = {
        RouteType:          4,
        ID:                 "secured_microservice",
        Timeout:            365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
            ConnectionDrainGracePeriod: 5 * 1000000000,
            PerInstanceTimeout:         30 * 1000000000,
            DesiredInstances:           3,
            IsStateless:                true,
            Chain: [
                {
                    BaseImage:          "polyverse-tools.jfrog.io/modsecurity:latest",
                    HealthCheckURLPath: "/health" ,
                    LaunchGracePeriod:  60 * 1000000000,
                    Cmd:                [
                                            "/entrypoint.sh",
                                            "-proxy-pass=http://next:80", //'next' will be passed to next link in the chain
                                            "-SecRuleEngine=On",
                                        ],
                    Env:                [],
                    BindingPort:        8080
                },
                {
                    BaseImage:          "tutum/hello-world:latest",
                    HealthCheckURLPath: "/",
                    LaunchGracePeriod:  10 * 1000000000,
                    BindingPort:        80,
                }
            ]
        }
    };

    var redirectorRouteInfo = {
        RouteType:          4,
        ID:                 "redirector",
        Timeout:            365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
            ConnectionDrainGracePeriod: 5 * 1000000000,
            PerInstanceTimeout:         30 * 1000000000,
            DesiredInstances:           2,
            IsStateless:                true,
            Chain: [
                {
                    BaseImage:          "polyverse-internal.jfrog.io/redirect:latest",
                    HealthCheckURLPath: "/health",
                    LaunchGracePeriod:  10 * 1000000000,
                    Cmd:                ["/entrypoint.sh","-bind=80","-scheme=https"],
                    Env:                ["PVSCRAMBLE=true"], //looks like empty param not handled; errors in log
                    BindingPort:        80,
                }
            ]
        }
    };

    var redirectorWithPortRouteInfo = {
        RouteType:          4,
        ID:                 "redirector",
        Timeout:            365 * 24 * 60 * 60 * 1000000000,
        ContainerChain: {
            ConnectionDrainGracePeriod: 5 * 1000000000,
            PerInstanceTimeout:         30 * 1000000000,
            DesiredInstances:           2,
            IsStateless:                true,
            Chain: [
                {
                    BaseImage:          "polyverse-internal.jfrog.io/redirect:latest",
                    HealthCheckURLPath: "/health",
                    LaunchGracePeriod:  10 * 1000000000,
                    Cmd:                ["/entrypoint.sh","-bind=80","-scheme=https","-port=8443"],
                    Env:                ["PVSCRAMBLE=true"], //looks like empty param not handled; errors in log
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
            var host = r.Host;
            var proto = r.Header['X-Forwarded-Proto']; //Set by upstream LB


            // ok iff https or AWS ELB health check, else redirect
            if ( r.TLS || 'https' == proto ) {
                return defaultRouteInfo;
            } else {
                //if host has a port in it, then reset port
                if (host.indexOf(":") >= 0) {
                  return redirectorWithPortRouteInfo
                } else {
                  return redirectorRouteInfo
                }
            }
        }
    };
}();
