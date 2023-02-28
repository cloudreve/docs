# Download offline

Cloudreve's offline download core is powered by [Aria2](https://aria2.github.io). After correctly configuring and enabling the offline download function, users can create magnet link, HTTP, and torrent download tasks, which will be added to user files after the download is completed by the server.

For the cloud storage strategy, after the offline download task is completed, Cloudreve will transfer the downloaded files to the cloud storage end, and the user cannot download and manage the downloaded files before the transfer is completed. Users can view the progress of the dump task in the foreground task queue.

Cloudreve supports "slave offline download", you can offload offline download tasks to multiple servers to avoid these tasks occupying too much host resources. Each node responsible for handling offline download tasks needs to run a set of Cloudreve and Aria2 instances. You can configure and add new nodes by following the node addition wizard in the admin panel. The slave offline download node is essentially the same as the node used for the slave storage policy, and you can use the slave Cloudreve instance as a storage node and an offline download node at the same time. If you do not need slave nodes to handle offline download tasks, but only want the current host Cloudreve to handle offline downloads, you only need to edit the host node and configure Aria2 related information. Offline download tasks created by users will be assigned to all available offline download nodes in turn.

## Enable offline download

### Aria2 RPC configuration

The installation and startup process of Aria2 is beyond the scope of this article. You need to start Aria2 on the same machine as Cloudreve.

{% hint style="info" %}
It is recommended that in the daily startup process, start Aria2 first, and then start Cloudreve, so that Cloudreve can subscribe to Aria2 for event notifications, and the download status changes can be processed in a more timely manner. Of course, if there is no such process, Cloudreve will also track the task status through polling.
{% endhint %}

When starting Aria2, you need to enable the RPC service in its configuration file and set the RPC Secret for subsequent use.

```bash
# Enable RPC service
enable-rpc=true
# RPC listening port
rpc-listen-port=6800
# RPC authorization token, can be set by yourself
rpc-secret=<your token>
```

### Connect to Cloudreve

Go to Cloudreve's management panel-offline download node-add/edit node-offline download, fill in the information according to the guidelines and test whether it can communicate with Aria2 normally.

The explanation of the important parameter items is as follows:

**RPC server address**

The address of the Aria2 RPC server can generally be filled in as `http://127.0.0.1:6800/`. Where `6800` is the listening port specified in the Aria2 configuration file above. You can use WebSocket communication, fill in here as `ws://127.0.0.1:6800/`.

**RPC Secret**

The RPC authorization token you set up in the Aria2 configuration file above.

**Temporary download directory**

Cloudreve will specify Aria2 to download files to this directory. After the download is complete, Cloudreve will copy to the specified storage policy and delete the files. This directory **must be an absolute path**, otherwise Cloudreve will not find the file after the task download is complete. The absolute path specified under Windows should carry a drive letter, such as `G:\www\downloads`.

**Status refresh interval (seconds)**

Specifies the interval at which, for each job, Cloudreve polls Aria2 to update the job status. The task progress that the user sees in the foreground will not be updated in real time, but will be automatically refreshed according to the interval set here.

**Global Task Parameters**

Specify the additional parameters that Cloudreve carries when creating the Aria2 download task here. If Aria2 is not shared with other services, you can also specify these parameters in the Aria2 configuration file. For specific available parameters, please refer to [Official Documentation](https://aria2.github.io/manual/en/html/aria2c.html#options), fill in here in JSON format. Incorrect formatting may prevent task creation. The following is an example of filling in, specifying the maximum number of parallel tasks and the list of Tracker servers:

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

You can also specify specific parameters for each user group in the user group configuration, such as limiting the maximum download speed and so on. The specific format is consistent with the above and will not be repeated.

### User Group Permissions

For the user group that you want to allow the offline download function, please enable the offline download permission on the user group edit page.

## common problem

#### When testing the Aria2 connection, it prompts `Unable to request RPC service, Post "XXX": dial tcp XXX connect: connection refused`

The RPC address filled in is wrong, and the connection cannot be made. Check whether the address is wrong, whether Aria2 is started, and whether the port is consistent with that specified in the Aria2 configuration file.

#### When testing Aria2 connection, it prompts `Unable to request RPC service, invalid character '<' looking for beginning of value`

The RPC address filled in is wrong and you can connect, but it is not the RPC service of Aria2. Please check whether the address is wrong and the port is correct. The reason for this error is generally that the RPC address is filled in as the address of a Web service.

#### The task status in the Cloudreve task list is not updated/not updated in time

Cloudreve will periodically poll the task status, and the status will not be updated in real time after the task is created, please wait patiently. You can also adjust the update frequency in Admin Panel - Parameter Settings - Offline Download - Status Refresh Interval (seconds).

#### BT download too slow/no speed

Download tasks are handled by Aria2 and cannot be optimized by Cloudreve. One possible solution is to add Tracker servers manually. You can specify Tracker in Aria2 configuration file:

```bash
bt-tracker=udp://tracker.coppersurfer.tk:6969/announce,http://tracker.internetwarriors.net:1337/announce,udp://tracker.opentrackr.org:1337/announce
```

The Tracker list specified above is just an example, and you need to fill it in according to the actual situation. You can use the [trackerslist](https://github.com/ngosang/trackerslist) project for a daily updated list of the best trackers.

#### After the BT task progress is 100%, the task is still in the "in progress" list for a long time without being processed

By default, Aria2 will seed the downloaded BT tasks. After the seeding is completed, Cloudreve will consider it as completed and perform subsequent processing. You can specify the seeding share rate or seeding time in the Aria2 configuration file, when either condition is met, the seeding will stop:

```bash
# Seed share rate, 0 means always seed, default: 1.0
seed-ratio=1.0
# If the seeding time is greater than 30 minutes, stop seeding
seed-time=30
```
