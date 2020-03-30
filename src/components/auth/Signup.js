import React, { Component, Fragment } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from 'react-router-dom';

import { APIService, AppLocalStorage, Toaster } from '../util';
import ImageCropper from '../common/ImageCropper';
import LoginLogo from '../../assets/images/magnetIcons.png';
import BackArrow from '../../assets/images/backArrow.png';
import UploadAvtar from '../../assets/images/avtaar.svg';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      agenttype: '',
      address: '',
      email: '',
      phone: '',
      brokerage: '',
      mls: '',
      profilePic: '',
      password: '',
      facebookId: '',
      imgSrc: undefined,
      imgBlob: undefined,
    };
  }

  componentDidMount = async () => {
    
    // check if Facebook Id is present and userId is not present
    // Then setup user signup for facebook user
    const facebookId = AppLocalStorage.getFacebookId();
    const userId = AppLocalStorage.getUserId();
    
    const { showLoader, hideLoader } = global.props;
    if (facebookId && !userId) {
      try {
        showLoader();
        let userdata = {
          facebookId,
        };
        
        const name = AppLocalStorage.getUsername();
        const email = AppLocalStorage.getUserEmail();
        const userImage = AppLocalStorage.getUserImage();

        if (name) {
          userdata = {
            ...userdata,
            name,
          }
        }

        if (email) {
          userdata = {
            ...userdata,
            email,
          }
        }

        if (userImage) {
          userdata = {
            ...userdata,
            profilePic: userImage,
          }
        }
        
        this.setState((prevstate) => ({
          ...prevstate,
          ...userdata
        }));

      } catch (err) {
        const errMessage = err.Message || 'Error while trying to login';
        Toaster.error(errMessage);
      } finally {
        hideLoader();
      }
    }
  }

  componentWillUnmount = () => {

    // Clear facebook data if not saved
    const facebookId = AppLocalStorage.getFacebookId();
    const userId = AppLocalStorage.getUserId();
    if (facebookId && !userId) {
      AppLocalStorage.removeAppData();
    }
  }

  onChange(e) {

    if (e.target.id === 'name') {
      this.setState({
        name: e.target.value
      })
    } else if (e.target.id === 'address') {
      this.setState({
        address: e.target.value
      })
    } else if (e.target.id === 'email') {
      this.setState({
        email: e.target.value
      })
    } else if (e.target.id === 'phone') {
      this.setState({
        phone: e.target.value
      })
    } else if (e.target.id === 'brokerage') {
      this.setState({
        brokerage: e.target.value
      })
    } else if (e.target.id === 'mls') {
      this.setState({
        mls: e.target.value
      })
    } else if (e.target.id === 'profilePic') {
      if (e.target.files && e.target.files.length > 0) {
        const acceptedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        console.log(e.target.files[0]);
        
        const isValidImage = acceptedImageTypes.includes(e.target.files[0]['type']);

        if (isValidImage) {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () =>
              this.setState({
                imgSrc: reader.result,
              }),
            false
          );
          reader.readAsDataURL(e.target.files[0])
        } else {
          Toaster.warn('Please select a valid image file.');
        }
      }
    } else if (e.target.id === 'password') {
      this.setState({
        password: e.target.value
      })
    }    
  }

  submitContactForm(e) {
    e.preventDefault();
    let reqObj = {
      "name":this.state.name,
      "email":this.state.email,
      "phone":this.state.phone,
      "password":this.state.password,
      "brokerageName":this.state.brokerage,
      "profilePhoto":'https://images.unsplash.com/photo-1496857239036-1fb137683000?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
      "mls":this.state.mls,
      "locationId":this.state.address,
      "lat": 151.225594,
      "long": -33.878563
    };

 fetch('https://agent-snapp-api.herokuapp.com/user/signup',
 {
   method:"POST",
   headers:{
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
   },
   body:JSON.stringify(reqObj),
 })
     .then(response =>response.json()
     .then(resData=>{
       if(resData.err){
         console.log('err true')
       }
       else{
        this.props.history.push('/worker')
        window.localStorage.setItem('SingupData',JSON.stringify(resData))
       }
        console.log('Local Stored Data',reqObj)
      })
     )

  }

  render() {

    const {
      facebookId,
      name,
      email,
      profilePic,
      imgBlob,
    } = this.state;
    
    const imageSrc = imgBlob ? URL.createObjectURL(imgBlob) : UploadAvtar;
    console.log({imageSrc});
    
    return (
      <div id="Singup">
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
            <div className="col-md-3">
            </div>
            <form onSubmit={(e)=>this.submitContactForm(e)}>
            <div className="text-center">

              <div class="back-header justify-content-center"><div class="back">

                <a onClick={() => this.props.history.push('/login')}><img src={BackArrow} alt="Back" /></a></div><span class="f-main-b">Sign up</span></div>

              <p className="aboutYourself text-left"> Please provide some information about yourself </p>
                <div class="my-2 row">
                  <div class="col-sm-6 col-12 mt-2 col">
                    <input
                      type="text" 
                      id="name" 
                      name="name"
                      value={name} 
                      className="form-control input"
                      onChange={(e)=>this.onChange(e)} 
                      placeholder="Full Name"
                      required 
                    />
                  </div>
                  <div class="col-sm-6 col-12 mt-2 col">
                    <select
                      className="form-control input"
                      name="agenttype" 
                      onChange={(e)=>this.onChange(e)}
                    >
                      <option value="">Agent Type</option>
                      <option value="service">Servicing</option>
                      <option value="hire">Hiring</option>
                    </select>
                  </div>
                </div>
                <div class="my-2 row">
                  <div class="col">
                    <input
                      type="text"
                      onChange={(e)=>this.onChange(e)}
                      className="form-control input"
                      placeholder="123 Broadway, Albany NY 12201"
                      id="address"
                      name="address"
                      required
                    />
                  </div>
                </div>

                <div class="mt-4 mb-2 row">
                  <div class="col text-left">
                    <span>Email, Phone, Business</span>
                  </div>
                </div>

                <div class="my-2 row">
                  <div class="col-sm-6 col-12 mt-2 col">
                    <input
                      type="email"
                      onChange={(e)=>this.onChange(e)}
                      className="form-control input"
                      placeholder="email"
                      id="email"
                      name="email"
                      value={email}
                      required
                    />
                  </div><div class="col-sm-6 col-12 mt-2 col">
                    <input 
                      type="tel" 
                      onChange={(e)=>this.onChange(e)} 
                      className="form-control input" 
                      placeholder="Phone Number" 
                      id="phone" 
                      name="phone" 
                      required 
                    />
                  </div>
                </div>

                <div class="my-2 row">
                  <div class="col">
                    <input type="text" onChange={(e)=>this.onChange(e)} class="form-control input" placeholder="Brokerage" id="brokerage" name="brokerage"  required/>
                  </div>
                </div>

                <div class="mt-4 row">
                  <div class="col-sm-6 col-12 mt-2 col">
                    <span class="mb-2 d-block text-left">MLS #</span>
                    <input type="text" onChange={(e)=>this.onChange(e)} class="form-control input" placeholder="123456789" id="mls" name="mls" required/>
                  </div>
                  <div class="col-sm-6 col-12 mt-2 d-flex align-items-end col">
                    <img src={imageSrc} alt="Avatar" class="UploadUserAvtar rounded-circle mr-2" />
                    <div class="flex-fill"><span class="d-block">Profile Photo</span>
                      <button type="button" class="btn btn-light d-block w-100 btn btn-secondary">Browse</button>
                      <input
                        type="file"
                        onChange={(e)=>this.onChange(e)} 
                        id="profilePic" 
                        class="form-control-file"
                        accept="image/*"
                      />
                    </div>
                  </div>
                </div>

                {
                  !facebookId && <Fragment>
                    <div class="mt-4 mb-2 row">
                      <div class="text-left col">
                        <span>Password</span>
                      </div>
                    </div>

                    <div class="my-2 row">
                      <div class="col-sm-6 col-12 mt-2 col">
                        <input type="password" onChange={(e)=>this.onChange(e)} class="form-control input" placeholder="Password" id="password"  name="password" required />
                      </div>
                    </div>
                  </Fragment>
                }
                <button type="submit" class="bgc-main d-block w-100 py-2 border-0 mt-5 btn btn-secondary" onClick={(e) => this.submitContactForm(e)}>Finish Sign Up</button>
            </div>
            </form>
            <div className="col-md-3">
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
          {
            this.state.imgSrc && <ImageCropper
              onCropComplete={image => {
                this.setState({
                  imgBlob: image,
                  imgSrc: undefined
                });
              }}
              imgSrc={this.state.imgSrc}
              onCloseClick={()=> this.setState({imgSrc: undefined})}
              circularCrop
            />
          }
        </div>
      </div>
    );

  }
}

export default withRouter(Signup);
