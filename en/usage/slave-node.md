# Slave Node {#slave-node}

You can run Cloudreve in slave mode on other servers. The Cloudreve master can communicate with it, distribute tasks to slave nodes for execution, or use slave nodes as file storage nodes.

## Configure a New Node {#configure-new-node}

1. Go to `Admin Dashboard` -> `Nodes` -> `New node` to get the slave configuration file shown in the popup window.
2. On the server you want to use as a slave node, create a new configuration file `conf.ini` and paste the content you got from the popup window. You can modify settings like the listening port according to your needs.

   ```bash
   # Create directory
   mkdir ~/cloudreve_slave
   cd ~/cloudreve_slave

   # Create data directory for configuration files
   mkdir ~/cloudreve_slave/data

   # Create configuration file
   nano ~/cloudreve_slave/conf.ini
   ```

3. Copy the Cloudreve executable of the same version as the master node to `~/cloudreve_slave` and start it:

   ```bash
   ./cloudreve
   ```

   ::: tip
   You can also use the `-c` parameter to specify the configuration file path:

   ```bash
   ./cloudreve -c data/conf.ini
   ```

   :::

4. Return to the form for creating a new node in the admin panel, fill in the node's name and address, and test the node communication. If the communication test fails, you can save the node first and troubleshoot according to the [FAQ](#faq).
5. <Badge type="info" text="Optional" /> Refer to [Deploy Cloudreve with Process Supervisor](../overview/deploy/supervisor) to deploy the Cloudreve slave node with process supervision.
6. <Badge type="info" text="Optional" /> Refer to [Configure Reverse Proxy](../overview/deploy/configure#configure-reverse-proxy) to configure a reverse proxy for the slave node.

## Enable Node Features {#enable-node-features}

After adding a node, you can go to the node settings page to enable various features for the node.

### Extract/Create Archive Files {#file-compression-decompression}

When enabled, tasks for online file compression or decompression will be assigned to this node. File downloading, processing, and transfer will be performed on this node.

- When creating archive files, the node needs to compress files to a temporary directory and then transfer them. The required storage space equals the size of the archive files.
- When extracting archive files:
  - For `zip` format archives, the complete archive needs to be downloaded to the temporary directory before decompression begins. The required storage space equals the size of the archive.
  - For other archive formats, no files will be written to disk during the entire decompression process.

### Remote Download {#remote-download}

Please refer to [Remote Download](./remote-download).

### Storage Files {#storage-files}

Please refer to [Slave Storage](./storage/slave).

## Load Balancing

If users don't explicitly select a node when creating tasks and multiple nodes are available, Cloudreve will use a weighted round-robin strategy to select a node. You can set the weight value in `Node Settings` -> `Load balancing weight`. For example: if Node A has a weight of 3 and Node B has a weight of 2, then in every 5 task requests, Node A will be selected 3 times and Node B will be selected 2 times.

## FAQ {#faq}

::: details Node communication failed `Failed to connect to node: Post "xxx": connect: xxx`

Check if the node URL you entered is correct and if the port you're using is open in the firewall.

If the error ends with `status code: xxx`, it means the node address you entered is not pointing to a Cloudreve slave node, but to another web service, or a WAF firewall has blocked the request.

:::

::: details Node communication failed `Successfully connected to slave node, but slave returns: {specific error}`

This means the master node can connect to the slave node, but the slave node returned an error. Please troubleshoot based on the `{specific error}` at the end of the error message.

- If it ends with `invalid sign`, the slave node's signature verification failed. Please check:
  - Whether the `Secret` configuration under `[Slave]` in the slave node's configuration file matches the `Slave Key` configuration for that node in the admin panel. After making them consistent, restart the slave node.
  - Whether there's a significant time difference between the slave node and the master node. If so, please synchronize the time.
- If it ends with `Master: 4.x.x., Slave: 4.x.x.`, it means the Cloudreve versions on the slave and master nodes are inconsistent. Please change the slave's Cloudreve to the same version as the master node.
- If it ends with `but slave returns: Get "xxx/api/v4/site/ping"` or `but slave returns: invalid character '<' looking for beginning of value`, it means the slave node cannot communicate with the master node. Please check:
  - Whether the `Main` site URL in the master node's `Settings` -> `Basic` -> `Site URL` is correct. The slave needs to be able to access this address.
  - Check the network communication between the slave and master for any firewall blocking.

:::
