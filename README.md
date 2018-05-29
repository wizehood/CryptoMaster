# CryptoMaster
.Net core 2 + Vue.js app to compare cryptocurrency listings and store user purchases. Uses Okta identity provider for managing users and storing data chunks. Another show-off project.

### The motivation
I wanted to learn cool technologies but got left out of ideas for the project. 
Since I consider myself an earlyadopter of cryptocurrencies I thought what the hell, let's take good stuff and implement them into something useful. 
So there it is, the comparison site and investment tracker all-in-one. Hope the big guys won't sue me. Enjoy =)

The kudos to authors:
* https://developer.okta.com/blog/2017/09/06/build-a-cryptocurrency-comparison-site-with-vuejs
* https://scotch.io/tutorials/build-a-secure-to-do-app-with-vuejs-aspnet-core-and-okta
* https://sabe.io/tools/cryptocurrency-profit-calculator

### The prerequisites
Few things you need to get done before starting the project:
* install Node.js environment at https://www.npmjs.com/get-npm
* install .Net core SDK at https://www.microsoft.com/net/download/windows

* within your CLI, clone repository and navigate to root folder (/CryptoMaster)
* hit `npm install` to restore all required node packages for the web project
* hit `dotnet restore` to restore all required dependencies for the backend project
* hit `dotnet user-secrets set okta:token 00CtQT5w4p5eewBneVHEIJ4MPPSA4Xw3fAQBhRyRgu` to set token needed to communicate with Okta API service
* hit `dotnet run` to start the project and navigate to `http://localhost:50237`
