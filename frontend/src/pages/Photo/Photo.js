import './Photo.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import LikeContainer from '../../components/LikeContainer/LikeContainer';
import Message from '../../components/Message/Message';
import PhotoItem from '../../components/PhotoItem/PhotoItem';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';
import { comment, getPhoto, like } from '../../slices/photoSlice';
import { uploads } from '../../utils/config';

const Photo = () => {
  const { id } = useParams();

  const dispatch = useDispatch();

  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector(
    (state) => state.photo
  );

  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  const handleLike = () => {
    dispatch(like(photo._id));

    resetMessage();
  };

  const handleComment = (e) => {
    e.preventDefault();

    const commentData = {
      comment: commentText,
      id: photo._id
    };

    dispatch(comment(commentData));

    setCommentText("");

    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      <div className="message-container">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>

      {photo.comments && (
        <>
          <div className="comments">
            <h3>Comentários: ({photo.comments.length})</h3>
            <form onSubmit={handleComment}>
              <input
                type="text"
                placeholder="Insira seu comentario..."
                onChange={(e) => setCommentText(e.target.value)}
                value={commentText || ""}
              />

              <input type="submit" value="Enviar" />
            </form>

            {photo.comments.length === 0 && <p>Não há comentários</p>}
            {photo.comments.map((comment) => (
              <div className='comment' key={comment.comment}>
                <div className='author'>
                  {comment.userImage && (
                    <img src={`${uploads}/users/${comment.userImage}`} alt={comment.userName} />
                  )}
                  <Link to={`/users/${comment.userId}`}>
                    <p>{comment.userName}</p>
                  </Link> 
                </div>
                <p>{comment.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Photo;
