# Security Risk Assessment tool

The ISRA or Security risk assessment tool project is an Electron based application used internally in Thales DIS to evaluate security risks of engineering projects. 

It permits to define the primary assets, called the business assets, the associated supporting assets, the threat agents, the vulnerabilities and calculate associated risks ad potential risk treatment options. This process is fully compliant with ISO 27005 risk management standard.

Just download the zip file for your platform and unzip it and executre `sratool` or `SRATool`, depending on your platform. It is generic enough to be used by any organization, but some of the items may be more related to Thales DIS, in that case the `json-schema.js` should be adapted accordingly to your organization needs.

# Development information

# Prerequisites ##

To install and use the tool, the following prerequisites are required:

1. [Node.js](https://nodejs.org/en/) (required for Electron, recommended to download the latest LTS version available)

# Configurating the defaults ##

The defaults for the application can be configured as shown and described below:

## Usage ##

```js
    const config = {
    appVersion: '1.0.0',
    classification: '',
    organizations: ''
};

```

## Examples ##

<details>
  <summary>Override default security classification for project</summary>

```js
  const config = {
    appVersion: '1.0.0',
    classification: 'COMPANY CONFIDENTIAL {PROJECT}'
};

```

</details>

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

## Packaging and distribution ##

The packaging for distribution uses `electron-builder`. 

### Prerequisites

You need to have prepared your development environment beforehand by following the developer installation steps. You also need to ensure that the directory  `dist` under `app` does not exist.

You then need to run in the `app` directory the following command:

``` 
npm install electron-builder
```

To create packages for linux, MacOS and Windows, you must create the packages on an Apple Mac machine, otherwise only the host platform target will be created.

### Packaging

To create the packages for the host platform, you can run from the `app` directory:

``` 
npm run dist
```
For all platform packaging, from the `app` directory, run :

``` 
npm run dist-all
```

The output files should find themselves in the `dist` directory.


## Documentation

Documentation for lib is available at [lib/doc/index.html](lib/doc/index.html).


## Contributing

If you are interested in contributing to the ISRA software-risk-assesssment-tool project, start by reading the [Contributing guide](/CONTRIBUTING.md).

## License

The chosen license in accordance with legal department must be defined into an explicit [LICENSE](https://github.com/ThalesGroup/template-project/blob/master/LICENSE) file at the root of the repository
You can also link this file in this README section.
