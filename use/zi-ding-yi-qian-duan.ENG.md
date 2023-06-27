# Custom front end

By default, Cloudreve will use built-in static resource files, including HTML documents, JS scripts, CSS, image resources, etc. If you need to use your own personalized and modified static resources, please rename the `build` directory compiled by [front-end warehouse](https://github.com/cloudreve/frontend) to `statics` and place it in Cloudreve In the same level directory, it will take effect after restarting Cloudreve.

For the construction process of the front-end warehouse, please refer to the following chapters:

{% page-ref page="../getting-started/build.md" %}

{% hint style="warning" %}
Please use the same version of the front-end warehouse as the main program of Cloudreve to build. You can find the corresponding version of the front-end warehouse in the `assets` submodule of the main Cloudreve warehouse you are using.

The front-end resources of the Pro version and the community version cannot be used interchangeably.
{% endhint %}

You can add the `eject` command line parameter when starting Cloudreve to extract the built-in static resources to the `statics` directory:

```bash
./cloudreve -eject
```
