echo "Reading latest known label 'cycler'."
if [[ "$cycler" == "" ]]; then
        cycler=$(cat ../cycler)
fi
echo "Using label: $cycler"

echo "Pulling Container Cycler (be sure you are logged into to docker registry.)"
docker pull $cycler

echo "Running Container Cycler with tutum/hello-world"
docker run --rm -it -p 8080:8080 -p 9001:9000 --privileged -v $PWD/appdef.js:/appdef.js $cycler tutum/hello-world
