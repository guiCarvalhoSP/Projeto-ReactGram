const Photo = require("../models/Photo");
const User = require("../models/User");
const mongoose = require("mongoose");

const insertPhoto = async (req, res) => { 
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name
  });

  if(!newPhoto){
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde"],
    })
    return;
  }

  res.status(201).json(newPhoto);
}

const deletePhoto = async (req, res) => {
  const { id } = req.params;
  
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if(!photo) {
      res.status(404).json({
        errors: ["Foto não encontrada"],
      });
      return
    }
  
    if(!photo.userId.equals(reqUser._id)) {
      res.status(422).json({errors: ["Ocorreu um erro. Tente novamente mais tarde!"]})
    }
  
    await Photo.findByIdAndDelete(photo._id);
  
    res.status(200).json({id: photo._id, message: "Foto excluída com sucesso."});
  } catch (error) {
    res.status(404).json({
      errors: ["Foto não encontrada"],
    });
    console.log(error)
    return
  }

}

const getAllPhotos = async (req, res) => {
  try{
    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    return res.status(200).json(photos);
  } catch (error) {
    console.log(error);
    return res.status(500).json({errors: "Ocorreu um erro interno. Tente novamente mais tarde!"});
  }

}

const getUserPhotos = async (req, res) => {
  const {id} = req.params;
  const photos = await Photo.find({userId: id})
    .sort([["createdAt", -1]]).exec();

  return res.status(200).json(photos)
}

const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      res.status(404).json({errors: ["Foto não encontrada."]});
      return;
    }
  
    return res.status(200).json(photo);
  } catch (error) {
    console.log(error);
    return res.status(500).json({errors: ["Erro interno. Tente novamente mais tarde!"]});
  }

}

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if(!photo) {
      res.status(404).json({errors: ["Foto não encontrada"]});
      return
    }
  
    if(!photo.userId.equals(reqUser._id)) {
      res.status(422).json({errors: ["Ocorreu um erro. Tente novamente mais tarde!"]});
    }

    if(title) {
      photo.title = title;
    }

    await photo.save();

    res.status(200).json({photo, message: "Foto atualizada com sucesso!"});
  } catch (error) {
    console.log(error);
    res.status(500).json({errors: ["Ocorreu um erro. Tente novamente mais tarde!"]});
  }



}

const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if(!photo) {
      res.status(404).json({errors: ["Foto não encontrada"]});
      return;
    }

    if(photo.likes.includes(reqUser._id)) {
      res.status(422).json({errors: ["Você já curtiu a foto"]});
      return;
    }

    photo.likes.push(reqUser._id);

    photo.save();

    res.status(200).json({photoId: id, userId: reqUser._id, message: "A foto foi curtida"});

  } catch(error) {
    console.log(error);
    res.status(500).json({errors: ["Ocorreu um erro. Tente novamente mais tarde!"]});
  }
}

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto
};
