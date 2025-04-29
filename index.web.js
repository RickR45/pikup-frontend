import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('Pikup', () => App);
AppRegistry.runApplication('Pikup', {
  initialProps: {},
  rootTag: document.getElementById('root')
}); 