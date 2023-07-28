import { Ingredient } from "./ingredient.js"

export class Category{
    constructor(id, name){
        this.id = id
        this.name = name
    }

    DrawCategory(host, role){
        var thisptr = this
        var singleCat = document.createElement("div")
        singleCat.classList.add("single-category")

        var nameAndButtons = document.createElement("div")
        nameAndButtons.classList.add("cat-name-buttons")

        var catName = document.createElement("h3")
        catName.classList.add("category-name")
        catName.innerHTML = this.name

        nameAndButtons.appendChild(catName)

        var ingredients = document.createElement("div")
        ingredients.classList.add("ingredients-div")
        var ingredientList = document.createElement("div")
        ingredientList.classList.add("ingredient-list")
        fetch("https://localhost:5001/Ingredient/GetIngredients/" + thisptr.id, {
            method: 'PUT',
            mode: 'cors',
            body: JSON.stringify(thisptr.id),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(p => {
                p.json().then(data => {
                    data.forEach(el => {
                        var ingredient = new Ingredient(el.ingredientID, el.name, el.categoryID)
                        ingredient.DrawIngredient(ingredientList, role) 
                });
            })
        })
        if(role == 1){
            var addIngBtn = document.createElement("button")
            addIngBtn.classList.add("add-ing-btn")
            addIngBtn.innerHTML = "Add an ingredient"

            var inputName
            addIngBtn.onclick = function() {
                var numOfIng = document.getElementsByClassName("single-ingredient")
                var id = numOfIng.length + 1
                var namePrompt = prompt("Ingredient name:")
                if(namePrompt != null){
                    inputName = namePrompt

                    fetch("https://localhost:5001/Ingredient/PostIngredient", {
                        method: 'POST',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ingredientID: id,
                            name: inputName,
                            categoryID: thisptr.id
                        })
                    }).then(resp => {
                        if (resp.status == 204) {
                            const ingredient = new Ingredient(id, inputName, thisptr.id)
                            ingredient.DrawIngredient(ingredientList, role)
                            alert("Ingredient succesfuly added!")
                        }
                        else{
                            alert("Error")
                        }
                    });
                }
            }

            ingredients.appendChild(addIngBtn)

            var editCatBtn = document.createElement("button");
            editCatBtn.innerHTML = "&#9998;";
            editCatBtn.classList.add("edit-delete");
            editCatBtn.onclick = function(e) {
                e.preventDefault();
                var newName = prompt("New category name:");
                if (newName != null) {
                    fetch("https://localhost:5001/Category/EditCategory/" + thisptr.id, {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            categoryID: thisptr.id,
                            name: newName
                        })
                    }).then(resp => {
                        if (resp.status == 204) {
                            document.querySelectorAll(".category-name").forEach(el=>{
                                if(el.innerText == thisptr.name){
                                    el.innerText = newName
                                    thisptr.name = newName;
                                }
                            })
                            alert("Category edited succesfully!");
                        }
                    });
                }
            }
            nameAndButtons.appendChild(editCatBtn);

            
            var deleteCatBtn = document.createElement("button")
            deleteCatBtn.classList.add("edit-delete")
            deleteCatBtn.innerHTML = "&times;"

            deleteCatBtn.onclick = function(e) {
                e.preventDefault();
            if (confirm("Do you want to delete this category?")) {
                fetch("https://localhost:5001/Ingredient/DeleteIngredientsByCategory/" + thisptr.id, {
                    method: 'DELETE',
                    mode: 'cors'
                    }).then(resp => {
                        if (resp.status == 204) {
                            fetch("https://localhost:5001/Category/DeleteCategory/" + thisptr.id, {
                                method: 'DELETE',
                                mode: 'cors'
                            }).then(resp => {
                                if(resp.status == 204){
                                    document.querySelectorAll(".category-name").forEach(p =>{
                                        const parent = p.parentNode;
                                        if(p.innerText == thisptr.name){
                                            while(parent.firstChild){
                                                parent.removeChild(parent.firstChild);
                                            }
                                            const MainParent = parent.parentNode;
                                            while(parent.firstChild){
                                                MainParent.removeChild(MainParent.firstChild);
                                            }
                                            MainParent.remove();
                                        }
                                    
                                    })
                                    alert("Category sucessfuly deleted!");
                                }
                            })
                        }
                    });
                }
            }
            nameAndButtons.appendChild(deleteCatBtn)
        }
        ingredients.appendChild(ingredientList)
        singleCat.appendChild(nameAndButtons)
        singleCat.appendChild(ingredients)
        host.appendChild(singleCat)
    }
}
