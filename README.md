[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/ThalesGroup/security-risk-assessment-tool/badge)](https://securityscorecards.dev/viewer/?uri=github.com/ThalesGroup/security-risk-assessment-tool)
# Security Risk Assessment tool

The ISRA or Security risk assessment tool project is an Electron based application used internally in Thales Digital Identity and Security Business Unit (Thales DIS) to evaluate security risks of engineering projects. 

It permits to define the primary assets, called the business assets, the associated supporting assets, the threat agents, the vulnerabilities and calculate associated risks and potential risk treatment options. This process is fully compliant with the ISO 27005 risk management standard.

## Usage ##

Creating a security risk assessment of engineering projects involves several steps, which are quickly summarized below (you can refer to ISO 27005 for more information):
1. Identify and define the scope of the risk assessment including assumptions and trusted boundaries.
2. Identify the business, also called primary assets, (what has value and is important from a business perspective) according to their required quality security sub-characteristics (see ISO 25010 for the definition of the security characteristics of products). The consequences for the loss of these security characteristics are rated here for each security quality sub-characterstic. This is equivalent to the Identification of assets and identification of consequences activities in ISO 27005. Examples of business assets: a payment service, user personal information, intellectual property or algorithm.
3. Identify the supporting assets, where the actual business assets will flow through or be managed. This is usually technical in nature, these assets may have vulnerabilities that are exploitable by threat agents. Example of supporting assets: volatile memory, storage location, data processing equipment, cryptograpgic keys, network, operating system, software application. The selection of supporting assets depends on the level of granularity required. These supporting assets should be linked to the business assets in the tool. For example, if a business asset is stored then it should be linked to a storage location. This is equivalent to the Identification of assets activities in ISO 27005.
4. Identify threats, and threat scenarios in the risk tab. This involves identifying the threat agents, what may be attacked and likelihood scenarios. Each threat should be defined as separate risk in the risk tab. This is the Identification of threats activity in ISO 27005.
5. Identify vulnerabilities that could be exploited for each threat scenario. This is done in the vulnerabilities tab, which should be linked to supporting assets. Each vulnerability should be scored with a score of 0 to 10. This is the identification of Vulnerabilities activity in ISO 27005.
6. In the risks tab, create an attack path of vulnerabilities for each threat. This will create incident scenarios. Complete the attack path with AND and OR combinations can be used. This is the Assessment of incident likelihood and Level of risk determination in ISO 27005. Once this step is completed, the risk level should be available for each incident scenario.
7. Determine level of acceptance of risks. For each evaluated risk, determine if risk is acceptable or not. This is equivalent to the Risk Evaluation activity in ISO 27005.
8. For those risks that need to be treated determine how they will be treated:
  * Mitigate or Modify: propose the security controls to put into place in the risks tab for each treatment decision, with the expected benefit of the security control (in % on risk level).
  * Retain: Risk is accepted as is.
  * Avoid:  Avoid the risk by stopping the activity, feature, project or by changing the architecture.
  * Share: Share or transfer the risk with the customer or another third-party.
   
In some cases, vulnerabilities may be found before the risks are actually defined, such as through security testing, then the steps above may be modified accordingly.

## How to run ##

Just download the zip file for your platform and unzip it and execute `sratool` or `SRATool`, depending on your platform. It is generic enough to be used by any organization, but some of the items may be more related to Thales DIS, in that case the `json-schema.js` should be adapted accordingly to your organization needs.

# Development information

# Prerequisites ##

To install and use the tool, the following prerequisites are required:

1. [Node.js](https://nodejs.org/en/) (required for Electron, recommended to download the latest LTS version available)

# Configurating the defaults ##

For developers that wish to configure the tool for their specific needs, the defaults for the application can be configured as shown and described below:

## Usage ##

```js
    const config = {
    appVersion: '1.2.0',
    classification: '',
    organizations: ''
};

```

## Examples ##

<details>
  <summary>Override default security classification for project</summary>

```js
  const config = {
    appVersion: '1.2.0',
    classification: 'COMPANY CONFIDENTIAL {PROJECT}'
};

```

</details>


<details>
  <summary>Override default organization options for project</summary>

```js
  const config = {
    appVersion: '1.2.0',
    organizations: ['Governance division','IT division', 'FinTech division']
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
For a specific platform packaging, from the `app` directory, run :

``` 
npm run dist-linux
npm run dist-mac
npm run dist-windows
```

The output files should find themselves in the `dist` directory.


## Documentation

Documentation for lib is available at [lib/doc/index.html](lib/doc/index.html).

## Contact

* Carl Eric Codere and Sebastien Petit are currently overseeing the project in Thales DIS

## Credits

* Frederic Paillart who managed the initial version of the tool using Infopath
* Megan Liow for the initial port to Electron.
* Alvin Siah for the major improvements to the Electron version.
* Sun Fang who reviewed and helped us improve the JSON Schema
* Thomas Delplanque who improved error management and corrected several issues.
* All other people including Philippe Biton, Frank Converset,  Antoine Galland,  Patrick George, Karen Lu, Sebastien Petit, Petr Skripal, who improved, commented and/or worked on the ISRA methodology throughout the years.

Since this methodology has been around for several years internally, we may have missed some names who contributed to it, our apologies if its the case. 

## Contributing

If you are interested in contributing to the ISRA software-risk-assesssment-tool project, start by reading the [Contributing guide](/CONTRIBUTING.md).

## License

The chosen license in accordance with legal department must be defined into an explicit [LICENSE](https://github.com/ThalesGroup/template-project/blob/master/LICENSE) file at the root of the repository
You can also link this file in this README section.
