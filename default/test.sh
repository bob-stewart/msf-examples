echo "Reading latest known published MSF."
if [[ "$msf" == "" ]]; then
        msf=$(cat ../msf)
fi
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

echo "Running the bare-simple Microservice firewall mode"
docker run --rm -it --name polyverse_microservice_firewall -p 8080:8080 --privileged $msf
