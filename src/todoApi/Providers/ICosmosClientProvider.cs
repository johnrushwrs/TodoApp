using Microsoft.Azure.Cosmos;

namespace todoApi.Providers;

public interface ICosmosClientProvider
{
    Task<CosmosClient> GetClient();
}