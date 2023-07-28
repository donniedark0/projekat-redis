import { Recipe } from "./recipe.js"

export class User{
    constructor(id, username, password, role){
        this.userID = id
        this.username = username;
        this.password = password;
        this.role = role;
    }

    DrawUser(host){
        var thisptr = this
        host.innerHTML=''
        var userInfoDiv = document.createElement("div")
        userInfoDiv.classList.add("user-info-div")

        var usernameInput = document.createElement("input")
        usernameInput.type = "text"

        var passwordInput = document.createElement("input")
        passwordInput.type = "text"

        userInfoDiv.appendChild(usernameInput)
        userInfoDiv.appendChild(passwordInput)

        var submitChangesBtn = document.createElement("button")
        submitChangesBtn.innerHTML = "Submit"

        submitChangesBtn.onclick = function() {
            fetch("https://localhost:5001/User/EditUser/" + thisptr.username,{
                method: 'PUT',
                mode: 'cors',headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userID: thisptr.userID,
                    username: userInfoDiv.querySelectorAll('input')[0].value,
                    password: userInfoDiv.querySelectorAll('input')[1].value,
                    role: thisptr.role
                })
            }).then(resp => {
                    if (resp.status == 204) {
                        alert("User succesfuly updated!")
                        thisptr.username = userInfoDiv.querySelectorAll('input')[0].value
                        thisptr.password = userInfoDiv.querySelectorAll('input')[1].value
                    }
                    else{
                        alert("Error")
                    }
                })
        }

        var deleteUserBtn = document.createElement("button")
        deleteUserBtn.innerHTML = "Delete account"

        deleteUserBtn.onclick = function(e) {
            e.preventDefault();
            if (confirm("Do you want to delete your account?")) {
                fetch("https://localhost:5001/Rating/DeleteUsersRatings/" + thisptr.userID, {
                    method: 'DELETE',
                    mode: 'cors'
                })
                fetch("https://localhost:5001/Comment/DeleteUsersComments/" + thisptr.userID, {
                    method: 'DELETE',
                    mode: 'cors'
                }).then(resp => {
                    if (resp.status == 204) {
                        fetch("https://localhost:5001/Recipe/DeleteUsersRecipes/" + thisptr.userID, {
                            method: 'DELETE',
                            mode: 'cors'
                        }).then(resp => {
                            if (resp.status == 204) {
                                fetch("https://localhost:5001/User/DeleteUser/" + thisptr.userID, {
                                    method: 'DELETE',
                                    mode: 'cors'
                                })
                            }
                        });
                    }
                    alert("Account sucessfully deleted!");
                });
            }
        }
        userInfoDiv.appendChild(deleteUserBtn)
        userInfoDiv.appendChild(submitChangesBtn)
        host.appendChild(userInfoDiv)

        var userRecipes = document.createElement("div")
        userRecipes.classList.add("user-filtered-recipes")
        fetch("https://localhost:5001/Recipe/GetUsersRecipes/" + thisptr.userID, {
            method: 'PUT',
            mode: 'cors'
        }).then(resp => {
            resp.json().then(data => {
                data.forEach(el => {
                    const recipe = new Recipe(el.recipeID, el.name, el.description, el.picture, el.userID, el.ingredientIDs, el.tagIDs);
                    recipe.DrawRecipe(userRecipes, thisptr);     
                });
            });
        });
        host.appendChild(userRecipes)
        
    }
}