####################
frontend-app-account
####################

|license-badge| |status-badge| |ci-badge| |codecov-badge| |semantic-release|

The Account app is a `frontend-base`_ application: a library that plugs into
the Open edX frontend shell, rather than a standalone micro-frontend bundled
with its own webpack build.

.. _frontend-base: https://github.com/openedx/frontend-base

*******
Purpose
*******

This app is where learners manage their own account: the account settings
page (personal details, linked accounts, site language and time zone,
notification preferences, password reset and account deletion) and the ID
verification flow, which the LMS links to when a learner has to verify their
identity or change their verified name.

The public-facing profile is a `separate app (Profile)`_.

.. _separate app (Profile): https://github.com/openedx/frontend-app-profile

*********************
Branches and Releases
*********************

This app is published to NPM by ``semantic-release``, and its branches follow
`OEP-10 ADR 0002`_:

``master``
  Unstable.  Every merge publishes a prerelease on the ``alpha`` dist-tag.
  Breaking changes land here with no DEPR process and no warning, so it is not
  supported in production.  All changes, including bug fixes, should target this
  branch first.

``stable``
  Carries the newest stable major and owns the ``latest`` dist-tag.  Changes
  arrive here as backports from ``master``, and no breaking change lands after
  publication.

``n.x`` and ``n.m.x``
  Maintenance branches for majors and minors that ``stable`` has moved past.
  Each owns the dist-tag matching its own name, so consumers select a maintained
  line by semver range, e.g. ``"1.x"``.

``stable`` is not cut yet, and the package is not on NPM yet; `#1467`_ tracks
both.  Both ``.releaserc`` and the ``Release CI`` workflow already know the
whole layout, including the maintenance branch patterns, so a new line starts
publishing as soon as it is pushed.

This repository is no longer branched or tagged for Open edX releases in its own
right.  It participates by published version instead, per `OEP-10 ADR 0003`_.

The micro-frontend this app replaces goes on living on the ``legacy-mfe``
branch, which is where any further ``release/RELEASENAME`` branches for it are
cut, for as long as a supported release still ships it.

.. _#1467: https://github.com/openedx/frontend-app-account/issues/1467
.. _OEP-10 ADR 0002: https://docs.openedx.org/projects/openedx-proposals/en/latest/processes/oep-0010/decisions/0002-frontend-stable-branches.html
.. _OEP-10 ADR 0003: https://docs.openedx.org/projects/openedx-proposals/en/latest/processes/oep-0010/decisions/0003-frontend-release-strategy.html

***************
Getting Started
***************

Prerequisites
=============

A running Open edX instance is needed to serve this app's backend APIs.
`Tutor`_ in development mode is the usual choice, and ``site.config.dev.tsx``
already points at its default hostnames.

Unlike a micro-frontend, this app is neither built nor served by ``tutor-mfe``.
The dev server below runs on the host.

.. _Tutor: https://github.com/overhangio/tutor

Cloning and Startup
===================

1. Clone the repo:

   ``git clone https://github.com/openedx/frontend-app-account.git``

2. Use the version of Node specified in the ``.nvmrc`` file.

   Using other major versions of Node *may* work, but is unsupported.  This
   repository includes an ``.nvmrc`` file to help set the correct Node version
   via `nvm <https://github.com/nvm-sh/nvm>`_.

3. Install npm dependencies:

   ``cd frontend-app-account && npm install``

4. Start the dev server:

   ``npm run dev``

The dev server defaults to ``PORT=1997 PUBLIC_PATH=/account`` (set in the
``dev`` script in ``package.json``) and is available at
`http://apps.local.openedx.io:1997/account <http://apps.local.openedx.io:1997/account>`_.
The ID verification flow is at ``/account/id-verification``, which is the path
the LMS links to.

Configuration used by the dev server is defined in ``site.config.dev.tsx`` at
the repo root.

Local Development Against ``frontend-base``
===========================================

To develop this app and a local checkout of ``frontend-base`` in tandem, use the
built-in npm workspace support:

.. code-block:: sh

    mkdir -p packages/frontend-base
    sudo mount --bind /path/to/frontend-base packages/frontend-base
    npm install
    npm run dev:packages

Bind mounts are used instead of symlinks because Node resolves symlinks to their
real paths, which breaks hoisted dependency resolution.  When you are done,
unmount with ``sudo umount packages/frontend-base``.

Configuration
=============

This app is no longer configured by build-time environment variables.
``getAppConfig`` resolves three sources, in order of increasing precedence: the
app's bundled ``defaultConfig``, the site's ``commonAppConfig``, and the app's
``config``.  The first is the app author's, at build time; the other two are the
operator's, the second applying to every app on the site and the third to this
app alone.

The keys keep the names the micro-frontend read from its environment, so values
that reach the app through the MFE config API keep working.  Booleans accept
either a boolean or the strings ``'true'`` and ``'false'``.

