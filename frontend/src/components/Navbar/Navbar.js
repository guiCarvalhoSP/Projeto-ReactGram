import "./Navbar.css";

import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsSearch, BsHouseDoorFill, BsFillPersonFill, BsFillCameraFill } from "react-icons/bs";

import { useAuth } from "../../hooks/useAuth";
import { logout, reset } from "../../slices/authSlice"
const Navbar = () => {

  const { auth } = useAuth();
  const { user } = useSelector(state => state.auth);

  const navigate = useNavigate();
  const dispatch= useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());

    navigate("/login");
  }

  return (
    <nav id="nav">
      <Link to="/">ReactGram</Link>

      <form id="search-form">
        <BsSearch />
        <input type="text" placeholder="Pesquisar" />
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
              <NavLink to={`/users/${user._id}`}>
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