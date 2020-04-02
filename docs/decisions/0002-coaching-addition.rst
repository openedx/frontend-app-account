1. Add Coaching Consent
--------------------------------

Status
------

Accepted

Context
-------

We need to provide users who are eligible for coaching with both an always available
coaching toggle and a one-time form they can view to signup for coaching.

Decision
--------

While the coaching functionality is currently both limited, closed source, and the form
exists outside of the standard design of this MFE, it was decided to add it here as a
temporary measure due to it being at it's core, an account setting.

The longer term solutions include either:
  - using the frontend plugins feature when they become available to inject our coaching
    work into the account MFE
  - roll it into it's own MFE if enough additional coaching frontend work is required

Consequences
------------

Code will exist inside this Open edX MFE that integrates with a closed source app.
