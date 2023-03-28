import './Profile.css';

import { useEffect, useRef, useState } from 'react';
import { BsFillEyeFill, BsPencilFill, BsXLg } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import Message from '../../components/Message/Message';
import { deletePhoto, getUserPhotos, publishPhoto, resetMessage, updatePhoto } from '../../slices/photoSlice';
import { getUserDetails } from '../../slices/userSlice';
import { uploads } from '../../utils/config';

const Profile = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.user);
  const { user: userAuth } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    message: messagePhoto,
    error: errorPhoto,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  const resetComponentMessage = () => {
    setTimeout(() => {
      dispatch(resetMessage())
    }, 2000);
  }

  const handleFile = (e) => {
    const image = e.target.files[0];

    setImage(image);
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    const photoData = {
      title,
      image
    }

    const formData = new FormData();
    const photoFormData = Object.keys(photoData).forEach(
      (key) => formData.append(key, photoData[key]));

    formData.append("photo", photoFormData);

    await dispatch(publishPhoto(formData));

    setTitle("");

    resetComponentMessage();
  };

  const handleDelete = async (id) => {
    dispatch(deletePhoto(id));

    resetComponentMessage();
  }

  const handleUpdate = (e) => {
    e.preventDefault();

    const photoData = {
      title: editTitle,
      id: editId
    }

    dispatch(updatePhoto(photoData));

    resetComponentMessage();
  }

  const handleCancelEdit = (e) => {
    hideOrShowForms();
  }

  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  }

  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }

    setEditTitle(photo.title);
    setEditId(photo._id);
    setEditImage(photo.image);
  }

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="profile">
      <div className="profile-header">
        {user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        <div className="profile-discription">
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
        </div>
      </div>

      {id === userAuth._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento:</h3>
            <form onSubmit={submitHandle}>
              <label>
                <span>Título da foto:</span>
                <input
                  type="text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>

              {!loadingPhoto && <input type="submit" value="Postar" />}
              {loadingPhoto && <input type="submit" value="Aguarde..." />}
            </form>
          </div>

          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editImage && (
              <img src={`${uploads}/photos/${editImage}`} alt={editTitle} />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Insira um novo título"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />
              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={handleCancelEdit}>Cancelar</button>
            </form>
          </div>
          {errorPhoto && <Message msg={errorPhoto} type="error" />}
          {messagePhoto && <Message msg={messagePhoto} type="success" />}
        </>
      )}
      <div className="user-photos">
        <h2>Fotos publicadas:</h2>
        <div className="photos-container">
          {photos && photos.map((photo) => (
            <div className="photo" key={photo._id}>
              {photo.image && (
                <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
              )}

              {id === userAuth._id ? (
                <div className="actions">
                  <Link to={`/photos/${photo._id}`}>
                    <BsFillEyeFill />
                  </Link>

                  <BsPencilFill onClick={() => handleEdit(photo)} />

                  <BsXLg onClick={() => handleDelete(photo._id)} />
                </div>
              ) : (
                <Link className="btn" to={`/photo/${photo._id}`}>Ver</Link>
              )}
            </div>
          ))}
          {photos.lenght === 0 && <p>Ainda não há fotos publicadas!</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
