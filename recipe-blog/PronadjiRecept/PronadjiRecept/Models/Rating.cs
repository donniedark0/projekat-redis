using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PronadjiRecept.Models
{
    public class Rating
    {
        public int RatingID { get; set; }
        public int Mark { get; set; }
        public int UserID { get; set; }
        public int RecipeID { get; set; }
    }
}
