Since Cloudreve stores all configuration and data in the `/cloudreve/data` Volume, we just need to create a new container with the new image and mount the same Volume.

```bash{9}
# Stop the currently running container
docker stop cloudreve

# Remove the currently running container
docker rm cloudreve

# Create a new container with the new image and mount the same Volume
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \ # Make sure this is the same as the previous startup
    # Other configuration parameters, the same as the previous startup
    cloudreve/cloudreve:latest
```
