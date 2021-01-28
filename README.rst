|Build Status| |Codecov| |npm_version| |npm_downloads| |license| |semantic-release|

frontend-app-account
====================

This is a micro-frontend application responsible for the display and updating of a user's account information.  Please tag **@edx/arch-team** on any PRs or issues.

Development
-----------

Start Devstack
^^^^^^^^^^^^^^

To use this application `devstack <https://github.com/edx/devstack>`__ must be running and you must be logged into it.

-  Start devstack
-  Log in (http://localhost:18000/login)

Start the development server
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In this project, install requirements and start the development server by running:

.. code:: bash

   npm install
   npm start # The server will run on port 1997

Once the dev server is up visit http://localhost:1997.

Configuration and Deployment
----------------------------

This MFE is configured via node environment variables supplied at build time. See the .env file for the list of required environment variables. Example build syntax with a single environment variable:

.. code:: bash

   NODE_ENV=development ACCESS_TOKEN_COOKIE_NAME='edx-jwt-cookie-header-payload' npm run build


For more information see the document: `Micro-frontend applications in Open
edX <https://github.com/edx/edx-developer-docs/blob/5191e800bf16cf42f25c58c58f983bdaf7f9305d/docs/micro-frontends-in-open-edx.rst>`__.

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
