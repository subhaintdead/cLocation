import { registerRootComponent } from 'expo';
import './src/task'; // defines the background task before the app loads
import App from './App';

registerRootComponent(App);
