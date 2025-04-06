因为 Cloudreve 将所有配置和数据存放到了 `/cloudreve/data` Volume 中，我们只需要用新的镜像创建一个新的容器，并挂载相同的 Volume 即可。

```bash{9}
# 关闭当前运行的容器
docker stop cloudreve

# 删除当前运行的容器
docker rm cloudreve

# 使用新的镜像创建一个新的容器，并挂载相同的 Volume
docker run -d --name cloudreve -p 5212:5212 \
    -v ~/cloudreve/data:/cloudreve/data \ # 确保与上次启动时相同
    # 其他配置参数，与上次启动相同
    cloudreve/cloudreve:latest
```
