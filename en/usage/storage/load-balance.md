# Load Balance {#load-balance}

::: tip <Badge type="tip" text="Pro" />
This section introduces a Pro edition feature.
:::

Load balance storage policy is a special storage policy that allows you to combine multiple storage policies and select a storage policy based on the load balancing algorithm to store files.

## Configure {#configure-load-balance-storage-policy}

1. Create multiple storage policies for load balancing in the admin dashboard `Storage Policy`.
2. Create a `Load Balance` type storage policy and select the sub-storage policies you want to use.
3. After saving, you can configure the weight of each sub-storage policy in the details page:

   - The higher the weight, the higher the probability of being selected.
   - The sub-storage policy with a weight of 0 will not be selected.

   For example: the weight of storage policy A is 1, the weight of storage policy B is 2, and the weight of storage policy C is 0, then the probability of storage policy B being selected is twice that of storage policy A.

## How it works {#how-it-works}

When a new file is uploaded using the load balance storage policy, Cloudreve will select a sub-storage policy based on the weight of each sub-storage policy to store the file. Once the storage policy is determined, it will not automatically switch to other sub-storage policies.

It is important to note that the implementation of the load balance strategy is controlled by the frontend, and users can still upload files using the API to select the sub-storage policy.
