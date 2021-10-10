# Custom Front End

By default, Cloudreve uses the built-in static resource files, including HTML documents, JS scripts, CSS, image resources, etc. If you need to use your own customised static resources, please rename the `build` directory from the [front-end repository](https://github.com/cloudreve/frontend) compilation to `statics` and place it in the same directory as Cloudreve, then restart Cloudreve to take effect.

For the build process of the front-end repository, see the following section.

{% page-ref page="../getting-started/build.md" %}

{% hint style="warning" %}
Please use a front-end repository build that matches the version of the main Cloudreve application. You can find the corresponding front-end repository version in the `assets` sub-module of the main Cloudreve repository you are using.

Pro versions of front-end resources are not interoperable with community versions.
{% endhint %}

You can extract the built-in static resources to the `statics` directory by starting Cloudreve with the `eject` command line parameter.

```bash
./cloudreve -eject
```
