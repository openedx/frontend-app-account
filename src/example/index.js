import ConnectedExamplePage from './ExamplePage';
import reducer from './reducers';
import saga from './sagas';
import { configureApiService } from './service';
import { storeName } from './selectors';

export {
  ConnectedExamplePage,
  reducer,
  saga,
  configureApiService,
  storeName,
};
