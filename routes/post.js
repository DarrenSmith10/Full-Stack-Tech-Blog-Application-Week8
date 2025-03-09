// create a new router
const app = require("express").Router();

// import the models
const { Post, Category } = require("../models/index");

// Route to add a new post
app.post("/", async (req, res) => {
  try {
    const { title, content, postedBy , categoryId  } = req.body;
    const post = await Post.create({ title, content, postedBy , categoryId  });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: "Error adding post" });
  }
});

app.get("/", async (req, res) => {
  try {
    let { categoryId } = req.query; // Get categoryId from query parameters

    // Ensure categoryId is a number before filtering
    const filterOptions = {
      include: [{ model: Category, as: "category" }],
    };

    if (categoryId) {
      categoryId = parseInt(categoryId); // Convert to integer
      filterOptions.where = { "$category.id$": categoryId }; // Correct filter
    }

    const posts = await Post.findAll(filterOptions);
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Route to get a single post by ID
app.get("/:id", async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }],
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving post" });
  }
});



// Route to get all posts
app.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
    include: [{ model: Category, as: "category" }], // Include category data
    });
    res.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error retrieving posts", error });
  }
});

// Route to update a post
app.put("/:id", async (req, res) => {
  try {
    const { title, content, postedBy } = req.body;
    const post = await Post.update(
      { title, content, postedBy },
      { where: { id: req.params.id } }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error updating post" });
  }
});

// Route to delete a post
app.delete("/:id", async (req, res) => {
  try {
    const post = await Post.destroy({ where: { id: req.params.id } });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Error deleting post" });
  }
});

// export the router
module.exports = app;



// //Old Code Add a catergory filter

// app.get("/", async (req, res) => {
//   try {
//     const { categoryId } = req.query; // Get categoryId from query parameters

//     const filterOptions = {
//       include: [{ model: Category, as: "category" }],
//     };

//     if (categoryId) {
//       categoryId = parseInt(categoryId); // Convert to integer
//       filterOptions.where = { categoryId }; // Apply category filter
//     }

//     const posts = await Post.findAll(filterOptions);
//     res.json(posts);
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     res.status(500).json({ error: "Failed to fetch posts" });
//   }
// });

// app.get("/:id", async (req, res) => {
//   try {
//     const post = await Post.findByPk(req.params.id);
//     res.json(post);
//   } catch (error) {
//     res.status(500).json({ error: "Error retrieving post" });
//   }
// });