<a name="unreleased"></a>
## [Unreleased]


<a name="0.5.0"></a>
## [0.5.0] - 2021-12-09
### bug fixes
- correct error constructor arguments ([#100](https://github.com/Kong/kong-js-pdk/issues/100)) [9375614](https://github.com/Kong/kong-js-pdk/commit/9375614c7c3d5b198ee858a174c065a98b658f95)

### features
- allow plugin loading from discrete npm packages ([#101](https://github.com/Kong/kong-js-pdk/issues/101)) [ec76dc8](https://github.com/Kong/kong-js-pdk/commit/ec76dc83132d388aeecca41fb5e756c0b40fbd26)


<a name="0.4.4"></a>
## [0.4.4] - 2021-11-22
### bug fixes
- remove unnecessary promise wrappers ([#81](https://github.com/Kong/kong-js-pdk/issues/81)) [32d2c8b](https://github.com/Kong/kong-js-pdk/commit/32d2c8bc46734bedbd242850fa0c69584c624d22)
- remove unused import and use relative import in bin ([#80](https://github.com/Kong/kong-js-pdk/issues/80)) [65da804](https://github.com/Kong/kong-js-pdk/commit/65da804ab70ab2846b7b9a629281b65e171b0373)


<a name="0.4.3"></a>
## [0.4.3] - 2021-10-21
### bug fixes
- rename msgpack.pack to msgpack.encode ([#77](https://github.com/Kong/kong-js-pdk/issues/77)) [8fc0ff5](https://github.com/Kong/kong-js-pdk/commit/8fc0ff5ef9bcee5d446bdf3b19a5457c98c69f1a)


<a name="0.4.2"></a>
## [0.4.2] - 2021-08-13
### bug fixes
- allow to concat buffer larger than 64k ([#34](https://github.com/Kong/kong-js-pdk/issues/34)) [f0b0ce5](https://github.com/Kong/kong-js-pdk/commit/f0b0ce5f1a2ae5857402a3db931ba1f7b0bb8df0)
- add kong.response.error in plugin_test ([#35](https://github.com/Kong/kong-js-pdk/issues/35)) [4a469f1](https://github.com/Kong/kong-js-pdk/commit/4a469f1d77327890c0bb6217a418bcdc64acbc34)


<a name="0.4.0"></a>
## [0.4.0] - 2021-08-06
### features
- adds Version as named property in GetPluginInfo function in GetPluginInfo function([#20](https://github.com/Kong/kong-js-pdk/issues/20)) [383e44e](https://github.com/Kong/kong-js-pdk/commit/383e44e50ade0a74b390a0a822659591280dae3a)


<a name="0.3.5"></a>
## [0.3.5] - 2021-06-24

<a name="0.3.4"></a>
## [0.3.4] - 2021-06-15
### bug fixes
- server to generate correct Step functions ([#11](https://github.com/Kong/kong-js-pdk/issues/11)) [46208f5](https://github.com/Kong/kong-js-pdk/commit/46208f5c5c3968a82bddfd185b47dc8b34d8cb92)
- remove kong.table TS definitions ([#12](https://github.com/Kong/kong-js-pdk/issues/12)) [128bc58](https://github.com/Kong/kong-js-pdk/commit/128bc5850d9cdf4f51124623d394093914326f3e)


<a name="0.3.3"></a>
## [0.3.3] - 2021-05-19
### bug fixes
- reorganize dependencies ([#8](https://github.com/Kong/kong-js-pdk/issues/8)) [167e56c](https://github.com/Kong/kong-js-pdk/commit/167e56c2b1de07efd345bfddafff8ae7201e7a9b)


<a name="0.3.2"></a>
## [0.3.2] - 2021-05-19
### features
- add tooling to test plugin code ([#7](https://github.com/Kong/kong-js-pdk/issues/7)) [82d01a6](https://github.com/Kong/kong-js-pdk/commit/82d01a68885c5b049dc72aaf0a969cc476bbb38d)


<a name="0.3.1"></a>
## [0.3.1] - 2021-05-13
### bug fixes
- use standarlized error for instance not found exception [32960ff](https://github.com/Kong/kong-js-pdk/commit/32960ff1015f2cc85d2ad147d4fc31a1ba543b7d)


<a name="0.3.0"></a>
## [0.3.0] - 2021-05-07
### bug fixes
- popup PDK errors and add response phase [9152fc1](https://github.com/Kong/kong-js-pdk/commit/9152fc187420c66d2421af8ecdffbfe0617ea482)
- indent and style for package.json [883d1d7](https://github.com/Kong/kong-js-pdk/commit/883d1d7778b224cc5a836b78f74f125209f420ad)


<a name="0.1.0"></a>
## 0.1.0 - 2021-03-15
### features
- allow to import TypeScript plugin directly [c375a11](https://github.com/Kong/kong-js-pdk/commit/c375a11587af296ffeca5b103fa6e8c51e79d1a4)
- support write plugin in typescript [f63bb91](https://github.com/Kong/kong-js-pdk/commit/f63bb9182cc422f9a80c89abc59f6725dc6b426c)


[Unreleased]: https://github.com/Kong/kong-js-pdk/compare/0.5.0...HEAD
[0.5.0]: https://github.com/Kong/kong-js-pdk/compare/0.4.4...0.5.0
[0.4.4]: https://github.com/Kong/kong-js-pdk/compare/0.4.3...0.4.4
[0.4.3]: https://github.com/Kong/kong-js-pdk/compare/0.4.2...0.4.3
[0.4.2]: https://github.com/Kong/kong-js-pdk/compare/0.4.0...0.4.2
[0.4.0]: https://github.com/Kong/kong-js-pdk/compare/0.3.5...0.4.0
[0.3.5]: https://github.com/Kong/kong-js-pdk/compare/0.3.4...0.3.5
[0.3.4]: https://github.com/Kong/kong-js-pdk/compare/0.3.3...0.3.4
[0.3.3]: https://github.com/Kong/kong-js-pdk/compare/0.3.2...0.3.3
[0.3.2]: https://github.com/Kong/kong-js-pdk/compare/0.3.1...0.3.2
[0.3.1]: https://github.com/Kong/kong-js-pdk/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/Kong/kong-js-pdk/compare/0.1.0...0.3.0
