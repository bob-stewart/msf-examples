echo "Reading latest known published MSF."
if [[ "$msf" == "" ]]; then
        msf=$(cat ../msf)
fi
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
#docker pull $msf

echo "Running the bare-simple Microservice firewall mode"
echo "Once you see Polyverse starting, you can view logs at http://localhost:8888/logs."
docker run -it --rm --name polyverse_microservice_firewall -p 8080:8080 -e LOGSPOUT_PORT=8888 -p 8888:8888 --privileged $msf
