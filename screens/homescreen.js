/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable*/
import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
  AsyncStorage,
  Alert
} from "react-native";
import  ImagePicker from 'react-native-image-picker';

import { Header, Button, Input, Icon,Avatar } from "react-native-elements";
import { SafeAreaView } from 'react-navigation';
import {
} from '../store/actions/actions';
import { connect } from 'react-redux';
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      userData:null,      
      uploading:false
    };
  }

  async componentDidMount() {
    AsyncStorage.getItem('userData').then(data=>{
      if(data!==null){
        let user = JSON.parse(data)
        this.setState({
          userData:user,
          loading:false,
        })
      }
      else{

      }
    })
  }
  
  render() {
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator
            size={Platform.OS === "android" ? 30 : 1}
            color="darkred"
            animating
          />
        </View>
      );
    } else
      {return (
        <SafeAreaView style={styles.container}>
         {this.state.userData!==null && <View>
         {this.state.userData!==null &&  <Avatar containerStyle={{alignSelf:"center",marginTop:20}} 
       size="xlarge"
       rounded
      source={{uri:this.state.userData.profilePic?this.state.userData.profilePic:"https://placeimg.com/140/140/any"}}
     />  }
      <Text style={{textAlign:"center",fontSize:18}}>{this.state.userData.displayName}</Text>

           </View>}
          <View style={{alignItems:'center'}}>
          <View style={{position: 'absolute',
      width:180,
      height:40,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor:'#0fa646',
      borderRadius:12,
      top:400,
      marginBottom:25
      }}>
            <Button title="+Upload Image" onPress={()=>{
              var options = {
                title: 'Select Image',
                storageOptions: {
                 skipBackup: true,
                 path: 'images'
                }
             };
             ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            }else if (response.error) {
             console.log('ImagePicker Error: ', response.error);
            }else if (response.customButton) {
             console.log('User tapped custom button: ', response.customButton);
            }else {
             const data = new FormData();
             data.append('name', 'avatar');
             data.append('fileData', {
              uri : response.uri,
              type: response.type,
              name: response.fileName
             });
             const config = {
              method: 'POST',
              headers: {
               'Accept': 'application/json',
               'Content-Type': 'multipart/form-data',
              },
              body: data,
             };
             this.setState({
               uploading:true
             })
            fetch("http://192.168.43.64:3000/" + "upload", config)
            .then(res=>res.json()) 
            .then((data)=>{       
              if(data.message==='Success'){
                this.setState({
                  uploading:false
                })
                Alert.alert('Success',"Image has been uploaded succesfully")
              }
              else{
                Alert.alert("Failed","Unknown Error")
              }
             }).catch((err)=>{console.log(err)});
            }
          })}
          
              } disabled={this.state.uploading} buttonStyle={{backgroundColor:'#0fa646 ',height:40}}/>
          </View>
          </View>
        </SafeAreaView>
      );}
  }
}
//color={this.state.colors[index]}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3FDFF"
  },
  TouchableOpacityStyle: {
    position: "absolute",
    width: 140,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    bottom: "10%",
    backgroundColor: "purple",
    borderRadius: 12,
  }
});
function mapStateToProps(state) {
  return {
    UID: state.rootReducer.UID
  };;
}
function mapActionsToProps(dispatch) {
  return {
    
  };;
}
export default connect(
  mapStateToProps,
  mapActionsToProps
)(HomeScreen);
