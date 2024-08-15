####################
frontend-app-account
####################

|ci-badge| |Codecov| |npm_version| |npm_downloads| |license| |semantic-release|


********
Purpose
********

This is a micro-frontend application responsible for the display and updating of a user's account information.

What is the domain of this MFE?

In this MFE: Private user settings UIs. Public facing profile is in a `separate MFE (Profile) <https://github.com/openedx/frontend-app-profile>`_

- Account settings page
- IDV (Identity Verification)

***************
Getting Started
***************

Prerequisites
=============

The `devstack`_ is currently recommended as a development environment for your
new MFE.  If you start it with ``make dev.up.lms`` that should give you
everything you need as a companion to this frontend.

Note that it is also possible to use `Tutor`_ to develop an MFE.  You can refer
to the `relevant tutor-mfe documentation`_ to get started using it.

.. _Devstack: https://github.com/openedx/devstack

.. _Tutor: https://github.com/overhangio/tutor

.. _relevant tutor-mfe documentation: https://github.com/overhangio/tutor-mfe#mfe-development

Installation
============

This MFE is bundled with `Devstack <https://github.com/openedx/devstack>`_, see the `Getting Started <https://github.com/openedx/devstack#getting-started>`_ section for setup instructions.

1. Install Devstack using the `Getting Started <https://github.com/openedx/devstack#getting-started>`_ instructions.

2. Start up Devstack, if it's not already started.

3. Log in to Devstack (http://localhost:18000/login )

4. Within this project, install requirements and start the development server:

   .. code-block::

      npm install
      npm start # The server will run on port 1997

5. Once the dev server is up, visit http://localhost:1997 to access the MFE

   .. image:: ./docs/images/localhost_preview.png

Plugins
=======
This MFE can be customized using `Frontend Plugin Framework <https://github.com/openedx/frontend-plugin-framework>`_.

The parts of this MFE that can be customized in that manner are documented `here </src/plugin-slots>`_.

Environment Variables/Setup Notes
=================================

This MFE is configured via environment variables supplied at build time.  All micro-frontends have a shared set of required environment variables, as documented in the Open edX Developer Guide under `Required Environment Variables <https://edx.readthedocs.io/projects/edx-developer-docs/en/latest/developers_guide/micro_frontends_in_open_edx.html#required-environment-variables>`__.

The account settings micro-frontend also supports the following additional variable:

``SUPPORT_URL``

Example: ``https://support.example.com``

The fully-qualified URL to the support page in the target environment.

``PASSWORD_RESET_SUPPORT_LINK``

Examples:

- ``https://support.edx.org/hc/en-us/articles/206212088-What-if-I-did-not-receive-a-password-reset-message-``

- ``mailto:support@example.com``

The fully-qualified URL to the support page or email to request the support from in the target environment.

``ENABLE_ACCOUNT_DELETION``

Example: ``'false'`` | ``''`` (empty strings are true)

Enable the account deletion option, defaults to true.
To disable account deletion set ``ENABLE_ACCOUNT_DELETION`` to ``'false'`` (string), otherwise it will default to true.

Example build syntax with a single environment variable:

.. code:: bash

   NODE_ENV=development ACCESS_TOKEN_COOKIE_NAME='edx-jwt-cookie-header-payload' npm run build

For more information see the document: `Micro-frontend applications in Open
edX <https://edx.readthedocs.io/projects/edx-developer-docs/en/latest/developers_guide/micro_frontends_in_open_edx.html#required-environment-variables>`__.

Cloning and Startup
===================

.. code-block::


  1. Clone your new repo:

    ``git clone https://github.com/openedx/frontend-app-account.git``

  2. Use node v18.x.

    The current version of the micro-frontend build scripts support node 18.
    Using other major versions of node *may* work, but this is unsupported.  For
    convenience, this repository includes an .nvmrc file to help in setting the
    correct node version via `nvm <https://github.com/nvm-sh/nvm>`_.

  3. Install npm dependencies:

    ``cd frontend-app-account && npm ci``

  4. Start the dev server:

    ``npm start``

Local module development
=========================

To develop locally on modules that are installed into this app, you'll need to create a ``module.config.js``
file (which is git-ignored) that defines where to find your local modules, for instance:

.. code-block:: js

   module.exports = {
     /*
     Modules you want to use from local source code.  Adding a module here means that when this app
     runs its build, it'll resolve the source from peer directories of this app.

     moduleName: the name you use to import code from the module.
     dir: The relative path to the module's source code.
     dist: The sub-directory of the source code where it puts its build artifact.  Often "dist", though you
       may want to use "src" if the module installs React as a peer/dev dependency.
     */
     localModules: [
        { moduleName: '@openedx/paragon/scss', dir: '../paragon', dist: 'scss' },
        { moduleName: '@openedx/paragon', dir: '../paragon', dist: 'dist' },
        { moduleName: '@openedx/frontend-enterprise', dir: '../frontend-enterprise', dist: 'src' },
        { moduleName: '@openedx/frontend-platform', dir: '../frontend-platform', dist: 'dist' },
     ],
   };

See https://github.com/openedx/frontend-build#local-module-configuration-for-webpack for more details.

Known Issues
===========

None

Development Roadmap
===================

We don't have anything planned for the core of the MFE (the account settings page) - this MFE is currently in maintenance mode.
There may be a replacement for IDV coming down the pipe, so that may be DEPRed.

License
=======

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
============

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.


Getting Help
===========

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.  Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-app-account/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/community/connect


The Open edX Code of Conduct
============================

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

People
======
The assigned maintainers for this component and other project details may be found in Backstage or from inspecting catalog-info.yaml.

Reporting Security Issues
=========================

Please do not report security issues in public. Please email security@openedx.org.

==============================

.. |ci-badge| image:: https://github.com/openedx/edx-developer-docs/actions/workflows/ci.yml/badge.svg
   :target: https://github.com/openedx/edx-developer-docs/actions/workflows/ci.yml
   :alt: Continuous Integration
.. |Codecov| image:: https://img.shields.io/codecov/c/github/edx/frontend-app-account
   :target: https://codecov.io/gh/edx/frontend-app-account
.. |npm_version| image:: https://img.shields.io/npm/v/@edx/frontend-app-account.svg
   :target: @edx/frontend-app-account
.. |npm_downloads| image:: https://img.shields.io/npm/dt/@edx/frontend-app-account.svg
   :target: @edx/frontend-app-account
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-account.svg
   :target: @edx/frontend-app-account
.. |semantic-release| image:: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
   :target: https://github.com/semantic-release/semantic-release
