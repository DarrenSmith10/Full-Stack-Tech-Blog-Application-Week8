// Import required packages
const sequelize = require("../config/connection");

// import models
const { Post , Category } = require("../models");
const { post } = require("../routes/post");

// add data and seeding for Category model

const CategoryData = require("./Category.json");
// import seed data
const postData = require("./posts.json");

// Seed database
const seedDatabase = async () => {
  await sequelize.sync({ force: true });


  //Seed Categories first and store references

  const categories = await Category.bulkCreate(CategoryData , {returning: true});

  //We make sure the posts are assigned a valid catergoryID
  const postsWithCategory = postData.map((post, index) => ({
    ...post,
    categoryId: categories[index % categories.length].id,
  }));
  

  await Post.bulkCreate(postsWithCategory);

  // await Post.bulkCreate(postData);
  
  console.log("Database successfully seeded!");
  process.exit(0);
};

// Call seedDatabase function
seedDatabase();
