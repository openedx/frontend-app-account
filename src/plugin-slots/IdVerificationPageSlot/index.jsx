import { PluginSlot } from '@openedx/frontend-plugin-framework';
import IdVerificationPage from '../../id-verification';

const IdVerificationPageSlot = () => (
  <PluginSlot
    id="org.openedx.frontend.account.id_verification_page.v1"
    idAliases={['id_verification_page_plugin']}
  >
    <IdVerificationPage />
  </PluginSlot>
);

export default IdVerificationPageSlot;
