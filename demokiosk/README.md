# msf-examples/demokiosk

## Usage:

`./test.sh`

You need to be logged-in and able to access Polyverse's DockerHub repo. Your credentials are mounted into microservicefirewall so that the `polyverse/polysploit` image can be downloaded by msf's dind daemon.

It takes a little longer for the polyverse_elk container to startup than the microservicefirewall container. To check specifically for the polyverse_elk status, open another terminal window and type `docker logs polyverse_elk`.

To see Polysploit, go to http://localhost:8080 and that should start the msf container cycling.

To launch the demokiosk UI, go to http://localhost:3000. If you see any problems, enable the JavaScript console in Google Chrome (View -> Developer -> Developer Tools -> Console tab).

To compromise Polysploit, hit http://localhost:8080/infect. Other endpoints are available in the polyverse-security/polysploit GitHub README.md.

You can see the raw stream of events by going to http://localhost:8000/logs/name:logstash.
