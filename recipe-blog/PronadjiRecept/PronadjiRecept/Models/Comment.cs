using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PronadjiRecept.Models
{
    public class Comment
    {
        public int CommentID { get; set; }
        public string Content { get; set; }
        public int UserID { get; set; }
        public int RecipeID {get; set;}
    }
}
