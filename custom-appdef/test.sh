echo "Reading latest known published MSF."
if [[ "$msf" == "" ]]; then
        msf=$(cat ../msf)
fi
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

echo "Running Microservice firewall with a custom app definition file."

docker run --rm -it \
      --name polyverse_microservice_firewall \
      -p 8080:8080 \
      -p 8443:8443 \
      --privileged \
      -v $PWD/appdef.js:/appdef.js \
      -v $PWD/images.json:/images.json \
      $msf
