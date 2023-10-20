import express from "express";

const app = express();

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

app.use("/api/posts", (req, res, next) => {
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
