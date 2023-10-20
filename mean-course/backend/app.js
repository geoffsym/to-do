import Post from "./models/post.js";
import express from "express";
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  res.status(201).json({
    message: "Post added successfully",
  });
});

app.get("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "sdafcevrsaf",
      title: "First Server-Side Post",
      content: "This is coming from the server",
    },
    {
      id: "tiuhjhgnmhj",
      title: "Second Server-Side Post",
      content: "This is also coming from the server",
    },
  ];
  res.status(200).json({
    message: "posts fetched succesfully!",
    posts: posts,
  });
});

export default app;
