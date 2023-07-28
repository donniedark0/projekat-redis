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
    public class IngredientController : Controller
    {
        private IRedisCacheClient _redisCacheClient;
        public IngredientController(IRedisCacheClient redisCacheClient)
        {
            _redisCacheClient = redisCacheClient;
        }

        [Route("PostIngredient")]
        [HttpPost]
        public async Task<IActionResult> AddIngredient([FromBody] Ingredient ingredient)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Ingredient: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Ingredient>(allKeys);
            bool check = false;
            foreach(var keyValuePair in allKeyValuePairs){
                if(keyValuePair.Value.Name == ingredient.Name)
                    check = true;
            }
            if(check)
                return StatusCode(409);
            else{                
                await _redisCacheClient.Db0.AddAsync("Ingredient: " + ingredient.IngredientID, ingredient, DateTimeOffset.Now.AddMinutes(6000));
                return StatusCode(204);
            }
        }

        [Route("GetFilteredIngredients")]
        [HttpPut]
        public async Task<List<Ingredient>> GetFilteredIngredients([FromBody] List<string> ids)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Ingredient: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Ingredient>(allKeys);
            List<Ingredient> ingredientList = new List<Ingredient>();
            foreach(var keyValuePair in allKeyValuePairs){
                ingredientList.Add(keyValuePair.Value);
            }
            List<Ingredient> filteredIngredientList = new List<Ingredient>();
            foreach(Ingredient ingredient in ingredientList)
                foreach(string id in ids)
                    if(ingredient.IngredientID.ToString() == id)
                        filteredIngredientList.Add(ingredient);
                
            return filteredIngredientList;
        }


        [Route("GetIngredients/{categoryID}")]
        [HttpPut]
        public async Task<List<Ingredient>> GetIngredients(int categoryID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Ingredient: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Ingredient>(allKeys);
            List<Ingredient> ingredientList = new List<Ingredient>();
            foreach(var keyValuePair in allKeyValuePairs){
                if(keyValuePair.Value.CategoryID == categoryID)
                    ingredientList.Add(keyValuePair.Value);
            }
            return ingredientList;
        }

        [Route("DeleteIngredient/{key}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteIngredient(string key)
        {
            await _redisCacheClient.GetDbFromConfiguration().RemoveAsync("Ingredient: " + key);
            return StatusCode(204);
        }

        [Route("DeleteIngredientsByCategory/{ID}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteIngredientsByCategory(int ID)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Ingredient: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Ingredient>(allKeys);
            List<Ingredient> ingredientList = new List<Ingredient>();
            foreach(var keyValuePair in allKeyValuePairs){
                ingredientList.Add(keyValuePair.Value);
            }
            List<Ingredient> filteredIngredientList = new List<Ingredient>();
            foreach(Ingredient Ingredient in ingredientList){
                if(Ingredient.CategoryID == ID){
                    await _redisCacheClient.GetDbFromConfiguration().RemoveAsync("Ingredient: " + Ingredient.IngredientID);
                }
            }
            return StatusCode(204);
        }

        [Route("EditIngredient/{key}")]
        [HttpPut]
        public async Task<IActionResult> EditIngredient(string key, [FromBody] Ingredient ingredient)
        {
            await _redisCacheClient.Db0.AddAsync("Ingredient: " + ingredient.IngredientID, ingredient, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }

    }
}