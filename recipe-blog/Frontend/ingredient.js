export class Ingredient {
    constructor(id, name, categoryID) {
        this.id = id
        this.name = name
        this.categoryID = categoryID
    }



    DrawIngredient(host, role) {
        var thisptr = this
        var singleIng = document.createElement("div")
        singleIng.classList.add("single-ingredient")

        var nameCheckbox = document.createElement("input")
        nameCheckbox.classList.add("name-checkbox")
        nameCheckbox.type = "checkbox";
        nameCheckbox.setAttribute("value", this.id)

        var nameLbl = document.createElement("label")
        nameLbl.innerHTML = this.name
        nameLbl.classList.add("ing-name-label")
        var br = document.createElement("br")

        singleIng.appendChild(nameCheckbox)
        singleIng.appendChild(nameLbl)
        singleIng.appendChild(br)
        if(role == 1){
            var deleteIngBtn = document.createElement("button");
            deleteIngBtn.classList.add("edit-delete");
            deleteIngBtn.innerHTML = "&times;"
            var id = this.id;

            deleteIngBtn.onclick = function(e) {
                e.preventDefault();
                if (confirm("Do you want to delete this ingredient?")) {
                    fetch("https://localhost:5001/Ingredient/DeleteIngredient/" + id, {
                        method: 'DELETE',
                        mode: 'cors'
                    }).then(resp => {
                        if (resp.status == 204) {
                            document.querySelectorAll(".name-checkbox").forEach(p =>{
                                const parent = p.parentNode;
                                if(p.value == id){
                                    while(p.firstChild){
                                        parent.removeChild(parent.firstChild);
                                    }
                                    parent.remove();
                                }
                            })
                            alert("Ingredient sucessfully deleted");
                        }
                    });
                }
            }
            singleIng.appendChild(deleteIngBtn);

            var editIngBtn = document.createElement("button");
            editIngBtn.innerHTML = "&#9998;";
            editIngBtn.classList.add("edit-delete");
            editIngBtn.onclick = function(e) {
                e.preventDefault();
                var newName = prompt("New ingredient name:");
                if (newName != null) {
                    fetch("https://localhost:5001/Ingredient/EditIngredient/" + id, {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ingredientID: id,
                            name: newName,
                            categoryID: thisptr.categoryID
                        })
                    }).then(resp => {
                        if (resp.status == 204) {
                            document.querySelectorAll(".ing-name-label").forEach(el=>{
                                if(el.innerText == thisptr.name){
                                    el.innerText = newName
                                    thisptr.name = newName;
                                }
                            })
                            alert("Ingredient edited succesfully!");
                        }
                    });
                }
            }
            singleIng.appendChild(editIngBtn);
        }
        host.appendChild(singleIng)
    }
}