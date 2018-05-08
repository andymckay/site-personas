This Firefox browser extension is an attempt to make life easier when testing web sites and you need to:
* jump between different users on the same site
* jump between different servers on a site at the same URL

As an example I was testing functionality that required me to test:
* a logged in user with a certain flag set on a site
* a logged in user without a certain flag set on a site
* a logged out user
... and repeat the whole thing on another domain.

This can be accomplished by starting lots of different browsers or a browser with a different profile each time. Unfortunately it's easy to lose track of what is where and there is no coherent connection between them all.

**Status:** this is barely working and a proof of concept. Let me know how it goes.

How to use
----------

1. Click on the yellow button in the menu bar.

2. Create some "personas", by clicking on "Add a Persona". For example if I wanted to create a persona for "a logged in user behind a flag on github.com", I'd create one that was something like `name: github.com with flag`, `site: https://github.com`.

3. Open a tab for a "persona" by clicking on the "Open in new tab".

4. The persona appears in the URL bar. To the right of the URL bar is a yellow button to jump to other personas at the *same URL*.

5. Returning to the config page will list all tabs managed by personas so you can keep track of what is where.

Feedback
--------

Yes please, not sure if this is useful.
