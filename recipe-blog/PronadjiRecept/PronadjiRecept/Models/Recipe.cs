using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace PronadjiRecept.Models
{
    public class Recipe
    {
        public int RecipeID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Picture { get; set; }
        public int UserID { get; set; }
        public List<string> IngredientIDs { get; set; }
        public List<string> TagIDs { get; set; }
    }
}
