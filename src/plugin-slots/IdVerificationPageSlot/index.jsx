import { PluginSlot } from '@openedx/frontend-plugin-framework';
import IdVerificationPage from '../../id-verification';

const IdVerificationPageSlot = () => (
  <PluginSlot id="id_verification_page_plugin">
    <IdVerificationPage />
  </PluginSlot>
);

export default IdVerificationPageSlot;
