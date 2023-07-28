export class Tag{
    constructor(id, name){
        this.id = id
        this.name = name
    }

    Drawtag(host, role) {
        var singleTag = document.createElement("div")
        singleTag.classList.add("single-ingredient")

        var nameCheckbox = document.createElement("input")
        nameCheckbox.classList.add("name-checkbox")
        nameCheckbox.type = "checkbox";
        nameCheckbox.setAttribute("value", this.id)

        var nameLbl = document.createElement("label")
        nameLbl.innerHTML = this.name
        nameLbl.classList.add("ing-name-label")
        var br = document.createElement("br")

        singleTag.appendChild(nameCheckbox)
        singleTag.appendChild(nameLbl)
        singleTag.appendChild(br)


        if(role == 1){
            var thisptr = this
            var deleteTagBtn = document.createElement("button");
            deleteTagBtn.classList.add("edit-delete");
            deleteTagBtn.innerHTML = "&times;"
            var id = this.id;

            deleteTagBtn.onclick = function(e) {
                e.preventDefault();
                if (confirm("Do you want to delete this tag?")) {
                    fetch("https://localhost:5001/Tags/DeleteTag/" + id, {
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
                            alert("Tag sucessfully deleted");
                        }
                    });
                }
            }
            singleTag.appendChild(deleteTagBtn);

            var editTagBtn = document.createElement("button");
            editTagBtn.innerHTML = "&#9998;";
            editTagBtn.classList.add("edit-delete");
            editTagBtn.onclick = function(e) {
                e.preventDefault();
                var newName = prompt("New tag name:");
                if (newName != null) {
                    fetch("https://localhost:5001/Tags/EditTag/" + id, {
                        method: 'PUT',
                        mode: 'cors',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            tagID: id,
                            name: newName
                        })
                    }).then(resp => {
                        if (resp.status == 204) {
                            document.querySelectorAll(".ing-name-label").forEach(el=>{
                                if(el.innerText == thisptr.name){
                                    el.innerText = newName
                                    thisptr.name = newName;
                                }
                            })
                            alert("Tag edited succesfully!");
                        }
                    });
                }
            }
            singleTag.appendChild(editTagBtn);

        }
        host.appendChild(singleTag)
    }
}