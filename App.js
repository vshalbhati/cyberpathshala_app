import { Provider } from 'react-redux';
import { store } from './store';
import Routings from './components/Routings';

export default function App() {
  return (
    <Provider store={store}>
      <Routings/>
    </Provider>
  );
}
