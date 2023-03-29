import './Navbar.css';

import { useState } from 'react';
import { BsFillCameraFill, BsFillPersonFill, BsHouseDoorFill, BsSearch } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import { logout, reset } from '../../slices/authSlice';

const Navbar = () => {

  const { auth } = useAuth();
  const { user } = useSelector(state => state.auth);

  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const dispatch= useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  }

  const handleSearch = (e) => {
    e.preventDefault();

    if(query) {
      return navigate(`/search?q=${query}`);
    }
  }

  return (
    <nav id="nav">
      <Link to="/">ReactGram</Link>

      <form id="search-form" onSubmit={handleSearch}>
        <BsSearch />
        <input type="text" placeholder="Pesquisar" onChange={(e) => setQuery(e.target.value)}/>
      </form>

      <ul id="nav-links">
        {(auth && user) ? (
          <>
            <li>
              <NavLink to="/">
                <BsHouseDoorFill />
              </NavLink>
            </li>
            {user && (
              <li>
                <NavLink to={`/users/${user._id}`}>
                  <BsFillCameraFill />
                </NavLink>
              </li>
            )}

            <li>
              <NavLink to={`/profile`}>
                <BsFillPersonFill />
              </NavLink>
            </li>

            <li>
              <span onClick={handleLogout}>Sair</span>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/login">
                Entrar
              </NavLink>
            </li>

            <li>
              <NavLink to="/register">
                Registrar
              </NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar