import React, { useState } from 'react';

function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  
  const handleSubmit = (e) => {
    e.preventDefault();

   
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

   
    // console.log('Email:', email);
    // console.log('Mot de passe:', password);

    setEmail('');
    setPassword('');
    setError('');
    
    
  };

  return (
    <div className="login-container">
      <h2>Connexion</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Entrez votre mot de passe"
            required
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default Login;
