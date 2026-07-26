import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

let reactotron: any;

if (__DEV__) {
  reactotron = Reactotron
    .configure({ name: 'CinemaClient' }) // controls connection & communication settings
    .useReactNative() // add all built-in react native plugins
    .use(reactotronRedux()) // hook up redux
    .connect(); // let's connect!
}

export default reactotron;
