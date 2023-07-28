import { Category } from "./category.js";
import { Ingredient } from "./ingredient.js";
import { Recipe } from "./recipe.js";
import { Tag } from "./tags.js";
import { User } from "./user.js";

var user = new User()
user.role = 0

var categoryDiv = document.getElementById("all-categories")
var titleANdBtns = document.getElementById("title-and-buttons")
var recipesDiv = document.getElementById("recipes")
var loginForm = document.getElementById("login-form")

var myAccountBtn = document.createElement("button");
myAccountBtn.classList.add("my-account-btn")
myAccountBtn.innerHTML = "My account"

var createRecipeBtn = document.createElement("button");
createRecipeBtn.classList.add("create-recipe-btn")
createRecipeBtn.innerHTML = "Add new recipe"

CallCategory(user.role)

document.getElementById("login-btn").onclick = function() {
    var username = document.getElementById("username")
    var pass = document.getElementById("password")

        fetch("https://localhost:5001/User/GetUser/" + username.value + "/" + pass.value).then(p => {

            p.json().then(data => {
                if(data.status == 404)
                    alert("Wrong password!")
                else{
                    console.log(user)
                    user = new User(data.userID, data.username, data.password, data.role)
                    categoryDiv.innerHTML = ''
                    CallCategory(user.role)

                    loginForm.innerHTML=''
                    loginForm.appendChild(myAccountBtn)
                    loginForm.appendChild(createRecipeBtn)
                    console.log(user)
                }
            })
        })
    }

var numOfUsers = 0
    fetch("https://localhost:5001/User/GetUserNumber").then(p => {
        p.json().then(data => {
            numOfUsers = data
        })
    })
numOfUsers += 1
document.getElementById("register-btn").onclick = function() {
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value

    fetch("https://localhost:5001/User/PostUser", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: numOfUsers,
                username: username,
                password: password,
                role: 2
            })
        }).then(resp => {
            if (resp.status == 204) {
                alert("Registration was successful!")
                loginForm.innerHTML=''
                loginForm.appendChild(myAccountBtn)
                loginForm.appendChild(createRecipeBtn)
                user = new User(numOfUsers, username, password, role)
                numOfUsers += 1
            }
            else if(resp.status == 409) {
               alert("Username is already taken!")
            }
            else {
                alert("Error")
            }
        });
}


myAccountBtn.onclick = function(){
    user.DrawUser(recipesDiv)
}

createRecipeBtn.onclick = function() {

    recipesDiv.innerHTML = ''

    DrawRecipeInput(recipesDiv)

    var numOfRec
    fetch("https://localhost:5001/Recipe/GetRecipeNumber").then(p => {
        p.json().then(data => {
            numOfRec = data
        })
    })

    document.getElementById("submit-recipe").onclick = function() {

        var checkedIngredients = [];
        var checkboxes = categoryDiv.querySelectorAll('input[type=checkbox]:checked')
        for(var i = 0; i < checkboxes.length; i++){
            checkedIngredients.push(checkboxes[i].value)
        }

        var checkedTags = [];
        var checkboxes = recipesDiv.querySelectorAll('input[type=checkbox]:checked')
        for(var i = 0; i < checkboxes.length; i++){
            checkedTags.push(checkboxes[i].value)
        }

        fetch("https://localhost:5001/Recipe/PostRecipe", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipeID: numOfRec + 1,
                name: document.getElementById("recipe-name-input").value,
                description: document.getElementById("recipe-desc-textarea").value,
                picture: document.getElementById("recipe-picture-input").value,
                userID: user.userID,
                ingredientIDs: checkedIngredients,
                tagIDs: checkedTags
            })
        }).then(resp => {
            if (resp.status == 204) {
                alert("Recipe succesfuly added!")
                numOfRec += 1
            }
            else{
                alert("Error")
            }
        });
    }
}

export function DrawRecipeInput(host){

    var createRecipeDiv = document.createElement("div")

    var submitRecipe = document.createElement("button")
    submitRecipe.id = "submit-recipe"
    submitRecipe.innerHTML = "Submit a recipe"

    var nameInput = document.createElement("input")
    nameInput.id = "recipe-name-input"
    nameInput.type = "text"
    nameInput.placeholder = "Recipe name"
    
    var pictureInput = document.createElement("input")
    pictureInput.id = "recipe-picture-input"
    pictureInput.type = "text"
    pictureInput.placeholder = "picture.extesion"

    var descTextArea = document.createElement("textarea")
    descTextArea.id = "recipe-desc-textarea"
    descTextArea.placeholder = "Recipe description"

    var tagsDiv = document.createElement("div")
    tagsDiv.classList.add("tags-big-div")

    fetch("https://localhost:5001/Tags/GetTags").then( p => {
        p.json().then(data => {
            data.forEach(el => {
                const tag = new Tag(el.tagID, el.name)
                tag.Drawtag(tagsDiv)
            });
        });
    });

    

    createRecipeDiv.appendChild(nameInput)
    createRecipeDiv.appendChild(pictureInput)
    createRecipeDiv.appendChild(descTextArea)
    createRecipeDiv.appendChild(tagsDiv)        
    createRecipeDiv.appendChild(submitRecipe)

    host.appendChild(createRecipeDiv)
}

