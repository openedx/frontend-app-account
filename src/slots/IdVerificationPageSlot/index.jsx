import { Slot } from '@openedx/frontend-base';
import IdVerificationPage from '../../id-verification';

const IdVerificationPageSlot = () => (
  <Slot
    id="org.openedx.frontend.slot.account.idVerificationPage.v1"
    idAliases={['id_verification_page_plugin']}
  >
    <IdVerificationPage />
  </Slot>
);

export default IdVerificationPageSlot;
