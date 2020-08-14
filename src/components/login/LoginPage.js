import React from 'react';
import styles from './login.module.css';
import { doGoogleLoginAction, logOutAction } from '../../redux/userDuck';
import { connect } from 'react-redux';

function LoginPage({ fetching, loggedIn, doGoogleLoginAction, logOutAction }) {
  const doLogin = () => {
    doGoogleLoginAction();
  };

  const logOut = () => {
    logOutAction();
  }

  if (fetching) return <h2>Cargando...</h2>;
  return (
    <div className={styles.container}>
      {loggedIn ? (
        <>
          <h2>Cierra tu sesión</h2>
          <button onClick={logOut}>Cerrar Sesión</button>
        </>
      ) : (
        <>
          <h2>Inicia Sesión con Google</h2>
          <button onClick={doLogin}>Iniciar</button>
        </>
      )}
    </div>
  );
}

function mapStateToProps({ user: { fetching, loggedIn } }) {
  return {
    fetching,
    loggedIn,
  };
}

export default connect(mapStateToProps, { doGoogleLoginAction, logOutAction })(LoginPage);
