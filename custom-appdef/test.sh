echo "Reading latest known published MSF."
if [[ "$msf" == "" ]]; then
        msf=$(cat ../msf)
fi
echo "Using MSF: $msf"

echo "Pulling Microservice Firewall (be sure you are logged into to docker registry.)"
docker pull $msf

echo "Running Microservice firewall to expose the image $image behind SSL."
echo "This demonstrates the power of a downloading from images.json, a custom configuration, and a custom Application Definition that routes intelligently"

docker run --rm -it \
      --name polyverse_microservice_firewall \
      -p 8080:8080 \
      -p 8443:8443 \
      --privileged \
      -v $PWD/appdef.js:/appdef.js \
      -v $PWD/images.json:/images.json \
      $msf
