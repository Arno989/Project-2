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

namespace project2_backend
{
    public static class PostHighScoreFunction
    {
        [FunctionName("PostHighScoreFunction")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "highscore")] HttpRequest req,
            ILogger log)
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
                log.LogError(ex, "AddRegistrationV2");
                return new StatusCodeResult(500);
            }
        }
    }
}
