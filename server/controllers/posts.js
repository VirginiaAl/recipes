import mongoose from "mongoose";
import postModel from '../models/postModel.js'

export const getPosts = async (req, res) => {
  try {
    const postModels = await postModel.find()
    res.status(200).json(postModels)
  } catch(error) {
    res.status(404).json({message: error.message})
  }
};

export const createPost = async (req, res) => {
    const { title, message, selectedFile, creator, tags } = req.body;
    const newPost = new postModel({
      title,
      message,
      selectedFile,
      creator,
      tags
    }); 
    try {
       await newPost.save()
       res.status(201).json(newPost) //201 = created
    } catch (error) {
        res.status(409).json({message: error}) //409 = conflict
    }
    
}

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { creator, title, message, tags, selectedFile, _id: id };

  await postModel.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  
  await postModel.findByIdAndRemove(id)

  res.json({ message: 'post deleted' })
}
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await postModel.findById(id);

  const updatedPost = await postModel.findByIdAndUpdate(
    id,
    { likeCount: post.likeCount + 1 },
    { new: true }
  );

  res.json(updatedPost);
};