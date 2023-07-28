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
    public class CategoryController : Controller
    {
        private IRedisCacheClient _redisCacheClient;
        public CategoryController(IRedisCacheClient redisCacheClient)
        {
            _redisCacheClient = redisCacheClient;
        }

        [Route("PostCategory")]
        [HttpPost]
        public async Task<IActionResult> AddCategory([FromBody] Category category)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Category: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Category>(allKeys);
            bool check = false;
            foreach(var keyValuePair in allKeyValuePairs){
                if(keyValuePair.Value.Name == category.Name)
                    check = true;
            }
            if(check)
                return StatusCode(409);
            else{                
                await _redisCacheClient.Db0.AddAsync("Category: " + category.CategoryID, category, DateTimeOffset.Now.AddMinutes(6000));
                return StatusCode(204);
            }
        }


        [Route("GetCategories")]
        [HttpGet]
        public async Task<List<Category>> GetCategories()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Category: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Category>(allKeys);
            List<Category> categoryList = new List<Category>();
            foreach(var keyValuePair in allKeyValuePairs){
                categoryList.Add(keyValuePair.Value);
            }
            return categoryList;
        }

        [Route("GetCategoryNumber")]
        [HttpGet]
        public async Task<int> GetCategoryNumber()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Category: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Category>(allKeys);
            List<Category> categoryList = new List<Category>();
            foreach(var keyValuePair in allKeyValuePairs){
                categoryList.Add(keyValuePair.Value);
            }
            return categoryList.Count();
        }


        [Route("DeleteCategory/{key}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteCategory(string key)
        {
            await _redisCacheClient.GetDbFromConfiguration().RemoveAsync("Category: " + key);
            return StatusCode(204);
        }

        [Route("EditCategory/{key}")]
        [HttpPut]
        public async Task<IActionResult> EditCategory(string key, [FromBody] Category category)
        {
            await _redisCacheClient.Db0.AddAsync("Category: " + category.CategoryID, category, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }
    }
}
