import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import HomePage from './components/home/HomePage'
import FavPage from './components/favs/FavPage'
import LoginPage from './components/login/LoginPage'
import { connect } from 'react-redux';

function Routes({isLogged}) {

    const PrivateRoute = ({path, component,...props}) => {
      if(isLogged){
        return <Route path={path} component={component} {...props} />
      } else {
        return <Redirect to='/login' {...props} />
      }
    }

    return (
        <Switch>
            <PrivateRoute exact path="/" component={HomePage} />
            <PrivateRoute exact path="/favs" component={FavPage} />
            <Route exact path="/login" component={LoginPage} />
        </Switch>
    )
}

function mapState({ user: {loggedIn} }) {
  return {
    isLogged: loggedIn,
  }
}

export default connect(mapState)(Routes);