import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';

import { FBUtil, Toaster, AppLocalStorage, APIService } from '../util';

import LoginLogo from '../../assets/images/magnetIcons.png';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded : false,
      userData : '' ,
      error : '' 
    };
  }

  facebookLogin = async () => {
    const { showLoader, hideLoader } = global.props;
    let facebookId;
    try {
      showLoader();
      const fbData = await FBUtil.login();
      const { userID } = fbData;
      facebookId = userID;
      // Set facebook id for user in local storage
      AppLocalStorage.setFacebookId(facebookId);
      
      const result = await APIService.facebookLogin({
        facebookId: userID
      });

    } catch (err) {
      // Error while loggin in using facebook
      if (err && err.response && err.response.status === 409) {
        // Get user facebook data
        try {
          const result = await FBUtil.getUserData();
          console.log({result});
          
          const { name, email, picture } = result;

          // Set User name in local storage
          if (name) {
            AppLocalStorage.setUsername(name);
          }
          
          // Set User email in local storage
          if (email) {
            AppLocalStorage.setUserEmail(email);
          }
          
          // Set User image in local storage
          if (picture && picture.data && picture.data.url) {
            AppLocalStorage.setUserImage(picture.data.url);
          }

          // Move to sign up screen
          this.props.history.push('/signupsetpone');
        } catch (err) {
          throw err;
        }
      } else {
        const errMessage = err.message || 'Error while trying to login';
        Toaster.error(errMessage);
      }
    } finally {
      hideLoader();
    }
  }

  render() {
    return (
      <div id="Login">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="loginPageLogo">

                <div class="logo-header mx-auto">
                  <a onClick={() => this.props.history.push('/')}> <img src={LoginLogo} />
                    <span class="c-black f-sec">agent</span><span class="c-main f-sec">snapp</span>
                  </a>
                </div>
              </div>
            </div>
            </div>
            <div className="row loginArea">
              <div className="col-md-4">
              </div>
              <div className="text-center col-md-4">
                <h3 className="chooseOption"> Choose an option to get started </h3>

                <button
                  class="text-center fb-login f-main-b btn btn-secondary"
                  onClick={this.facebookLogin}
                >Use Facebook</button>

                <div class="divider w-sec mx-auto py-sm-4 py-2"><div class="line"></div><span>or</span><div class="line"></div></div>

                <p className="otp text-center">Sign up or login with your email instead</p>

                <form>
                  <div class="my-2 row">
                    <input 
                      class="form-control w-main mx-auto rounded-0" 
                      type="text" 
                      placeholder="Enter your email" 
                      name="email"
                    />
                  </div>
                  <div class="my-2 row">
                    <input
                      type="password"
                      class="form-control input" 
                      placeholder="Password"
                      id="password"
                      name="password"
                      required
                    />
                  </div>
                  <div className="py-2">
                    <button
                      type="submit"
                      class="btn text-center d-block rounded-0 w-third bgc-main border-0 mx-auto my-2 c-white py-2 btn btn-secondary"
                      onClick={()=>this.props.history.push('/mode')}
                    >
                      Login
                    </button>
                    <a
                      class="btn text-center d-block rounded-0 w-third bgc-main border-0 mx-auto c-white py-2 f-main-b" 
                      onClick={()=>this.props.history.push('/signup')}
                    >
                      <span>Sign Up</span>
                    </a>
                  </div>
                </form>
              </div>
              <div className="col-md-4">
              </div>
            </div>

            <div className="copyright row">
            <div className="text-center col-md-12">
                <div class="small-container text-center mx-auto privacy">
                  <p class="c-gray text-center">By continuing, you're confirming that you've read and agree to our
              <a class="c-black" href="/sites/terms_conditions">Terms and Conditions,</a> <a class="c-black" href="/sites/privacy_policy">Privacy Policy</a> and <a class="c-black" href="/sites/cookie_policy">Cookie Policy</a></p>
                </div>
            </div>
            </div>

          </div>
        </div>
    );
}
}

export default withRouter(Login);
