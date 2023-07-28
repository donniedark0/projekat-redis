export class Comment{
    constructor(id, cont, user, recipeid){
        this.id = id
        this.content = cont
        this.userID = user
        this.recipeID = recipeid
    }

    DrawComment(host, user){
        var thisptr = this
        var singleComment = document.createElement("div")


        var contentDiv = document.createElement("div")
        contentDiv.classList.add("comment-content-div")
        contentDiv.innerHTML = user.username + ": " + thisptr.content

        singleComment.appendChild(contentDiv)

        var editBtn =  document.createElement("button")
        editBtn.classList.add("edit-comment")
        editBtn.innerHTML = "Edit"

        var DelBtn =  document.createElement("button")
        DelBtn.classList.add("delete-comment")
        DelBtn.innerHTML = "Delete"

        if(user.userID == this.userID) {

            var contentTextarea = document.createElement("textarea")
            contentTextarea.id = "comment-textarea"
            contentTextarea.innerHTML = thisptr.content

            contentDiv.onclick = function() {
                contentDiv.innerHTML = ''

                singleComment.appendChild(contentTextarea)
                singleComment.appendChild(editBtn)
                singleComment.appendChild(DelBtn)


            }

            editBtn.onclick = function() {
                fetch("https://localhost:5001/Comment/EditComment/" + thisptr.recipeID + "/" + thisptr.id, {
                    method: 'PUT',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        commentID: thisptr.id,
                        content: singleComment.querySelectorAll('textarea')[0].value,
                        userID: thisptr.userID,
                        recipeID: thisptr.recipeID
                    })
                }).then( resp => {
                        if (resp.status == 204) {
                            alert("Comment succesfuly updated!")
                            contentDiv.innerHTML = user.username + ": " + singleComment.querySelectorAll('textarea')[0].value
                            singleComment.innerHTML=''
                            singleComment.appendChild(contentDiv)
                        }
                        else{
                            alert("Error")
                        }
                    })
            }

            DelBtn.onclick = function(e) {
                e.preventDefault();
            if (confirm("Do you want to delete this comment?")) {
                fetch("https://localhost:5001/Comment/DeleteComment/" + thisptr.recipeID + "/" + thisptr.id, {
                    method: 'DELETE',
                    mode: 'cors'
                    }).then(resp => {
                        if (resp.status == 204) {
                            while(singleComment.firstChild){
                                singleComment.firstChild.remove()
                            }
                            alert("Comment sucessfuly deleted!");
                        }
                    });
                }
            }
            
        }
        host.appendChild(singleComment)
    }
}