function CallCategory(userRole) { 
    fetch("https://localhost:5001/Category/GetCategories").then(p => {
        p.json().then(data => {
            data.forEach(el => {
                var category = new Category(el.categoryID, el.name)
                category.DrawCategory(categoryDiv, userRole)
            });
        })
    })

    if(userRole == 1){
        
        var addCatBtn = document.createElement("button")
        addCatBtn.classList.add("find-btn")
        addCatBtn.innerHTML = "Add a category"

        var numOfCateg = 0
        fetch("https://localhost:5001/Category/GetCategoryNumber").then(p => {
            p.json().then(data => {
                console.log(data)
                numOfCateg += data
            })
        })
        numOfCateg += 1

        addCatBtn.onclick = function(e) {
            e.preventDefault();
            var newName = prompt("Category name:");
            if (newName != null) {
                fetch("https://localhost:5001/Category/PostCategory", {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        categoryID: numOfCateg,
                        name: newName
                    })
                }).then(resp => {
                    if (resp.status == 204) {
                        const category = new Category(numOfCateg, newName)
                        category.DrawCategory(categoryDiv, user.role)
                        alert("Category succesfuly added!")
                        numOfCateg += 1
                    }
                    else{
                        alert("Error")
                    }
                });
            }
        }

        var tagsDiv = document.createElement("div")
        tagsDiv.classList.add("single-category")
        var tagsTitle = document.createElement("h3")
        tagsTitle.innerHTML = "TAGS"
        tagsDiv.appendChild(tagsTitle)

        var addTagdBtn = document.createElement("button")
        addTagdBtn.classList.add("add-ing-btn")
        addTagdBtn.innerHTML = "Add a tag"

        var numOfTags = 0
        fetch("https://localhost:5001/Tags/GetTagsNumber").then(p => {
            p.json().then(data => {
                numOfTags += data
            })
        })
        numOfTags += 1
    
        addTagdBtn.onclick = function(e) {
            e.preventDefault();
            var newName = prompt("Tag name:");
            if (newName != null) {
                fetch("https://localhost:5001/Tags/PostTag", {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tagID: numOfTags,
                        name: newName
                    })
                }).then(resp => {
                    if (resp.status == 204) {
                        const tag = new Tag(numOfTags, newName)
                        tag.Drawtag(tagsDiv, user.role)
                        alert("Tag succesfuly added!")
                        numOfTags += 1
                    }
                    else{
                        alert("Error")
                    }
                });
            }
        }

        categoryDiv.appendChild(tagsDiv)
        tagsDiv.appendChild(addTagdBtn)

        fetch("https://localhost:5001/Tags/GetTags").then( p => {
            p.json().then(data => {
                data.forEach(el => {
                    const tag = new Tag(el.tagID, el.name)
                    tag.Drawtag(tagsDiv, user.role)
                });
            });
        });



        titleANdBtns.appendChild(addCatBtn)
    }
}
document.getElementById("find-btn").onclick = function(){
    recipesDiv.innerHTML=''
    var checkedIngredients = [];

    var checkboxes = document.querySelectorAll('input[type=checkbox]:checked')
    for(var i = 0; i < checkboxes.length; i++){
        checkedIngredients.push(checkboxes[i].value)
    }

    var stringified = JSON.stringify(checkedIngredients)

    fetch("https://localhost:5001/Recipe/GetFilteredRecipes", {
                method: 'PUT',
                mode: 'cors',
                body: stringified,
                headers: {
                    'Content-Type': 'application/json'
                }
    }).then(resp => {
        resp.json().then(data => {
            data.forEach(el => {
                const recipe = new Recipe(el.recipeID, el.name, el.description, el.picture, el.userID, el.ingredientIDs, el.tagIDs);
                recipe.DrawRecipe(recipesDiv, user);
            });
        });
    });
}



/*fetch("https://localhost:5001/Ingredient/GetIngredients").then(p => {
    p.json().then(data => {
        data.forEach(ingredient => {
            const ing = new Ingredient(ingredient.id, ingredient.name, ingredient.categoryID);
            ing.DrawIngredient(document.body)
        });
    })


    


});*/