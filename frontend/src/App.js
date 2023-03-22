import './App.css';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home/Home';
import { useAuth } from './hooks/useAuth';

function App() {

  const { auth, loading } = useAuth();

  if(loading) {
    return (<p>Carregando</p>);
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className='container'>
          <Routes>
            <Route path='/' element={auth ? <Home /> : <Navigate to="/login"/>}/>
            <Route path='/login' element={!auth ? <Login /> : <Navigate to="/"/>}/>
            <Route path='/register' element={!auth ? <Register /> : <Navigate to="/"/>}/>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