.. list-table::
   :widths: 30 50 20
   :header-rows: 1

   * - Name
     - Description / Usage
     - Default

   * - ``SUPPORT_URL``
     - The site's support page, linked from the notice shown when an
       enterprise manages the learner's profile, on the settings page and in
       the ID verification flow.
     - ``null``

   * - ``PASSWORD_RESET_SUPPORT_LINK``
     - Where to send learners who never received the password reset email,
       e.g. a support article or a ``mailto:`` address.
     - ``null``

   * - ``ENABLE_ACCOUNT_DELETION``
     - Shows the "Delete My Account" section and its entry in the page
       navigation.
     - ``true``

   * - ``COUNTRIES_WITH_DELETE_ACCOUNT_DISABLED``
     - Country codes whose learners cannot delete their account, as an array or
       a JSON string, e.g. ``["CN"]``.
     - ``[]``

   * - ``SUPPORT_URL_TO_UNLINK_SOCIAL_MEDIA_ACCOUNT``
     - The support article explaining how to unlink a social media account,
       which learners with linked accounts have to do before deleting.
     - the edx.org help article

   * - ``MARKETING_EMAILS_OPT_IN``
     - Changes the wording of the "activate your account" notice shown to
       unverified accounts trying to delete themselves, for sites where
       activation also confirms the marketing email opt-in.
     - ``false``

   * - ``ENABLE_COPPA_COMPLIANCE``
     - Hides the year of birth field and the "Elementary/primary school"
       education level.
     - ``false``

   * - ``ENABLE_DOB_UPDATE``
     - With ``ENABLE_COPPA_COMPLIANCE``, asks learners with a year of birth
       that makes them under 13 to confirm their date of birth in a modal.
     - ``false``

   * - ``SHOW_PUSH_CHANNEL``
     - Adds the push notification channel to the notification preferences
       grid.
     - ``false``

The site name, LMS URL and logout URL come from the site config's ``siteName``,
``lmsBaseUrl`` and ``logoutUrl``.

The site language select offers the languages the site bundles translations
for, the same list as the shell's language menu, honoring the site config's
``supportedLanguages``.  In a checkout that has not run
``npm run translations:pull`` that is English alone.

*****
Slots
*****

This app offers slots for operators to customize its pages.  See `src/slots/`_
for the current list and per-slot READMEs with usage examples.

.. _src/slots/: ./src/slots/

**********
Developing
**********

Project Structure
=================

The layout follows the standard `frontend-base app layout`_:

- ``src/app.ts`` - the app definition imported by ``site.config.*.tsx``,
  including its ``defaultConfig``.
- ``src/constants.ts`` - the app's ``appId`` and route role identifiers.
- ``src/index.ts`` - the package's public exports (this is a library).
- ``src/routes.tsx`` - the app's react-router routes: the settings page at
  ``account`` and the ID verification flow under ``account/id-verification``.
- ``src/Main.tsx`` - the root component for the app's routes.
- ``src/slots.tsx`` - slot operations this app performs on *other* apps' slots
  (none at present).
- ``src/slots/`` - the slots this app offers to consumers.
- ``src/style.scss`` - app-scoped runtime styles, with partials in ``src/sass/``.

Everything else under ``src/`` is a feature directory: ``account-settings/``
for the settings page and its sections, ``notification-preferences/`` for the
notifications grid it embeds, ``id-verification/`` for the verification flow,
and ``data/`` for the shared react-query options and the country and language
lists.

For more, see the `frontend-base migration how-to`_.

.. _frontend-base app layout: https://github.com/openedx/frontend-base/blob/main/docs/how_tos/migrate-frontend-app.md#src-file-structure
.. _frontend-base migration how-to: https://github.com/openedx/frontend-base/blob/main/docs/how_tos/migrate-frontend-app.md

Build Process Notes
===================

**Library build**

``npm run build`` compiles the library into ``dist/`` via ``tsc`` and
``tsc-alias``, and copies the SCSS and asset files across.  This is what gets
published and consumed by sites.

**CI build**

``npm run build:ci`` runs ``openedx build`` against ``site.config.ci.tsx`` so
webpack traverses the full app graph.  This catches issues, such as broken
lazy-loaded imports, that ``tsc`` and Jest would not surface.

Internationalization
====================

Please refer to the `frontend-base i18n howto`_ for documentation on
internationalization.

.. _frontend-base i18n howto: https://github.com/openedx/frontend-base/blob/main/docs/how_tos/i18n.rst

************
Getting Help
************

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack invitation`_,
then join our `community Slack workspace`_.  Because this is a frontend
repository, the best place to discuss it would be in the `#wg-frontend channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-app-account/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/getting-help

*******
License
*******

The code in this repository is licensed under the AGPLv3 unless otherwise noted.

Please see `LICENSE <LICENSE>`_ for details.

************
Contributing
************

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

****************************
The Open edX Code of Conduct
****************************

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

******
People
******

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://backstage.openedx.org/catalog/default/component/frontend-app-account

*************************
Reporting Security Issues
*************************

Please do not report security issues in public, and email security@openedx.org
instead.

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-app-account.svg
    :target: https://github.com/openedx/frontend-app-account/blob/master/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen
    :alt: Maintained

.. |ci-badge| image:: https://github.com/openedx/frontend-app-account/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-app-account/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-app-account/coverage.svg?branch=master
    :target: https://codecov.io/github/openedx/frontend-app-account?branch=master
    :alt: Codecov

.. |semantic-release| image:: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
    :target: https://github.com/semantic-release/semantic-release
    :alt: semantic-release
