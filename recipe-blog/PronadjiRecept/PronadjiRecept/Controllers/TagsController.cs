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
    public class TagsController : Controller
    {
        private IRedisCacheClient _redisCacheClient;
        public TagsController(IRedisCacheClient redisCacheClient)
        {
            _redisCacheClient = redisCacheClient;
        }

        [Route("PostTag")]
        [HttpPost]
        public async Task<IActionResult> AddTag([FromBody] Tag tag)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Tag: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Tag>(allKeys);
            bool check = false;
            foreach(var keyValuePair in allKeyValuePairs){
                if(keyValuePair.Value.Name == tag.Name)
                    check = true;
            }
            if(check)
                return StatusCode(409);
            else{                
                await _redisCacheClient.Db0.AddAsync("Tag: " + tag.TagID, tag, DateTimeOffset.Now.AddMinutes(6000));
                return StatusCode(204);
            }
        }


        [Route("GetTags")]
        [HttpPut]
        public async Task<List<Tag>> GetTags([FromBody] List<string> ids)
        {
            var filteredTagIDs = new List<string>();
            foreach(var id in ids){
                filteredTagIDs.Add("Tag: " + id);
            }
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Tag>(filteredTagIDs);
            List<Tag> tagList = new List<Tag>();
            foreach(var keyValuePair in allKeyValuePairs){
                tagList.Add(keyValuePair.Value);
            }
            return tagList;
        }

        [Route("GetTags")]
        [HttpGet]
        public async Task<List<Tag>> GetAllTags()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Tag: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Tag>(allKeys);
            List<Tag> tagList = new List<Tag>();
            foreach(var keyValuePair in allKeyValuePairs){
                tagList.Add(keyValuePair.Value);
            }
            return tagList;
        }

        [Route("GetTagsNumber")]
        [HttpGet]
        public async Task<int> GetTagsNumber()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("Tag: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<Tag>(allKeys);
            List<Tag> tagList = new List<Tag>();
            foreach(var keyValuePair in allKeyValuePairs){
                tagList.Add(keyValuePair.Value);
            }
            return tagList.Count();
        }

        [Route("DeleteTag/{key}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteTag(string key)
        {
            await _redisCacheClient.GetDbFromConfiguration().RemoveAsync("Tag: " + key);
            return StatusCode(204);
        }

        [Route("EditTag/{key}")]
        [HttpPut]
        public async Task<IActionResult> EditTag(string key, [FromBody] Tag tag)
        {
            await _redisCacheClient.Db0.AddAsync("Tag: " + tag.TagID, tag, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }

    }
}