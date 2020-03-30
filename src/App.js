import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import AppIndex from './components/index';
import './App.css';
import './assets/css/style.css';
import {AppLoaderWrapper, LoaderContext} from './components/util';

import discover from './components/discover';
import explore from './components/explore';
import experience from './components/experience';
import NewTalent from './components/newtalent';
import login from './components/auth/login';
import loginPassword from './components/auth/loginPassword';
import Signup from './components/auth/Signup';
import mode from './components/dashboard/mode';
import Counter from './components/count';
import setting from './components/dashboard/Worker/setting';
import worker from './components/dashboard/Worker/worker';
import singleJPost from './components/dashboard/Worker/singleJPost';
import workerprofile from './components/dashboard/Worker/workerprofile';

const App = () => (<AppLoaderWrapper>
  <LoaderContext.Consumer>
    {
      (funcs) => {
        global.props = {...funcs};
        return (
          <Router {...funcs}>
          <ToastContainer />
            <div className='App'>
              <Switch>
                <Route path="/" exact component={AppIndex} />
                <Route path="/discover" component={discover} />
                <Route path="/explore" component={explore} />
                <Route path="/experience" component={experience} />
                <Route path="/newtalent" component={NewTalent} />
                <Route path="/login" component={login} />
                <Route path="/password" component={loginPassword} />
                <Route path="/signup" component={Signup} />
                <Route path="/mode" component={mode} />
                <Route path="/count" component={Counter} />
                <Route path="/worker" component={worker} />
                <Route path="/setting" component={setting} />
                <Route path="/singleJPost" component={singleJPost} />
                <Route path="workerprofile" component={workerprofile} />
              </Switch>
            </div>
          </Router>
        );
      }
    }
  </LoaderContext.Consumer>
</AppLoaderWrapper>); 

export default App;
