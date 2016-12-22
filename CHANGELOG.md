# mock-mocha

## v1.0.0

First release with features, like:

- Save and restore original Mocha global methods
- Inject to `GlOBAL` mocked Mocha global methods
- Require NodeJS module without caching it by `require`
- Execute suites/tests/hooks registered during test by the mocked methods
- Observed the registration and status of suites/tests/hooks