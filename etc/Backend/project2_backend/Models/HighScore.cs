using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace project2_backend.Models
{
    public class HighScore
    {
        [JsonProperty(PropertyName = "score")]
        public int Score { get; set; }
        [JsonProperty(PropertyName = "mode")]
        public int Mode { get; set; }
        [JsonProperty(PropertyName = "naam")]
        public string Naam { get; set; }
        public string ID { get; set; }
    }
}
