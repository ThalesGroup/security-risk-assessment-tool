# Thales Open Source Template Project

Template for creating a new project in the [Thales GitHub organization](https://github.com/ThalesGroup). 

Each Thales OSS project repository **MUST** contain the following files at the root:

- a `LICENSE` which has been chosen in accordance with legal department depending on your needs 

- a `README.md` outlining the project goals, sponsoring sig, and community contact information, [GitHub tips about README.md](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/about-readmes)

- a `CONTRIBUTING.md` outlining how to contribute to the project, how to submit a pull request and an issue

- a `SECURITY.md` outlining how the security concerns are handled, [GitHub tips about SECURITY.md](https://docs.github.com/en/github/managing-security-vulnerabilities/adding-a-security-policy-to-your-repository)

Below is an example of the common structure and information expected in a README.

**Please keep this structure as is and only fill the content for each section according to your project.**

If you need assistance or have question, please contact oss@thalesgroup.com 



## Get started

The ISRA software-risk-assessment-tool project is an Electron application created based on the current ISRA risk assessment tool using InfoPath

### Prerequisites ###

To install and use the tool, the following prerequisites are required:

1. [Node.js](https://nodejs.org/en/) (required for Electron, recommended to download the latest LTS version available)

### Developer installation ###

1. Clone repository
```
git clone git@github.com:ThalesGroup/software-risk-assessment-tool.git
cd software-risk-assessment-tool
```
2. Install dependencies and run application
```
npm install
npm update
npm start
```

### Test ###

Executes all test files within test folder in lib

```
npm run test:lib
```

### API documentation ###

Generate api documentation for lib

```
npm run jsdoc
```

### Package and distribute ###

#### Manual distribution ####

[With prebuilt binaries](https://www.electronjs.org/docs/latest/tutorial/application-distribution#with-prebuilt-binaries)

1. [Download](https://github.com/electron/electron/releases) Electron prebuilt binaries zip file
    * (Window) electron-vXX.X.X-win32-x64.zip
    * (MacOs) electron-vXX.X.X-darwin-x64.zip
    * (Linux) electron-vXX.X.X-linux-x64.zip
2. Open 'resources' folder in zip file and create new 'app' folder
3. Copy your code, including modules, into 'app' folder
4. Execute `Electron.app` on macOS, `electron` on Linux, or `electron.exe` on Windows, and Electron will start as your app. The electron directory will then be your distribution to deliver to users.

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

