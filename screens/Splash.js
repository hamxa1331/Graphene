/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, {Component} from 'react';
import { View,Image,ActivityIndicator,Alert,AsyncStorage,Platform} from 'react-native';
import { setUIDAction } from "../store/actions/actions";
import { connect } from "react-redux";
import { url } from "./Proxy";
class Splash extends Component {
    constructor(props){
        super(props)
        this.state={
            loading:false,
            showLogo:false
        }
    }
    componentWillMount(){
        this.setState({
          showLogo:true,loading:true
        })
        setTimeout(()=>{
          AsyncStorage.getItem('userData').then(data=>{
            if(data!==null){
              this.props.navigation.navigate('HomeScreen')
            }
            else{
              this.props.navigation.navigate('ProviderLogin')
            }
          })
        },1000)
      }
  render() {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Image
      source={require('./splash.png')}
      />
     <ActivityIndicator animating size={Platform.OS==='android'?40:1} color='purple'/>
      </View>
    )
  }
}
function mapStateToProps(state){
  return({
  })
}
function mapActionsToProps(dispatch){
  return({
      setUID:(UID)=>{
        dispatch(setUIDAction(UID))
      }
  })
}
export default connect(mapStateToProps,mapActionsToProps)(Splash)