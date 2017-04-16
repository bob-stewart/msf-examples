echo "Reading latest known published MSF."
if [[ "$msf" == "" ]]; then
        msf=$(cat ../msf)
fi
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

echo "Running the Microservice firewall with NO_INTERNET mode (meaning - if you have no connection to the registry to pin images.)"
docker run --rm -it --name polyverse_microservice_firewall -p 8080:8080 --privileged -e "NO_INTERNET=true" "$msf"
