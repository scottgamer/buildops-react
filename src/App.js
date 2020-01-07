import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

// TODO fix auth
// import AuthPage from "./pages/Auth";
import EmployeesPage from "./pages/Employees/Employees";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

import "./App.css";

const App = () => {
  const [auth, setAuth] = useState({
    userId: null,
    token: null,
    tokenExpiration: null
  });

  const login = (token, userId, tokenExpiration) => {
    setAuth({ token: token, userId: userId });
  };

  const logout = () => {
    setAuth({ token: null, userId: null });
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{
            token: auth.token,
            userId: auth.userId,
            login: login,
            logout: logout
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {/* TODO fix auth */}
              {auth.token && <Redirect from="/" to="/employees" exact />}
              {/* {auth.token && <Redirect from="/auth" to="/employees" exact />} */}
              {/* {!auth.token && <Route path="/auth" component={AuthPage} />} */}
              <Route path="/employees" component={EmployeesPage} />
              {/* {!auth.token && <Redirect to="/auth" exact />} */}
              {!auth.token && <Redirect to="/employees" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
};

export default App;
