import { Ingredient } from "./ingredient.js"
import { Tag } from "./tags.js"
import { Comment } from "./comment.js"
import { DrawRecipeInput } from "./main.js"

export class Recipe{
    constructor(id, name, description, picture, userid, ingredients, tagids){
        this.id = id
        this.name = name
        this.description = description
        this.picture = picture
        this.userID = userid
        this.ingredients = ingredients
        this.tagIDs = tagids 
    }

    DrawRecipe(host, user){
        console.log(user);
        var thisptr = this
        
        var singleRecipe = document.createElement("div")
        singleRecipe.classList.add("single-recipe")
        singleRecipe.value = thisptr.id
        
        var recipeName = document.createElement("h4")
        recipeName.innerHTML = this.name

        var recipePic = document.createElement("img")
        recipePic.classList.add("recipe-pic")
        recipePic.src = 'pics/' + this.picture

        recipePic.onclick = function() {
            host.innerHTML = ''

            var bigSingleRecipe = document.createElement("div")
            bigSingleRecipe.classList.add("big-single-recipe")

            var recipeInfo = document.createElement("div")
            recipeInfo.classList.add("recipe-info-div")

            var picNameRatingTags = document.createElement("div")
            picNameRatingTags.classList.add("pic-name-rating")
            
            var pic = document.createElement("img")
            pic.classList.add("recipe-big-picture")
            pic.src = 'pics/' + thisptr.picture

            picNameRatingTags.appendChild(pic)

            var nameDiv = document.createElement("div")
            nameDiv.classList.add("recipe-name-and-btns")

            var name = document.createElement("h3")
            name.classList.add("recipe-big-name")
            name.innerHTML = thisptr.name

            nameDiv.appendChild(name)

            picNameRatingTags.appendChild(nameDiv)

            var ratingDiv = document.createElement("div")
            ratingDiv.classList.add("recipe-big-rating")

            var rating = document.createElement("h3")
            rating.classList.add("recipe-rating")
            
            
            fetch("https://localhost:5001/Rating/CalculateRating/" + thisptr.id,{
                method: 'PUT',
                mode: 'cors'
            }).then( p => {
                p.json().then(data => {
                    rating.innerHTML = "Rating: " + data
                });
            });

            ratingDiv.appendChild(rating)
            picNameRatingTags.appendChild(ratingDiv)

            var tagsBigDiv = document.createElement("div")
            tagsBigDiv.classList.add("tags-big-div")

            fetch("https://localhost:5001/Tags/GetTags",{
                method: 'PUT',
                mode: 'cors',
                body: JSON.stringify(thisptr.tagIDs),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then( p => {
                p.json().then(data => {
                    data.forEach(el => {
                        const tag = new Tag(el.tagID, el.name)
                        var tagDiv = document.createElement("div")
                        tagDiv.classList.add("tag-big")
                        var tagName = document.createElement("h5")
                        tagName.innerHTML = tag.name
                        tagDiv.appendChild(tagName)
                        tagsBigDiv.appendChild(tagDiv)
                    });
                });
            });

            picNameRatingTags.appendChild(tagsBigDiv)

            recipeInfo.appendChild(picNameRatingTags)
            
            var recipeDesc = document.createElement("div")
            recipeDesc.classList.add("recipe-full-description")

            recipeDesc.innerHTML = thisptr.description

            recipeInfo.appendChild(recipeDesc)

            var commentSection = document.createElement("div")
            commentSection.classList.add("comment-section")

            if(user.role != 0 ){

                var ratingBtns = document.createElement("div")
                for(var i=1; i<6; i++){
                    var mark = document.createElement("button")
                    mark.id = "mark-btn-" + i
                    mark.innerHTML = i
                    mark.value = i
                    ratingBtns.appendChild(mark)
                }

                var numOfRatings
                fetch("https://localhost:5001/Rating/GetRatingNumber").then(p => {
                    p.json().then(data => {
                        numOfRatings = data
                    })
                })
                numOfRatings += 1
                ratingBtns.querySelectorAll('button').forEach(element => {
                    element.onclick = function () {
                        fetch("https://localhost:5001/Rating/PostRating", {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                ratingID: numOfRatings,
                                mark: Number(this.value),
                                userID: thisptr.userID,
                                recipeID: thisptr.id
                            })
                        }).then(resp => {
                            if (resp.status == 204) {
                                fetch("https://localhost:5001/Rating/CalculateRating/" + thisptr.id,{
                                    method: 'PUT',
                                    mode: 'cors'
                                }).then( p => {
                                    p.json().then(data => {
                                        rating.innerHTML = "Rating: " + data
                                        numOfRatings += 1
                                    });
                                })
                            }
                            else if(resp.status == 409){
                                fetch("https://localhost:5001/Rating/EditRating", {
                                    method: 'PUT',
                                    mode: 'cors',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        ratingID: numOfRatings,
                                        mark: Number(this.value),
                                        userID: thisptr.userID,
                                        recipeID: thisptr.id
                                    })
                                }).then( resp => {
                                        if (resp.status == 204) {
                                            fetch("https://localhost:5001/Rating/CalculateRating/" + thisptr.id,{
                                                method: 'PUT',
                                                mode: 'cors'
                                            }).then( p => {
                                                p.json().then(data => {
                                                    rating.innerHTML = "Rating: " + data
                                                });
                                            })
                                        }
                                    })
                            }
                            else{
                                alert("Error")
                            }
                        });
                    }
                })

                var newCommentDiv = document.createElement("div")
                newCommentDiv.classList.add("new-comment-div")

                var newCommentInput = document.createElement("textarea")
                newCommentInput.id = "comment-textarea"

                var addCommentBtn = document.createElement("button")
                addCommentBtn.classList.add("add-comment-btn")
                addCommentBtn.innerHTML = "Comment"

                newCommentDiv.appendChild(newCommentInput)
                newCommentDiv.appendChild(addCommentBtn)
                commentSection.appendChild(newCommentDiv)

                var numOfCom
                    fetch("https://localhost:5001/Comment/GetCommentNumber").then(p => {
                        p.json().then(data => {
                            numOfCom = data
                        })
                    })
                    numOfCom += 1
                addCommentBtn.onclick = function() {

                        fetch("https://localhost:5001/Comment/PostComment", {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                commentID: numOfCom,
                                content: document.getElementById("comment-textarea").value,
                                userID: thisptr.userID,
                                recipeID: thisptr.id
                            })
                        }).then(resp => {
                            if (resp.status == 204) {
                                const comment = new Comment(numOfCom, document.getElementById("comment-textarea").value, user.userID, thisptr.id)
                                comment.DrawComment(commentSection, user)
                                alert("Comment succesfuly added!")
                                numOfCom += 1
                            }
                            else{
                                alert("Error")
                            }
                        });
                }
                ratingDiv.appendChild(ratingBtns)
            }

            fetch("https://localhost:5001/Comment/GetComments/" + thisptr.id,{
                method: 'PUT',
                mode: 'cors'
            }).then( p => {
                p.json().then(data => {
                    data.forEach(el => {
                        var comment = new Comment(el.commentID, el.content, el.userID, thisptr.id)
                        comment.DrawComment(commentSection, user)
                    });
                })
            });

            bigSingleRecipe.appendChild(recipeInfo)
            bigSingleRecipe.appendChild(commentSection)

            host.appendChild(bigSingleRecipe)
        }

        var ingredientList = document.createElement("div")
        ingredientList.classList.add("recipe-ing-list")

        var tagList = document.createElement("div")
        tagList.classList.add("recipe-tags")

        var recipeDesc = document.createElement("div")
        recipeDesc.classList.add("recipe-desc")
        recipeDesc.innerHTML = this.description

        singleRecipe.appendChild(recipePic)
        singleRecipe.appendChild(recipeName)
        singleRecipe.appendChild(recipeDesc)

        fetch("https://localhost:5001/Ingredient/GetFilteredIngredients",{
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(thisptr.ingredients),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( p => {
            p.json().then(data => {
                data.forEach(el => {
                    const ingredient = new Ingredient(el.IngredientID, el.name)
                    var ingDiv = document.createElement("div")
                    ingDiv.classList.add("ingredient")
                    var ingName = document.createElement("h5")
                    ingName.innerHTML = ingredient.name
                    ingDiv.appendChild(ingName)
                    ingredientList.appendChild(ingDiv)
                });
            });
        });

        fetch("https://localhost:5001/Tags/GetTags",{
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(thisptr.tagIDs),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then( p => {
            p.json().then(data => {
                data.forEach(el => {
                    const tag = new Tag(el.tagID, el.name)
                    var tagDiv = document.createElement("div")
                    tagDiv.classList.add("tag")
                    var tagName = document.createElement("h5")
                    tagName.innerHTML = tag.name
                    tagDiv.appendChild(tagName)
                    tagList.appendChild(tagDiv)
                });
            });
        });

        singleRecipe.appendChild(ingredientList)
        singleRecipe.appendChild(tagList)

        if(thisptr.userID == user.userID){

            var editRecipe = document.createElement("button")
            editRecipe.classList.add("edit-delete-recipe")
            editRecipe.innerHTML = "Edit"

            singleRecipe.appendChild(editRecipe)

            editRecipe.onclick = function () {
                var recipeDiv = document.getElementById("recipes")
                recipeDiv.innerHTML = ''

                DrawRecipeInput(recipeDiv)

                document.getElementById("recipe-name-input").value = thisptr.name
                document.getElementById("recipe-picture-input").value = thisptr.picture
                document.getElementById("recipe-desc-textarea").value = thisptr.description
                
                document.getElementById("submit-recipe").onclick = function(){

                    var checkedIngredients = [];
                    var checkboxes = document.getElementById("category").querySelectorAll('input[type=checkbox]:checked')
                    for(var i = 0; i < checkboxes.length; i++){
                        checkedIngredients.push(checkboxes[i].value)
                    }

                    var checkedTags = [];
                    var checkboxes = document.getElementById("recipes").querySelectorAll('input[type=checkbox]:checked')
                    for(var i = 0; i < checkboxes.length; i++){
                        checkedTags.push(checkboxes[i].value)
                    }

                    fetch("https://localhost:5001/Recipe/EditRecipe/" + thisptr.id, {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            recipeID: thisptr.id,
                            name: document.getElementById("recipe-name-input").value,
                            description: document.getElementById("recipe-desc-textarea").value,
                            picture: document.getElementById("recipe-picture-input").value,
                            userID: thisptr.userID,
                            ingredientIDs: checkedIngredients,
                            tagIDs: checkedTags
                        })
                    }).then(resp => {
                        if (resp.status == 204) {
                            alert("Recipe succesfuly edited!")
                        }
                        else{
                            alert("Error")
                        }
                    });
                }

            }

            var deleteRecipe = document.createElement("button")
            deleteRecipe.classList.add("edit-delete-recipe")
            deleteRecipe.innerHTML = "Delete"

            singleRecipe.appendChild(deleteRecipe)

            deleteRecipe.onclick = function (e) {
                e.preventDefault();
                if (confirm("Do you want to delete this recipe?")) {
                    fetch("https://localhost:5001/Recipe/DeleteRecipe/" + thisptr.id, {
                        method: 'DELETE',
                        mode: 'cors'
                    }).then(resp => {
                        if (resp.status == 204) {
                            while(singleRecipe.firstChild){
                                singleRecipe.firstChild.remove()
                            }
                            singleRecipe.remove();
                            fetch("https://localhost:5001/Rating/DeleteRecipeRatings/" + thisptr.id, {
                                method: 'DELETE',
                                mode: 'cors'
                            })

                            fetch("https://localhost:5001/Comment/DeleteRecipeComments/" + thisptr.id, {
                                method: 'DELETE',
                                mode: 'cors'
                            })
                            alert("Recipe sucessfully deleted");
                        }
                    });
                }
            }
        }

        host.appendChild(singleRecipe)

    }
}