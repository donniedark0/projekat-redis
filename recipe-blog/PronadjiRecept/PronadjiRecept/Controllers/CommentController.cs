using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis.Extensions.Core.Abstractions;
using StackExchange.Redis;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PronadjiRecept.Models;

namespace PronadjiRecept.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CommentController : Controller
    {
        private IRedisCacheClient _redisCacheClient;
        public CommentController( IRedisCacheClient redisCacheClient)
        {
            _redisCacheClient = redisCacheClient;
        }

        [Route("PostComment")]
        [HttpPost]
        public async Task<IActionResult> AddComment([FromBody] Comment comment)
        {
            await _redisCacheClient.Db0.AddAsync(comment.RecipeID + "Comment: " + comment.CommentID, comment, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }


        [Route("GetComments/{recipeID}")]
        [HttpPut]
        public async Task<List<Comment>> GetComments(int recipeID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync(recipeID + "Comment: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Comment>(allKeys);
            List<Comment> commentList = new List<Comment>();
            foreach(var keyValuePair in allKeyValuePairs){
                commentList.Add(keyValuePair.Value);
            }
            return commentList;
        }

        [Route("GetCommentNumber")]
        [HttpGet]
        public async Task<int> GetCommentNumber()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("*Comment: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Comment>(allKeys);
            List<Comment> commentList = new List<Comment>();
            foreach(var keyValuePair in allKeyValuePairs){
                commentList.Add(keyValuePair.Value);
            }
            return commentList.Count();
        }

        [Route("DeleteComment/{recipeID}/{commentID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteComment(string recipeID, string commentID)
        {
            await _redisCacheClient.GetDbFromConfiguration().RemoveAsync(recipeID + "Comment: " + commentID);
            return StatusCode(204);
        }

        [Route("DeleteUsersComments/{ID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUsersComments(int ID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("*Comment: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Comment>(allKeys);
            List<Comment> commentList = new List<Comment>();
            foreach(var keyValuePair in allKeyValuePairs){
                commentList.Add(keyValuePair.Value);
            }
            List<Comment> filteredcommentList = new List<Comment>();
            foreach(Comment comment in commentList){
                if(comment.UserID == ID){
                    await _redisCacheClient.GetDbFromConfiguration().RemoveAsync(comment.RecipeID + "Comment: " + comment.CommentID);
                }
            }
            return StatusCode(204);
        }

        [Route("DeleteRecipeComments/{ID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteRecipeComments(int ID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("*Comment: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Comment>(allKeys);
            List<Comment> commentList = new List<Comment>();
            foreach(var keyValuePair in allKeyValuePairs){
                commentList.Add(keyValuePair.Value);
            }
            List<Comment> filteredcommentList = new List<Comment>();
            foreach(Comment comment in commentList){
                if(comment.RecipeID == ID){
                    await _redisCacheClient.GetDbFromConfiguration().RemoveAsync(comment.RecipeID + "Comment: " + comment.CommentID);
                }
            }
            return StatusCode(204);
        }

        [Route("EditComment/{recipeID}/{commentID}")]
        [HttpPut]
        public async Task<IActionResult> EditComment(string recipeID, string commentID, [FromBody] Comment comment)
        {
            await _redisCacheClient.Db0.AddAsync(comment.RecipeID + "Comment: " + comment.CommentID, comment, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }
    }
}
