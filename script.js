document.addEventListener("DOMContentLoaded", function() {
    fetchPosts();
});


function fetchPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById("post-list");
            postList.innerHTML = ''; 
            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.classList.add('post');
                postItem.innerHTML = `
                    <h2>${post.title}</h2>
                    <p>${post.body}</p>
                    <button class="edit-btn" data-id="${post.id}">Edit</button>
                    <button class="delete-btn" data-id="${post.id}">Delete</button>
                `;
                postList.appendChild(postItem);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
}


const addPostForm = document.getElementById("add-post-form");

addPostForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = document.getElementById("post-title").value;
    const body = document.getElementById("post-body").value;

    const newPost = {
        title: title,
        body: body,
        userId: 1
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost)
    })
    .then(response => response.json())
    .then(post => {
        const postList = document.getElementById("post-list");
        const postItem = document.createElement('div');
        postItem.classList.add('post');
        postItem.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <button class="edit-btn" data-id="${post.id}">Edit</button>
            <button class="delete-btn" data-id="${post.id}">Delete</button>
        `;
        postList.prepend(postItem); 
        showModal("add");
    })
    .catch(error => console.error('Error adding post:', error));
});


function showModal(type) {
    const modal = document.getElementById("notification-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalMessage = document.getElementById("modal-message");


    switch (type) {
        case "add":
            modalTitle.textContent = "Add Successful";
            modalMessage.textContent = "Your post has been added successfully.";
            break;
        case "edit":
            modalTitle.textContent = "Edit Successful";
            modalMessage.textContent = "Your post has been updated successfully.";
            break;
        case "delete":
            modalTitle.textContent = "Delete Successful";
            modalMessage.textContent = "Your post has been deleted successfully.";
            break;
        default:
            modalTitle.textContent = "Notification";
            modalMessage.textContent = "Your action was successful.";
    }

    modal.style.display = "block";
}


document.getElementById("close-modal").onclick = function () {
    document.getElementById("notification-modal").style.display = "none";
}


document.getElementById("modal-button").onclick = function () {
    document.getElementById("notification-modal").style.display = "none";
}


window.onclick = function (event) {
    if (event.target === document.getElementById("notification-modal")) {
        document.getElementById("notification-modal").style.display = "none";
    }
}


document.addEventListener("click", function(event) {
    if (event.target.classList.contains("edit-btn")) {
        const postId = event.target.dataset.id;

        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then(response => response.json())
            .then(post => {
                document.getElementById("post-title").value = post.title;
                document.getElementById("post-body").value = post.body;

                addPostForm.onsubmit = function(e) {
                    e.preventDefault();
                    const updatedPost = {
                        id: post.id,
                        title: document.getElementById("post-title").value,
                        body: document.getElementById("post-body").value
                    };

                    fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updatedPost)
                    })
                    .then(response => response.json())
                    .then(updatedPost => {
                        const postElement = document.querySelector(`[data-id="${postId}"]`).parentElement;
                        postElement.innerHTML = `
                            <h2>${updatedPost.title}</h2>
                            <p>${updatedPost.body}</p>
                            <button class="edit-btn" data-id="${updatedPost.id}">Edit</button>
                            <button class="delete-btn" data-id="${updatedPost.id}">Delete</button>
                        `;

                        showModal("edit");
                    })
                    .catch(error => console.error('Error updating post:', error));
                };
            })
            .catch(error => console.error('Error fetching post for edit:', error));
    }
});


document.addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        const postId = event.target.dataset.id;

        const confirmationModal = document.getElementById("confirmation-modal");
        confirmationModal.style.display = "block";

        document.getElementById("confirm-delete").onclick = function () {
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
                method: 'DELETE',
            })
            .then(() => {
                const postElement = event.target.parentElement;
                postElement.remove();

                confirmationModal.style.display = "none";
                showModal("delete");
            })
            .catch(error => console.error('Error deleting post:', error));
        };

        document.getElementById("cancel-delete").onclick = function () {
            confirmationModal.style.display = "none";
        };
    }
});
