# Restbox [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage][CoverageIMGURL]][CoverageURL]

[NPMIMGURL]: https://img.shields.io/npm/v/restbox.svg?style=flat
[LicenseIMGURL]: https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[NPMURL]: https://npmjs.org/package/restbox "npm"
[LicenseURL]: https://tldrlegal.com/license/mit-license "MIT License"
[BuildStatusURL]: https://github.com/coderaiser/restbox//actions?query=workflow%3A%22Node+CI%22 "Build Status"
[BuildStatusIMGURL]: https://github.com/coderaiser/restbox/workflows/Node%20CI/badge.svg
[CoverageURL]: https://coveralls.io/github/coderaiser/restbox?branch=master
[CoverageIMGURL]: https://coveralls.io/repos/coderaiser/restbox/badge.svg?branch=master&service=github

**REST** for **CRUD** file operations on `dropbox`.

## What is it?

**RE**presentational **S**tate **T**ransfer is an abstraction of the architecture of the World Wide Web.

**C**reate **R**ead **U**pdate **D**elete is 4 basic functions of persistent storage.

## Install

`npm i restbox`

## REST

|Name         |Method   |Query          |Body               |Description                    |
|:------------|:--------|:--------------|:------------------|:------------------------------|
|`fs`         |`GET`    |               |                   |get file or dir content        |
|             |         |`sort`         |                   |sort dir content by `name`,    |
|             |         |               |                   |`size`, or `time`              |
|             |         |`order`        |                   |order of sorting, can be:      |
|             |         |               |                   |`asc` or `desc`                |
|             |         |`raw`          |                   |get file or raw dir content    |
|             |         |`size`         |                   |get file or dir size           |
|             |         |`time`         |                   |get time of file change        |
|             |         |`hash`         |                   |get file hash                  |
|             |`PUT`    |               |file content       |create/write file              |
|             |         | `unzip`       |file content       |unzip and create/write file    |
|             |         | `dir`         |                   |create dir                     |
|             |`PATCH`  |               |diff               |patch file                     |
|             |`DELETE` |               |                   |delete file                    |
|             |         |`files`        |Array of names     |delete files                   |

## How to use?

```js
const restbox = require('restbox');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);

const port = 1337;
const ip = '0.0.0.0';

app.use(restbox({
    token: 'your dropbox token',
    prefix: '/dropbox', // default
    root: '/', // default, can be string or function
}));

app.use(express.static(__dirname));

server.listen(port, ip);
```

## License

MIT
