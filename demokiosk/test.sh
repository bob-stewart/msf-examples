#!/bin/bash

export msf=polyverse/microservicefirewall:3445afda1366391ddbf3f1145a4eb9facc40eece

echo "Reading latest known published MSF."
if [[ "$msf" == "" ]]; then
        msf=$(cat ../msf)
fi
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

docker run -d --privileged -p 5601:5601 -p 8000:8000 -p 9200:9200 -p 12201:12201/udp -v $PWD/logstash.conf:/opt/logstash.conf --name polyverse_elk polyverse/elk:2b313a0db37067ad6d55e6e95a5cd72c080c3f34

docker run -d --privileged -p 3000:3000 -v $PWD/demokiosk.js:/config.js -e PV_ENDPOINT=http://localhost:8080 -e API_URL=ws://localhost:8000/logs/name:logstash polyverse/demokiosk:f934db93faa35c839ed58e96c52d976dbd67098b

docker run -d --privileged -p 8080:8080 -v $HOME/.docker/config.json:/root/.docker/config.json --link polyverse_elk:polyverse_elk --name polyverse_msf $msf polyverse/polysploit:177fa0f778a34350ad80a3a6112930de514d9505

docker logs -f polyverse_msf
