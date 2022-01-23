# Offline Downloads

Cloudreve's offline download core is driven by [Aria2](https://aria2.github.io). Once offline downloads are properly configured and enabled, users can create magnet, HTTP, and seed download tasks that are added to user files after the server completes the download.

For cloud storage policy, Cloudreve will dump the downloaded files to the cloud storage side after the offline download task is completed, and users cannot download and manage the downloaded files until the dumping is finished. Users can view the progress of the dumped tasks in the task queue in the frontend.

Cloudreve supports "slave offline download", which allows you to divert offline download tasks to multiple servers to avoid overloading the host with these tasks. Each node that handles offline downloads requires a set of Cloudreve and Aria2 instances to run. You can configure and add new nodes by following the Node Addition Wizard guidelines in the administration panel. A slave offline download node is essentially the same as the node used for a slave storage policy, and you can use a slave Cloudreve instance as both a storage node and an offline download node. If you do not need the slave node to handle offline download tasks and only want the current host Cloudreve to handle offline downloads, simply edit the host node and configure Aria2-related information. User-created offline download tasks will be rotated to all available offline download nodes for processing.

## Enable Offline Downloads

### Aria2 RPC Configuration

The installation and startup process for Aria2 is beyond the scope of this article. You will need to start Aria2 on the same machine as Cloudreve.

{% hint style="info" %}
It is recommended that you start Aria2 before Cloudreve in your daily boot process, so that Cloudreve can subscribe to event notifications to Aria2 and download status changes are handled more promptly. Of course, if this process is not available, Cloudreve will also track the task status via polling.
{% endhint %}

When you start Aria2, you need to enable the RPC service in its configuration file and set the RPC Secret for subsequent use.

```bash
# Enable the RPC service
enable-rpc=true
# RPC listening port
rpc-listen-port=6800
# RPC authorization token, you can set it yourself
rpc-secret=<your token>
```

### Accessing Cloudreve

Go to Cloudreve's Admin Panel - Offline Download Node - Add/Edit Node - Offline Download, follow the instructions to fill in the information and test if you can communicate with Aria2 properly.

The important parameters are explained as follows.

**RPC server address**

The address of the Aria2 RPC server, which can be filled in as `http://127.0.0.1:6800/`. Where `6800` is the listening port specified in the Aria2 configuration file above. You can use WebSocket communication, which is `ws://127.0.0.1:6800/`.

**RPC Secret**

The RPC authorization token you set in the Aria2 configuration file above

**Temporary Download Directory**

Cloudreve will specify that Aria2 download the files to this directory, and when the download is complete Cloudreve will copy to the specified storage policy and delete the files. This directory **must be an absolute path**, otherwise Cloudreve will not find the file after the task completes downloading. the absolute path specified under Windows should carry the disk letter, e.g. `G:\www\downloads`.

**Status refresh interval (in seconds)**

Specifies the interval at which Cloudreve polls Aria2 to update the task status for each task. The progress of the tasks that users see in the foreground is not updated in real time, but is automatically refreshed according to the interval set here.

**Global Task Parameters**

Specify additional parameters here that Cloudreve carries with it when creating Aria2 download tasks, or you can specify them in the Aria2 configuration file if Aria2 is not public with other services. The specific parameters available can be found in the [official documentation](https://aria2.github.io/manual/en/html/aria2c.html#options) and filled in here in JSON format. If the format is incorrect, the task may not be created. The following is a sample fill in specifying the maximum number of parallel tasks and the Tracker server list.

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

For user groups that you want to allow offline downloading, please enable offline downloading permission on the user group edit page.

## Frequently Asked Questions

#### When testing an Aria2 connection, you are prompted with `Unable to request RPC service, Post "XXX": dial tcp XXX connect: connection refused`.

Check if the address is incorrect, if Aria2 is running, and if the port is the same as the one specified in the Aria2 configuration file.

#### When testing Aria2 connection, `Unable to request RPC service, invalid character '<' looking for beginning of value`.

The RPC address filled in is incorrect, and you can connect, but it is not an Aria2 RPC service, so check if the address is incorrect and the port is correct. The reason for this error is usually that the RPC address is filled in as the address of a Web service.

#### The status of tasks in the Cloudreve task list is not updated/is not updated in a timely manner

Cloudreve polls the task status periodically. The task status is not updated in real time after it is created, so please be patient. You can also adjust the update frequency in Admin Panel - Parameter Settings - Offline Download - Status Refresh Interval (sec).

#### BT download too slow/no speed

Download tasks are processed by Aria2 and cannot be optimized via Cloudreve. One possible solution is to manually add a Tracker server. You can specify the Tracker in the Aria2 configuration file at

```bash
bt-tracker=udp://tracker.coppersurfer.tk:6969/announce,http://tracker.internetwarriors.net:1337/announce,udp://tracker.opentrackr.org:1337/announce
```

The Tracker list specified above is just an example, you need to fill it in yourself. You can use the best Tracker list from the [trackerslist](https://github.com/ngosang/trackerslist) project, which is updated daily.

#### BT Tasks remain in the "in progress" list for a long time after 100% progress has been made

By default, Aria2 seeds BT tasks that have completed downloading, and only after the seeding is complete will they be recognized as completed by Cloudreve and processed later. You can specify the seeding share rate or seeding time in the Aria2 configuration file, and seeding will stop when either of the following conditions is met.

```bash
# seed-ratio, 0 is always seeding, default:1.0
seed-ratio=1.0
# Stop seeding if seeding time is longer than 30 minutes
seed-time=30
```