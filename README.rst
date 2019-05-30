|Build Status| |Coveralls| |npm_version| |npm_downloads| |license|

frontend-app-account
=========================

Please tag **@edx/arch-team** on any PRs or issues.

Introduction
------------

React app for account settings.

Get Started
-----------

1. Start up your local devstack
2. If you don't have node installed. Install Node
3. In the project directory: npm install
4. Then run npm start
5. Open your browser to http://localhost:1997/account-settings

Important Note
--------------

The production Webpack configuration for this repo uses `Purgecss <https://www.purgecss.com/>`_ 
to remove unused CSS from the production css file. In webpack/webpack.prod.config.js the Purgecss
plugin is configured to scan directories to determine what css selectors should remain. Currently
the src/ directory is scanned along with all @edx/frontend-component* node modules and paragon.
If you add and use a component in this repo that relies on HTML classes or ids for styling you
must add it to the Purgecss configuration or it will be unstyled in the production build. 


.. |Build Status| image:: https://api.travis-ci.org/edx/frontend-app-account.svg?branch=master
   :target: https://travis-ci.org/edx/frontend-app-account
.. |Coveralls| image:: https://img.shields.io/coveralls/edx/frontend-app-account.svg?branch=master
   :target: https://coveralls.io/github/edx/frontend-app-account
.. |npm_version| image:: https://img.shields.io/npm/v/@edx/frontend-app-account.svg
   :target: @edx/frontend-app-account
.. |npm_downloads| image:: https://img.shields.io/npm/dt/@edx/frontend-app-account.svg
   :target: @edx/frontend-app-account
.. |license| image:: https://img.shields.io/npm/l/@edx/frontend-app-account.svg
   :target: @edx/frontend-app-account
