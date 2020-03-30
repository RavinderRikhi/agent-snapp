import '../../assets/js/facebooksdk';
const { FB } = window;

class FacebookUtil {

    constructor(appId, appVersion) {
        if (!FB) {
            throw new Error('Facebook not initialized');
        }

        // Initializing facebook API with APP ID
        FB.init({
            appId: appId,
            status: true,
            xfbml: true,
            version: appVersion
        });

    }

    login = () => new Promise((resolve, reject) => {
        console.log('Logging in');
        FB.login(response => {
            console.log({response});
            
            const {authResponse} = response;            
            if (!authResponse) {
                reject(new Error('Error on facebook login'));
            }else {
                resolve(authResponse);
            }
        }, {
            scope: 'public_profile,email',
            auth_type: 'rerequest'
        });
    });

    getUserData = () => new Promise((resolve, reject) => {
        FB.api('/me', {fields: "id,name,picture.type(large),email, user_mobile_phone"}, function({
            error,
            name,
            email,
            picture
        }) {
            if (error) {
                console.log(error);
                reject(new Error('Error while fetching user data'))
            } else {
                resolve({name, email, picture});
            }
        });
    });
}

const FBUtil = new FacebookUtil('1624742564354986', 'v6.0');

export default FBUtil;