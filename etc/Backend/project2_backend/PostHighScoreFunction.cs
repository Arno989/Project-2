using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using project2_backend.Models;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Collections.Generic;

namespace project2_backend
{
    public static class HighScoreFunction
    {
        [FunctionName("HighScoreFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = "highscore")] HttpRequest req,
            ILogger log)
        {
            if (req.Method == HttpMethods.Post)
            {
                try
                {
                    string constr = Environment.GetEnvironmentVariable("STORAGECONNECTIONSTRING");
                    string json = await new StreamReader(req.Body).ReadToEndAsync();
                    HighScore newReg = JsonConvert.DeserializeObject<HighScore>(json);
                    newReg.ID = Guid.NewGuid().ToString();
                    CloudStorageAccount storac = CloudStorageAccount.Parse(constr);
                    CloudTableClient tablecl = storac.CreateCloudTableClient();
                    CloudTable table = tablecl.GetTableReference("highScoresTable");
                    HighScoreEntity ent = new HighScoreEntity(newReg.Naam, newReg.ID)
                    {
                        Score = newReg.Score,
                        Mode = newReg.Mode
                    };
                    TableOperation insertOperation = TableOperation.Insert(ent);
                    await table.ExecuteAsync(insertOperation);
                    return new OkObjectResult(newReg);
                }
                catch (Exception ex)
                {
                    log.LogError(ex, "--> post HighScore");
                    return new StatusCodeResult(500);
                }
            }
            else if(req.Method == HttpMethods.Get)
            {
                try
                {
                    string connectionstring = Environment.GetEnvironmentVariable("STORAGECONNECTIONSTRING");
                    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(connectionstring);
                    CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
                    CloudTable table = tableClient.GetTableReference("highScoresTable");

                    TableQuery<HighScoreEntity> rangeQuery = new TableQuery<HighScoreEntity>();

                    var queryResult = await table.ExecuteQuerySegmentedAsync<HighScoreEntity>(rangeQuery, null);
                    List<HighScore> registrations = new List<HighScore>();
                    foreach (var result in queryResult.Results)
                    {
                        registrations.Add(new HighScore()
                        {
                            ID = result.RowKey,
                            Naam = result.PartitionKey,
                            Mode = result.Mode,
                            Score = result.Score
                        });
                    }
                    return new OkObjectResult(registrations);
                }
                catch (Exception ex)
                {
                    log.LogInformation(ex + "                -------->GetRegistrationsV2");
                    return new StatusCodeResult(500);
                }
            }
            else
            {
                return new BadRequestObjectResult("Enkel GET en POST requests worden verwerkt.");
            }
        }
    }
}
