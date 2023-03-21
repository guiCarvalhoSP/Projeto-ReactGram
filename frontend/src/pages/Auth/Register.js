import { Link } from "react-router-dom";
import "./Auth.css";

import { useState, useEffect } from "react";

const Register = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div>
      <h2>ReactGram</h2>
      <p className="subtitle">Cadastre-se para ver as fotos dos seus amigos.</p>
      <form onSubmit={handleSubmit}>
        <input type="text"  placeholder="Nome"/>
        <input type="email"  placeholder="E-mail"/>
        <input type="password"  placeholder="Senha"/>
        <input type="password"  placeholder="Confirme a senha"/>
        <input type="submit"  value="Cadastrar"/>
      </form>

      <p>Já possuí uma conta? <Link to="/login">Clique e faça o login!</Link></p>
    </div>
  )
}

export default Register