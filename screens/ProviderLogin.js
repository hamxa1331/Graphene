/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, {Component} from 'react';
import { View,ScrollView,Image,KeyboardAvoidingView,Dimensions,Text,ActivityIndicator,Alert,AsyncStorage,Platform} from 'react-native';
import {Button,SocialIcon} from 'react-native-elements';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, listenOrientationChange as loc,
  removeOrientationListener as rol} from 'react-native-responsive-screen';
import { url } from "./Proxy";
import { GoogleSignin } from 'react-native-google-signin';
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase'
import { connect } from "react-redux";
import { setUIDAction,setUserInfoAction } from "../store/actions/actions";
class ProviderLogin extends Component{
    constructor(props){
      super(props)
      this.state={
        pass:"",
        email:'',
        orientation:'',
        loading:false,
        showLogo:false
    }
      this.facebookLogin=this.facebookLogin.bind(this)
     this.googleLogin=this.googleLogin.bind(this)
    
      }
      getOrientation = () =>
      {
        if( this.refs.rootView )
        {
            if( Dimensions.get('window').width < Dimensions.get('window').height )
            {
              this.setState({ orientation: 'portrait' });
            }
            else
            {
              this.setState({ orientation: 'landscape' });
            }
        }
      }
      async googleLogin() {
        try {
          // add any configuration settings here:      
      await GoogleSignin.signIn().then(user=>{

          const credential = firebase.auth.GoogleAuthProvider.credential(user.idToken, user.accessToken)
          // login with credential
          firebase.auth().signInWithCredential(credential).then(u=>{
          let user = u.user
          // fetch(url+'/api/checkgoogle',{method:"POST",body:JSON.stringify(user),headers: { "Content-Type": "application/json" }})
          // .then(res=>res.json())
          // .then(data=>{
          //   if(data.message==='Success'){
          //     AsyncStorage.setItem('userData',JSON.stringify(data.doc))
          //     this.props.setUID(data.doc.firebaseUID)
          //     this.props.navigation.navigate('HomeScreen')
          //   }
          // })
          console.log(user)
          let data = {
            profilePic:user.providerData[0].photoURL,
            displayName:user.providerData[0].displayName,
            firebaseUID:user.providerData[0].uid
          }
          AsyncStorage.setItem('userData',JSON.stringify(data))
          this.props.setUserInfo(data)
          this.props.navigation.navigate('HomeScreen')
          Alert.alert('User Logged in with Name => ',user.providerData[0].displayName)

          }).catch(err=>console.log(err))
      
        })
      
          // create a new firebase credential with the token
        } catch (e) {
          let data = {
            e
          }
          console.log(e)
          // fetch(url+'/api/googleError',{method:"POST",body:JSON.stringify(data),headers: { "Content-Type": "application/json" }})
          // .then(res=>res.json())
          // .then(data=>{
          // if(data.message=='ok'){
          //   console.log('done')
          // }
          // })
        }
      }
      async facebookLogin() {
        try {
          const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
          if (result.isCancelled) {
            // handle this however suites the flow of your app
            throw new Error('User cancelled request'); 
          }
      
      
          // get the access token
          const data = await AccessToken.getCurrentAccessToken();
      
          if (!data) {
            // handle this however suites the flow of your app
            throw new Error('Something went wrong obtaining the users access token');
          }
      
          // create a new firebase credential with the token
          this.setState({
            loading:true
          })
          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
      
          // login with credential
          const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
          /**
           displayName,
           uid,
           email,
           photoURL
           */
          let userData = firebaseUserCredential.user.toJSON()
          let userdata = {
            firebaseUID:userData.uid,
            isLoggedIn:true,
            profilePic:userData.photoURL,
            displayName:userData.displayName,
            email:userData.email
          }
          this.setState({loading:false})
          this.props.navigation.navigate('HomeScreen')
          AsyncStorage.setItem('userData',JSON.stringify(userdata))
          this.props.setUserInfo(userdata)
        } catch (e) {
          console.error(e);
        }
      }
      async componentDidMount() {
        loc(this);
        this.getOrientation();
    
        Dimensions.addEventListener( 'change', () =>
        {
          this.getOrientation();
        });
       await GoogleSignin.configure({
          //It is mandatory to call this method before attempting to call signIn()
          scopes: ['https://www.googleapis.com/auth/drive.readonly'],
          // Repleace with your webClientId generated from Firebase console
          webClientId:
            '252721721926-aqulephg39f8huojositaaj51opao3ga.apps.googleusercontent.com',
        });
      }
      componentWillUnMount() {
        rol();
      }
      render(){
        if(this.state.loading===false&&this.state.showLogo==false)
        return(
          <ScrollView ref="rootView" style={{flex:1,backgroundColor:'white'}}>
          <View style={{alignItems:'center',marginTop:2,width:wp('100%'),height:(this.state.orientation==="portrait")?hp('35%'):hp('88.5%')}}>
          <Image 
          source={require('./my1.png')}
          style={{width:wp('100%'),height:(this.state.orientation==="portrait")?hp('35%'):hp('89%')}}
          />
          </View>
          <SocialIcon
          title='Sign in with Facebook'
          button
          raised
          onPress={this.facebookLogin}
          style={{width:'60%',alignSelf:'center'}}
          type='facebook'
        />
        <SocialIcon
        button
        raised
        onPress={this.googleLogin}
        title='Login with Google'
        style={{width:'60%',alignSelf:'center'}}
        type='google-plus-official'
        />
        <SocialIcon
  button
  light
  title='Login With Instagram'
  style={{width:'60%',alignSelf:'center'}}

  type='instagram'
/>
   </ScrollView>
      
        )
        else if(this.state.showLogo===false&&this.state.loading===true)
        return(
          <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
              <ActivityIndicator animating size={Platform.OS==='android'?40:1} color='purple'/>
          </View>
        )
      }
}

function mapStateToProps(state){
    return({
        selectedCategory:state.rootReducer.selectedCategory,
        UID:state.rootReducer.UID
    })
  }
  function mapActionsToProps(dispatch){
    return({
      setUID:(UID)=>{
        dispatch(setUIDAction(UID))
      },
      setUserInfo:(user)=>{
        dispatch(setUserInfoAction(user))
      }
    })
  }

export default connect(mapStateToProps, mapActionsToProps)(ProviderLogin)
