let token = localStorage.getItem("authToken");

function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  
  //changed all the fetch local links to render.com in order to
  // deploy it. Example: fetch("https://your-backend-name.onrender.com/api/users/login", {  // ✅ Correct

  fetch("https://full-stack-tech-blog-application-week8.onrender.com/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        alert("User registered successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  fetch("https://full-stack-tech-blog-application-week8.onrender.com/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;

        alert("User Logged In successfully");

        // Fetch the posts list
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function logout() {
  fetch("https://full-stack-tech-blog-application-week8.onrender.com/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

function fetchPosts(categoryId = "") {
  let url = "https://full-stack-tech-blog-application-week8.onrender.com/api/posts";
  if (categoryId) {
    url += `?categoryId=${categoryId}`;
  }
console.log("Fetching posts from:", url); // Debugging

fetch(url, {
  method: "GET",
  headers: { Authorization: `Bearer ${token}` },
})
    .then((res) => res.json())
    .then((posts) => {
      const postsContainer = document.getElementById("posts");
      postsContainer.innerHTML = "";
      
      if (!posts || posts.length === 0) {
        postsContainer.innerHTML = "<p>No posts found for this category.</p>";
        return;
      }

      posts.forEach((post) => {
        const div = document.createElement("div");

       // Display category name if available
       const categoryName = post.category ? post.category.category_name : "Uncategorized";

        div.innerHTML = `<h3>${post.title}</h3>
        <p>${post.content}</p>
        <small>Category: ${categoryName}</small><br>
        <small>By: ${post.postedBy} on ${new Date(post.createdOn).toLocaleString()}</small>`;
        postsContainer.appendChild(div);
        

        
        const DeleteBtN = document.createElement("button");
        const updateBTN = document.createElement("button");        
         DeleteBtN.className = "Deletebutton";
         updateBTN.className = "Editbutton";
         DeleteBtN.textContent = "x";
         DeleteBtN.addEventListener("click" , async() => {
           try{
             const response = await fetch(`https://full-stack-tech-blog-application-week8.onrender.com/api/posts/${post.id}` , {
               method: "DELETE",
             });
             if(response.ok){
               fetchPosts(); //Refresh the list
             }
           } catch (error){
             console.error("Error deleting data:" ,error);
           }
         });
        
          updateBTN.textContent = "Edit";
          updateBTN.addEventListener("click", async () => {
          const updatedPost = prompt("Update your Post:", post.text);
          const updatedTitle = prompt("Update your Title:", post.text);
          if (updatedPost !==null && updatedTitle !== null) {
            try {
              const response = await fetch(`https://full-stack-tech-blog-application-week8.onrender.com/api/posts/${post.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: updatedPost , title: updatedTitle }),
              });
              if (response.ok) {
                fetchPosts(); // Refresh the list
              }
            } catch (error) {
              console.error("Error updating data:", error);
            }
          }
        });



        div.appendChild(DeleteBtN);
        div.appendChild(updateBTN);

      });
    });
    
}

function fetchCategories() {
  fetch("https://full-stack-tech-blog-application-week8.onrender.com/api/categories")
    .then((res) => res.json())
    .then((categories) => {

      //create categories selection 
      const categorySelect = document.getElementById("category-select");
      categorySelect.innerHTML = `<option value="">Select a Category</option>`; // Default option


      console.log("Fetched Categories:", categories); // Debugging

      const categoryFilter = document.getElementById("category-filter");
      categoryFilter.innerHTML = `<option value="">All Categories</option>`; // Default option

      if (!categories || categories.length === 0) {
        console.error("No categories found!");
        return;
      }

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.category_name;
        categoryFilter.appendChild(option);
        // categories.appendChild(option);
      });

      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.category_name; // ✅ Ensure correct category name
        categorySelect.appendChild(option);
      });

    })
    .catch((error) => console.error("Error fetching categories:", error));
}

function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  
  const categoryId = document.getElementById("category-select").value; //get selected Category

  if (!title || !content || !categoryId) {
    alert("Please fill in all fields and select a category.");
    return;
  }

  fetch("https://full-stack-tech-blog-application-week8.onrender.com/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, postedBy: "User" , categoryId }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post created successfully");
      fetchPosts();
    });
}

document.getElementById("category-filter").addEventListener("change", (event) => {
  const selectedCategory = event.target.value;
  fetchPosts(selectedCategory);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchPosts(); // Load all posts initially
});


