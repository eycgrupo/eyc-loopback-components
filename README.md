# Loopback 4 EYC Software Components

This mono repo hosts the different loopback components our company has been
using internally for the last 3 years and now released to the community.

For every loopback package that you install in your application, it is necessary
only 3 steps, no matter the extension and usually are:

- Import the component artifact along with the bindings or configuration
  options. Check every package README.md file
- Configure the component with options before registering it with the
  application
- Tell loopback application to load and bind (register) the component, usually
  the `app.component(YOURCOMPONENT)` is aded to the `application.ts` file

Then depending on the type of funcionality and the `artifacts` the `package`
exposes you should be able to `inject` them in your `controller` or `services`.

The loopback component artifact is the building block for the framework
extensiblity.

## Help us by contributing to

- Opening issues, feature requests
- Writing code, fixing bugs, opening pull requests
