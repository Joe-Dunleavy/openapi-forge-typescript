## OpenAPI Forge - TypeScript

This repository is the TypeScript template for the [OpenAPI Forge](https://github.com/ColinEberhardt/openapi-forge), see that repository for usage instructions:

https://github.com/ColinEberhardt/openapi-forge


## Quick Start

Clone and then navigate to root directory of the repository.

Install all the dependencies needed:
~~~
npm install
~~~
Once you have a local version, you can reference it's location as the 'generator' argument of the 'forge' command of openapi-forge. 
~~~
$ openapi-forge forge
 \ https://petstore3.swagger.io/api/v3/openapi.json
 \ {location of local generator}
 \ -o api
~~~

## Testing

Using the one command below you can automatically run the testing:
~~~
npm test [{featurePath} {generatorPath}]
~~~
The two arguments are optional.

You must give a featurePath and a generatorPath if you want custom paths.

Default values:

featurePath: node_modules/openapi-forge/features/*.feature

generatorPath: openapi-forge/src/generate

## Notes

The openapi-forge dependency is pointing to commit:6be3962bc263948237f71689b2df7ba73e116a55. If openapi-forge is updated and openapi-forge-typescript requires this updated version then the commit reference in package.json will have to be updated. This is a temporary measure and will be fixed once the packages are properly versioned and hosted on npm.  
