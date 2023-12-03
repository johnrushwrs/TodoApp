using Azure.Identity;
using Microsoft.Azure.Cosmos;

namespace todoApi.Providers;

public class CosmosClientProvider : ICosmosClientProvider
{
    private CosmosClient cachedClient;
    private string cosmosEndpoint;
    private DefaultAzureCredential azureCredential;
    private IReadOnlyList<(string databaseId, string containerId)> defaultContainers;

    public CosmosClientProvider(
        string cosmosEndpoint, 
        DefaultAzureCredentialOptions azureCredentialOptions,
        IReadOnlyList<(string databaseId, string containerId)> defaultContainers)
    {
        this.azureCredential = new DefaultAzureCredential(azureCredentialOptions);
        this.cosmosEndpoint = cosmosEndpoint;
        this.defaultContainers = defaultContainers;
    }

    public async Task<CosmosClient> GetClient()
    {
        if (cachedClient == null)
        {
            CosmosClientOptions options = new CosmosClientOptions();
            cachedClient = await CosmosClient.CreateAndInitializeAsync(
                this.cosmosEndpoint, 
                this.azureCredential,
                this.defaultContainers);
        }

        return cachedClient;
    }
}