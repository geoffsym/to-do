import Post from "../models/post.js";

export function createPost(req, res, next) {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath,
        },
      });
    })
    .catch((error) => {
      res.statusMessage(500).json({
        message: "Post creation failed",
      });
    });
}

export function updatePost(req, res, next) {
  let imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  } else {
    imagePath = req.body.imagePath;
  }
  const post = new Post({
    id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId,
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Update seccessful!" });
      } else {
        res
          .status(401)
          .json({ message: "User is not authorized to perfom this action" });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post update failed",
      });
    });
}

export function getPosts(req, res, next) {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched succesfully!",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post fetching fialed",
      });
    });
}

export function getPost(req, res, next) {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) res.status(200).json(post);
      else res.status(404).json({ message: "Post not found" });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post fetching failed",
      });
    });
}

export function deletePost(req, res, next) {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.deletedCount > 0) {
        res.status(200).json({
          message: "Post deleted!",
        });
      } else {
        res.status(401).json({
          message: "User is not authorized to perfom this action",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Post deletion failed",
      });
    });
}
