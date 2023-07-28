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
    public class UserController : Controller
    {
        private IRedisCacheClient _redisCacheClient;
        public UserController(IRedisCacheClient redisCacheClient)
        {
            _redisCacheClient = redisCacheClient;
        }

        [Route("PostUser")]
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] User user)
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("User: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<User>(allKeys);
            foreach(var keyValuePair in allKeyValuePairs){
                if(keyValuePair.Value.Username == user.Username)
                    return StatusCode(409);
            }
                await _redisCacheClient.Db0.AddAsync("User: " + user.Username, user, DateTimeOffset.Now.AddMinutes(6000));
                return StatusCode(204);
        }

        [Route("GetUserNumber")]
        [HttpGet]
        public async Task<int> GetUserNumber()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("User: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<User>(allKeys);
            List<User> userList = new List<User>();
            foreach(var keyValuePair in allKeyValuePairs){
                userList.Add(keyValuePair.Value);
            }
            return userList.Count();
        }

        [Route("GetUsers")]
        [HttpGet]
        public async Task<List<User>> GetUsers()
        {
            var allKeys = (await _redisCacheClient.Db0.SearchKeysAsync("User: *")).ToList();
            var allKeyValuePairs = await _redisCacheClient.Db0.GetAllAsync<User>(allKeys);
            List<User> userList = new List<User>();
            foreach(var keyValuePair in allKeyValuePairs){
                userList.Add(keyValuePair.Value);
            }
            return userList;
        }

        [Route("GetUser/{username}/{password}")]
        [HttpGet]
        public async Task<ActionResult<User>> GetUser(string username, string password)
        {
            var key = (await _redisCacheClient.Db0.SearchKeysAsync("User: " + username)).ToList();
            if(key != null){
                var keyValuePair = await _redisCacheClient.Db0.GetAllAsync<User>(key);
                User user = new User();
                if (keyValuePair.ToList()[0].Value.Password == password){
                    user = keyValuePair.ToList()[0].Value;
                    return user;
                }
                else
                    return StatusCode(404); 
            }
            else
                return StatusCode(404);
        }

        [Route("DeleteUser/{key}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteUser(int key)
        {
            await _redisCacheClient.GetDbFromConfiguration().RemoveAsync("User: " + key);
            return StatusCode(204);
        }

        [Route("EditUser/{key}")]
        [HttpPut]
        public async Task<IActionResult> EditUser(string key, [FromBody] User user)
        {
            
            await _redisCacheClient.GetDbFromConfiguration().RemoveAsync("User: " + key);
            await _redisCacheClient.Db0.AddAsync("User: " + user.Username, user, DateTimeOffset.Now.AddMinutes(6000));
            return StatusCode(204);
        }

    }
}