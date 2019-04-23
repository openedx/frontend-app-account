import ConnectedFeaturePage from './FeaturePage';
import reducer from './reducers';
import saga from './sagas';
import { configureApiService } from './service';
import { storeName } from './selectors';

export {
  ConnectedFeaturePage,
  reducer,
  saga,
  configureApiService,
  storeName,
};
