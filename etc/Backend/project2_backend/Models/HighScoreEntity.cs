using Microsoft.WindowsAzure.Storage.Table;
using System;
using System.Collections.Generic;
using System.Text;

namespace project2_backend.Models
{
    public class HighScoreEntity : TableEntity
    {
        public HighScoreEntity()
        {

        }

        public HighScoreEntity(string naam, string scoreId)
        {

            this.PartitionKey = naam;
            this.RowKey = scoreId;
        }

        public int Score { get; set; }
        public int Mode { get; set; }
    }
}
