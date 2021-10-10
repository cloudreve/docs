# Offline Downloads

Cloudreve's offline download core is driven by [Aria2](https://aria2.github.io/). Once offline downloads are properly configured and enabled, users can create magnet, HTTP, and seed download tasks that are added to user files after the server has completed the download.

For cloud storage policy, Cloudreve will dump the downloaded files to the cloud storage side after the offline download task is completed. Users cannot download and manage the downloaded files until the dump is completed. Users can view the progress of the dumped task in the frontend task queue.

## Enable offline downloads

### Aria2 RPC configuration

The installation and start-up process for Aria2 is outside the scope of this document. You will need to start Aria2 on the same machine as Cloudreve.

{% hint style="info" %}
It is recommended that you start Aria2 first and then start Cloudreve as part of your daily boot process, so that Cloudreve can subscribe to event notifications to Aria2 and download status changes are handled more promptly. Of course, if this process is not available, Cloudreve will also track the status of the task via polling.
{% endhint %}

When you start Aria2, you need to enable the RPC service in its configuration file and set the RPC Secret for subsequent use.

```bash
# Enable the RPC service
enable-rpc=true
# RPC listening port
rpc-listen-port=6800
# RPC authorization token, you can set it yourself
rpc-secure=<your token>
```

### Accessing Cloudreve

Go to Cloudreve's Admin Panel - Parameter Settings - Offline Download, fill in the information according to the instructions and test if you can communicate with aria2 properly.

The important parameters are explained as follows.

**RPC server address**

The address of the Aria2 RPC server, which can be filled in as `http://127.0.0.1:6800/`. Where `6800` is the listening port specified in the Aria2 configuration file above. You can use WebSocket communication, which is `ws://127.0.0.1:6800/`.

**RPC Secret**

The RPC authorization token you set in the Aria2 configuration file above

**Temporary Download Directory**

Cloudreve will specify that Aria2 download the file to this directory, and when the download is complete Cloudreve will copy it to the specified storage policy and delete the file. This directory **must be an absolute path**, otherwise Cloudreve will not find the file after the task has finished downloading. the absolute path specified under Windows should carry the disk letter, e.g. `G:\www\downloads`.

**Status refresh interval (in seconds)**

Specifies the interval at which Cloudreve polls Aria2 to update the task status for each task. The progress of tasks that users see in the foreground is not updated in real time, but is automatically refreshed according to the interval set here.

**Global Task Parameters**

Specify here the additional parameters that Cloudreve carries with it when it creates an Aria2 download task, or you can specify them in the Aria2 configuration file if Aria2 is not public with other services. The specific parameters available can be found in the [official documentation](https://aria2.github.io/manual/en/html/aria2c.html#options) and filled in here in JSON format. If the format is incorrect, the task may not be created. The following is an example of how to fill it in, specifying the maximum number of parallel tasks and the list of Tracker servers.

```javascript
{
	"max-concurrent-downloads": 10,
	"bt-tracker": [
		"udp://tracker.coppersurfer.tk:6969/announce",
		"udp://tracker.opentrackr.org:1337/announce",
		"udp://tracker.leechers-paradise.org:6969/announce"
	]
}
```

You can also specify parameters specific to each user group in the user group configuration, such as limiting the maximum download speed. The format is the same as above and will not be repeated.

### User group permissions

For groups that you want to allow offline downloading, please enable offline downloading permissions on the user group edit page.

## Frequently Asked Questions

#### When testing an Aria2 connection, you are prompted with `Unable to request RPC service, Post "XXX": dial tcp XXX connect: connection refused`

Check if the address is incorrect, if Aria2 is up, and if the port is the same as the one specified in the Aria2 configuration file.

#### Test Aria2 connection with `Unable to request RPC service, invalid character '<' looking for beginning of value`

The RPC address filled in is incorrect, and the connection is possible, but it is not an Aria2 RPC service. The reason for this error is usually that the RPC address is filled in as the address of a web service.

#### Cloudreve task list status not updated/not updated in time

Cloudreve polls the task status periodically and the status is not updated in real time after the task is created. You can also adjust the update frequency in the Admin Panel - Parameter Settings - Offline Downloads - Status Refresh Interval (seconds).

#### BT downloads are too slow/no speed

Download tasks are processed by Aria2 and cannot be optimised by Cloudreve. One possible solution is to add the Tracker server manually. You can specify the Tracker in the Aria2 configuration file at

```bash
bt-tracker=udp://tracker.coppersurfer.tk:6969/announce,http://tracker.internetwarriors.net:1337/announce,udp://tracker.opentrackr.org:1337/announce
```

The Tracker list specified above is only an example, you will need to fill it in yourself. You can use the best Tracker list from the [trackerslist](https://github.com/ngosang/trackerslist) project which is updated daily.

#### BT Tasks remain in the "in progress" list for a long time after 100% progress has been made

By default, Aria2 seeds BT tasks that have completed downloading before they are deemed completed by Cloudreve and processed. You can specify the seeding share rate or seeding time in the Aria2 configuration file, and seeding will stop when either of the following conditions is met.

```bash
# seed-ratio, 0 is always seeding, default:1.0
seed-ratio=1.0
# Stop seeding if seeding time is greater than 30 minutes
seed-time=30
```