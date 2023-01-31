# Security Risk Assessment tool

The ISRA software-risk-assessment-tool project is an Electron based application used internally in Thales to evaluate security risks of engineering projects. 

It permits to define the primary assets, called the business assets, the associated supporting assets, the threat agents, the vulnerabilities and calculate associated risks ad potential risk treatment options. This process is fully compliant with ISO 27005 risk management standard.

Just download the zip file for your platform and unzip it and executre sratool or SRATool, depending on your platform.

# Development information

# Prerequisites ##

To install and use the tool, the following prerequisites are required:

1. [Node.js](https://nodejs.org/en/) (required for Electron, recommended to download the latest LTS version available)

## Developer installation ##

1. Clone repository
```
git clone git@github.com:ThalesGroup/software-risk-assessment-tool.git
cd software-risk-assessment-tool
```
2. Install dependencies for both app & lib folders and run application
```
app & lib:
npm install
npm update

app:
npm start
```

## Test ##

Executes all test files within test folder in lib

```
npm run test
```

## API documentation ##

Generate api documentation for lib

```
npm run jsdoc
```

## Package and distribute ##

### Manual distribution ###

[With prebuilt binaries](https://www.electronjs.org/docs/latest/tutorial/application-distribution#with-prebuilt-binaries)

1. [Download](https://github.com/electron/electron/releases) Electron prebuilt binaries zip file
    * (Window) electron-vXX.X.X-win32-x64.zip
    * (MacOs) electron-vXX.X.X-darwin-x64.zip
    * (Linux) electron-vXX.X.X-linux-x64.zip
2. Open 'resources' folder in zip file
3. Delete 'default_app.asar'
4. Copy your code, including modules, into 'resources' folder
5. Execute `Electron.app` on macOS, `electron` on Linux, or `electron.exe` on Windows, and Electron will start as your app. The electron directory will then be your distribution to deliver to users.

[With an app source code archive](https://www.electronjs.org/docs/latest/tutorial/application-distribution#with-an-app-source-code-archive)

Rename archive to 'app.asar'

## Documentation

Documentation for lib is available at [lib/doc/index.html](lib/doc/index.html).

You can use [GitHub pages](https://guides.github.com/features/pages/) to create your documentation.

See an example here : https://github.com/ThalesGroup/ThalesGroup.github.io

**Please also add the documentation URL into the About section (Website field)**

## Contributing

If you are interested in contributing to the ISRA software-risk-assesssment-tool project, start by reading the [Contributing guide](/CONTRIBUTING.md).

## License

The chosen license in accordance with legal department must be defined into an explicit [LICENSE](https://github.com/ThalesGroup/template-project/blob/master/LICENSE) file at the root of the repository
You can also link this file in this README section.

