|Build Status| |Codecov| |npm_version| |npm_downloads| |license| |semantic-release|

frontend-app-account
====================

Please tag **@sarina** on any PRs or issues.  Thanks!

Introduction
------------

This is a micro-frontend application responsible for the display and updating of a user's account information.

What is the domain of this MFE?

In this MFE: Private user settings UIs. Public facing profile is in a `separate MFE (Profile) <https://github.com/edx/frontend-app-profile>`_

- Account settings page

- Demographics collection

- IDV (Identity Verification)

Installation
------------

This MFE is bundled with `Devstack <https://github.com/edx/devstack>`_, see the `Getting Started <https://github.com/edx/devstack#getting-started>`_ section for setup instructions.

1. Install Devstack using the `Getting Started <https://github.com/edx/devstack#getting-started>`_ instructions.

2. Start up Devstack, if it's not already started.

3. Log in to Devstack (http://localhost:18000/login )

4. Within this project, install requirements and start the development server:
   
   .. code-block::

      npm install
      npm start # The server will run on port 1997

5. Once the dev server is up, visit http://localhost:1997 to access the MFE

   .. image:: ./docs/images/localhost_preview.png

Environment Variables/Setup Notes
---------------------------------

This MFE is configured via node environment variables supplied at build time. See the `.env` file for the list of required environment variables.
Example build syntax with a single environment variable:

.. code:: bash

   NODE_ENV=development ACCESS_TOKEN_COOKIE_NAME='edx-jwt-cookie-header-payload' npm run build

For more information see the document: `Micro-frontend applications in Open
edX <https://github.com/edx/edx-developer-docs/blob/5191e800bf16cf42f25c58c58f983bdaf7f9305d/docs/micro-frontends-in-open-edx.rst>`__.

Known Issues
------------

None

Development Roadmap
-------------------

We don't have anything planned for the core of the MFE (the account settings page) - this MFE is currently in maintenance mode.
There may be a replacement for IDV coming down the pipe, so that may be DEPRed.
In the future, it's possible that demographics could be modeled as a plugin rather than being hard-coded into this MFE.


==============================

.. |Build Status| image:: https://api.travis-ci.com/edx/frontend-app-account.svg?branch=master
   :target: https://travis-ci.com/edx/frontend-app-account
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
