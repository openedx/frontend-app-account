|ci-badge| |Codecov| |npm_version| |npm_downloads| |license| |semantic-release|

frontend-app-account
====================

Please tag **@edx/community-engineering** on any PRs or issues.  Thanks!

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

This MFE is configured via environment variables supplied at build time.  All micro-frontends have a shared set of required environment variables, as documented in the Open edX Developer Guide under `Required Environment Variables <https://edx.readthedocs.io/projects/edx-developer-docs/en/latest/developers_guide/micro_frontends_in_open_edx.html#required-environment-variables>`__.

The account settings micro-frontend also supports the following additional variable:

``SUPPORT_URL``

Example: ``https://support.example.com``

The fully-qualified URL to the support page in the target environment.

edX-specific Environment Variables
**********************************

Furthermore, there are several edX-specific environment variables that enable integrations with closed-source services private to the edX organization, and are unsupported in Open edX.  Enabling these environment variables will result in undefined behavior in Open edX installations:

``COACHING_ENABLED``

Example: ``true`` | ``''`` (empty strings are falsy)

Enables support for a section of the micro-frontend that helps users arrange for coaching sessions.  Integrates with a private coaching plugin and is only used by edx.org.

``ENABLE_DEMOGRAPHICS_COLLECTION``

Example: ``true`` | ``''`` (empty strings are falsy)

Enables support for a section of the account settings page where a user can enter demographics information.  Integrates with a private demographics service and is only used by edx.org.

``DEMOGRAPHICS_BASE_URL``

Example: ``https://demographics.example.com``

Required only if ``ENABLE_DEMOGRAPHICS_COLLECTION`` is true.  The fully-qualified URL to the private demographics service in the target environment.

Example build syntax with a single environment variable:

.. code:: bash

   NODE_ENV=development ACCESS_TOKEN_COOKIE_NAME='edx-jwt-cookie-header-payload' npm run build

For more information see the document: `Micro-frontend applications in Open
edX <https://edx.readthedocs.io/projects/edx-developer-docs/en/latest/developers_guide/micro_frontends_in_open_edx.html#required-environment-variables>`__.

Known Issues
------------

None

Development Roadmap
-------------------

We don't have anything planned for the core of the MFE (the account settings page) - this MFE is currently in maintenance mode.
There may be a replacement for IDV coming down the pipe, so that may be DEPRed.
In the future, it's possible that demographics could be modeled as a plugin rather than being hard-coded into this MFE.


==============================

.. |ci-badge| image:: https://github.com/edx/edx-developer-docs/actions/workflows/ci.yml/badge.svg
   :target: https://github.com/edx/edx-developer-docs/actions/workflows/ci.yml
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
