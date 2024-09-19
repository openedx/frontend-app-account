import { IdVerificationPage } from '@edx/frontend-plugin-persona';
import { PLUGIN_OPERATIONS, DIRECT_PLUGIN } from '@openedx/frontend-plugin-framework';

// Load environment variables from .env file
const config = {
  pluginSlots: {
    notification_widget_plugin: {
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'notification_widget_plugin',
            type: DIRECT_PLUGIN,
            RenderWidget: IdVerificationPage,
          },
        },
      ],
    },
  }
};

export default config;
