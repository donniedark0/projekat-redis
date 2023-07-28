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
    public class RatingController : Controller
    {
        private IRedisCacheClient _redisCacheClient;
        public RatingController(IRedisCacheClient redisCacheClient)
        {
            _redisCacheClient = redisCacheClient;
        }

        [Route("GetRatingNumber")]
        [HttpGet]
        public async Task<int> GetRatingNumber()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("*Rating: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Rating>(allKeys);
            List<Rating> ratingList = new List<Rating>();
            foreach(var keyValuePair in allKeyValuePairs){
                ratingList.Add(keyValuePair.Value);
            }
            return ratingList.Count();
        }

        [Route("PostRating")]
        [HttpPost]
        public async Task<IActionResult> AddRating([FromBody] Rating rating)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("*Rating: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Rating>(allKeys);
            foreach(var keyValuePair in allKeyValuePairs){
                if(keyValuePair.Value.UserID == rating.UserID && keyValuePair.Value.RecipeID == rating.RecipeID)
                    await _redisCacheClient.GetDbFromConfiguration().RemoveAsync(keyValuePair.Value.RecipeID + "Rating: " + keyValuePair.Value.RatingID);
                    await _redisCacheClient.Db0.AddAsync(rating.RecipeID + "Rating: " + rating.RatingID, rating, DateTimeOffset.Now.AddMinutes(6000));
                    return StatusCode(204);
            }
            await _redisCacheClient.Db0.AddAsync(rating.RecipeID + "Rating: " + rating.RatingID, rating, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }


        [Route("CalculateRating/{recipeID}")]
        [HttpPut]
        public async Task<float> CalculateRating(string recipeID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync(recipeID + "Rating: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Rating>(allKeys);
            int finalRating = 0;
            foreach(var keyValuePair in allKeyValuePairs){
                finalRating += keyValuePair.Value.Mark;
            }

            if(allKeyValuePairs.Count() == 0)
                return 0;
            else
                return finalRating / allKeyValuePairs.Count();
        }

        [Route("DeleteUsersRatings/{ID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUsersRatings(int ID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("*Rating: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Rating>(allKeys);
            List<Rating> ratingList = new List<Rating>();
            foreach(var keyValuePair in allKeyValuePairs){
                ratingList.Add(keyValuePair.Value);
            }
            List<Rating> filteredratingList = new List<Rating>();
            foreach(Rating Rating in ratingList){
                if(Rating.UserID == ID){
                    await _redisCacheClient.GetDbFromConfiguration().RemoveAsync(Rating.RecipeID + "Rating: " + Rating.RatingID);
                }
            }
            return StatusCode(204);
        }

        [Route("DeleteRecipeRatings/{ID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteRecipeRatings(int ID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("*Rating: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Rating>(allKeys);
            List<Rating> ratingList = new List<Rating>();
            foreach(var keyValuePair in allKeyValuePairs){
                ratingList.Add(keyValuePair.Value);
            }
            List<Rating> filteredratingList = new List<Rating>();
            foreach(Rating Rating in ratingList){
                if(Rating.RecipeID == ID){
                    await _redisCacheClient.GetDbFromConfiguration().RemoveAsync(Rating.RecipeID + "Rating: " + Rating.RatingID);
                }
            }
            return StatusCode(204);
        }


        [Route("EditRating")]
        [HttpPut]
        public async Task<IActionResult> EditRating([FromBody] Rating rating)
        {
            await _redisCacheClient.GetDbFromConfiguration().RemoveAsync(rating.RecipeID + "Rating: " + rating.RatingID);
            await _redisCacheClient.Db0.AddAsync(rating.RecipeID + "Rating: " + rating.RatingID, rating, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }
    }
}
