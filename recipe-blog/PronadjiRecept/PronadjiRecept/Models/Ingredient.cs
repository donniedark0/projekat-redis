﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json.Serialization;

namespace PronadjiRecept.Models
{
    public class Ingredient
    {
        public int IngredientID { get; set; }
        public string Name { get; set; }
        public int CategoryID { get; set; }
    }
}