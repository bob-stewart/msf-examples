# Wrapping a non-SSL microservice with SSL and intelligent redirection

This is a fairly advanced example. It helps to be familiar with
the example for [Custom Application Definition](../custom-appdef)
and the example for [Custom Configuration](../custom-config).

It demonstrates the power of Polyverse application definitions that use
javascript-based routing decisions to wrap a non-SSL service to be
always and fully behind SSL, without risk that the service left
open any non-SSL URLs. It also removes the insecure->secure redirection
concern out of the service (which may be hosted behind different
Domains and/or Ports.)

## What it demonstrates

The purpose of this example is to demonstrate how to use a custom
application definition combined with a custom configuration to
completely wrap a non-Secure service behind an assured-SSL router while
at the same time supporting proper redirects.

## How it works

* In this directory is a file called appdef.js. It's contents are:

```
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
        ID:                 "redirector_no_port",
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
        ID:                 "redirector_with_port",
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
```

* Let's dissect the App Definition a bit here - this is a complex
Application Definition, but fairly simple for a Javascript developer
to read, and mentally map.

  * First at the top, we define three "RouteInfo" objects. There is
  one called 'defaultRouteInfo' which contains the secured microservice
  definition (our standard modsecurity in front of the actual service
  model.)

  * The second one is a redirector to https without a port (for example,
  it will redirect from http://yourdomain to https://yourdomain but will
  not add a port at the end.)

  * The third one is a redirector that always adds an explicit port
  along with changing the URL schema. Meaning, it will redirect from
  http://yourdomain to https://yourdomain:8443

  * Let us pay particular attention to the Route function which takes
  as input two parameters - a Golang
  [http.Request](https://golang.org/pkg/net/http/#Request) object and
  a Context.

  * This is where it gets interesting. First of all Polyverse AppDefs
  allow routing decisions to be far more readable than linear
  rule-matching, in that you can follow the exact flow of routing
  decisions until you hit a "return" statement with the route that
  was chosen.

  * The Route function first extracts out the X-Forwarded-Proto header
  which will help in knowing whether Polyverse itself is behind an
  additional Load Balancer that is doing SSL-terminations.

  * In the next line it checks whether either the http.Request's TLS
  member is set (meaning we terminated the SSL connection) or an
  X-Forwarded-Proto header is set meaning someone else did before us.

  * If either are true, the request goes to the "defaultRouteInfo" which
  hosts our secure microservice. Due to the explicit "return" statement
  adding other conditions or parameters makes it difficult and obvious
  if some other condition conflicted with this. It isn't a rule-match in
  a long list of rules where additional rules might hide this one.

  * If this case isn't true, then we go into the "else" block which
  handles redirection. Again, because we have full javascript, we can
  test whether the hostname string has a ":" in it, which would be a
  fairly decent heuristic to detect if it contains a port. If it came in
  with a port, then we send it to the redirector that will correct the
  url scheme to be "https" but also send it to the Polyverse Router's
  default Secure Port (8443).

  * If there is no Port in the host, then this request probably either
  came in from a load balancer that was taking requests on port 80
  and thus the saner URL to send back would be to merely change the URL
  scheme to "https".


* Let's run through the scenarios this appdef enables us in just a few
lines of code:
  * The Microservice Developer did not have to think about hostnames,
  SSL terminations and redirects to secure versions.

  * If you are running the canonical cloud deployment where your fleet
  has some sort of internal domain (behind the VPN/DMZ/whatever), and
  you hit the Polyverse Router directly at:
  http://internal.service.company.com:8080 you would be directed to
  https://internal.service.company.com:8443

  * If you are hittig the same service from an external:
  http://prod.company.com You will be redirected to
  https://prod.company.com

  * Furthermore, due to that "if secure then service else
  everything else" kind of definition, it is explicitly known
   when some condition falls before it and tries to break
   the specification. This Javascript can be tested independently
   against requests to ensure safe routing decisions rather than
   having to run a router and then ping it with faked headers and
   hostnames and all that. We provide a convenient tool to
   make this testing simpler.

* In the same directory is a file called `polyverse.yaml` whose
contents are:
```
polyverse.config.router.ssl_on: "true"
polyverse.config.router.ssl_cert_file_path: "/run/secrets/ssl.crt"
polyverse.config.router.ssl_private_key_file_path: "/run/secrets/ssl.key"
polyverse.config.router.ssl_hostname: "localhost"

polyverse.config.components.router.exposed_secrets: |
  ["ssl.crt", "ssl.key"]

```

* Let's look into what settings this file has:
  * First of all, it turns SSL on.
  * It sets a lot of Router parameters telling it where it should
  find the SSL Certificate and Private Keys, and what hostname it is
  providing SSL identity for. You will notice the filenames are where
  Swarm will inject secrets into the router when we tell it to.

  * Finally it is telling our supervisor to expose two secrets
  to the router, which the line above reads from the known place.



* The test.sh script in this directory will mount the two secrets
(SSL Key and Certificate) into a special directory called `/secrets`
under the Microservice Firewall, which will then automatically as
a matter of course, inject them into the swarm, allowing the supervisor
to expose them to services it deems fit.

* Since "Polyverse is Polyversed" all our services inside the MSF
are broken up into small components that do simple tasks. That means
that these secrets are only exposed to the components that need them
to do their jobs.