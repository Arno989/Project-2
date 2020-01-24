using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace project2_backend.Models
{
    public class HighScore : IComparable
    {
        [JsonProperty(PropertyName = "score")]
        public int Score { get; set; }
        [JsonProperty(PropertyName = "mode")]
        public int Mode { get; set; }
        [JsonProperty(PropertyName = "naam")]
        public string Naam { get; set; }
        public string ID { get; set; }


        public int CompareTo(object obj)
        {
            // Moet in classe van object staan
            // : IComparable --> Dit aan public class xxx: IComparable toevoegen
            if (obj == null) return 1;
            HighScore col = (HighScore)obj;
            if (col != null)
            {
                // Op wat je wil sorteren
                return this.Score.CompareTo(col.Score);
            }
            else
            {
                throw new Exception("Object is not a collectible object");
            }
        }
    }
}
