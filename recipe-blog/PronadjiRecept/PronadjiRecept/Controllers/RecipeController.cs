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
    public class RecipeController : Controller
    {
        private IRedisCacheClient _redisCacheClient;
        public RecipeController(IRedisCacheClient redisCacheClient)
        {
            _redisCacheClient = redisCacheClient;
        }

        [Route("PostRecipe")]
        [HttpPost]
        public async Task<IActionResult> AddRecipe([FromBody] Recipe recipe)
        {
            await _redisCacheClient.Db0.AddAsync("Recipe: " + recipe.RecipeID, recipe, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }


        [Route("GetRecipes")]
        [HttpGet]
        public async Task<List<Recipe>> GetRecipes()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Recipe: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Recipe>(allKeys);
            List<Recipe> recipeList = new List<Recipe>();
            foreach(var keyValuePair in allKeyValuePairs){
                recipeList.Add(keyValuePair.Value);
            }
            return recipeList;
        }

        [Route("GetRecipeNumber")]
        [HttpGet]
        public async Task<int> GetRecipeNumber()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Recipe: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Recipe>(allKeys);
            List<Recipe> recipeList = new List<Recipe>();
            foreach(var keyValuePair in allKeyValuePairs){
                recipeList.Add(keyValuePair.Value);
            }
            return recipeList.Count();
        }

        [Route("GetFilteredRecipes")]
        [HttpPut]
        public async Task<List<Recipe>> GetFilteredRecipes([FromBody] List<string> ids)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Recipe: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Recipe>(allKeys);
            List<Recipe> recipeList = new List<Recipe>();
            foreach(var keyValuePair in allKeyValuePairs){
                recipeList.Add(keyValuePair.Value);
            }
            List<Recipe> filteredRecipeList = new List<Recipe>();
            foreach(Recipe recipe in recipeList){
                int ind = 0;
                List<string> ingredientIDs = recipe.IngredientIDs;
                int len = 0;
                foreach (var ingridientID in ingredientIDs)
                {
                    len++;
                    foreach (var id in ids)
                    {
                        if(ingridientID == id){
                            ind++;
                        }
                    }
                }
                if(ind == len){
                    filteredRecipeList.Add(recipe);
                }
            }
            return filteredRecipeList;
        }

        [Route("GetUsersRecipes/{userID}")]
        [HttpPut]
        public async Task<List<Recipe>> GetUSersRecipes(int userID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Recipe: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Recipe>(allKeys);
            List<Recipe> recipeList = new List<Recipe>();
            foreach(var keyValuePair in allKeyValuePairs){
                recipeList.Add(keyValuePair.Value);
            }
            List<Recipe> filteredRecipeList = new List<Recipe>();
            foreach(Recipe recipe in recipeList){
                if(recipe.UserID == userID){
                    filteredRecipeList.Add(recipe);
                }
            }
            return filteredRecipeList;
        }

        

        [Route("DeleteRecipe/{key}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteRecipe(string key)
        {
            await _redisCacheClient.GetDbFromConfiguration().RemoveAsync("Recipe: " + key);
            return StatusCode(204);
        }

        [Route("DeleteUsersRecipes/{userID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUsersRecipes(int userID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Recipe: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Recipe>(allKeys);
            List<Recipe> recipeList = new List<Recipe>();
            foreach(var keyValuePair in allKeyValuePairs){
                recipeList.Add(keyValuePair.Value);
            }
            List<Recipe> filteredRecipeList = new List<Recipe>();
            foreach(Recipe recipe in recipeList){
                if(recipe.UserID == userID){
                    await _redisCacheClient.GetDbFromConfiguration().RemoveAsync("Recipe: " + recipe.RecipeID);
                }
            }
            return StatusCode(204);
        }

        [Route("EditRecipe/{key}")]
        [HttpPut]
        public async Task<IActionResult> EditRecipe(string key, [FromBody] Recipe recipe)
        {
            await _redisCacheClient.Db0.AddAsync("Recipe: " + recipe.RecipeID, recipe, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }
    }
}
