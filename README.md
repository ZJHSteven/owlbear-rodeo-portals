# Portals for Owlbear Rodeo

<a href="https://gitlab.com/resident-uhlig/legacy-code"><img alt="Legacy Code: O++ S++ I C E- M-- V--- !PS D !A" src="https://img.shields.io/badge/Legacy%20Code-O%2B%2B%20S%2B%2B%20I%20C%20E--%20M----%20V------%20!PS%20D%20!A-informational"></a>

## About

This extension lets you create portals between any kind of tokens in order to move character tokens on the map in a room for [Owlbear Rodeo].

You can use the portals as traps, regular portals or teleportation circles.

[Owlbear Rodeo]: https://owlbear.rodeo/

## Installation

[Install Your Extension] using the URL <https://resident-uhlig.gitlab.io/owlbear-rodeo-portals/manifest.json>.

[Install Your Extension]: https://docs.owlbear.rodeo/extensions/tutorial-hello-world/install-your-extension/

## Features and Usage

For features and usage, please go to the [store page](static/store/index.md).

## Dependencies

At runtime, this extension depends on:

- [Owlbear Rodeo SDK]

The rest is written in vanilla JavaScript.

However, there are some dependencies for developing purpose,
that are managed using [npm] in [package.json](package.json).

[Owlbear Rodeo SDK]: https://github.com/owlbear-rodeo/sdk
[npm]: https://www.npmjs.com/

## Development

### Contribute

If you want to contribute, you can do this by [creating an issue]. Because my
time is limited, please be patient and if you want to submit some code, please
wait for my response before you start any actual coding.

[creating an issue]: https://gitlab.com/resident-uhlig/owlbear-rodeo-portals/-/issues/new

### Prepare the local source code

1. `git clone` the repository.
2. Run `npm install` in the repository root.

### Use local version in Owlbear Rodeo

1. `npm start` in the repository root.
2. [Install Your Extension] using URL <https://localhost:8080/owlbear-rodeo-portals/manifest.json>.

If this does not work, then it is most likely because of issues with the
self-signed certificate for localhost. Check your browser's JavaScript console.

Work-around for Chrome-based browsers:

1. Open the given URL in your browser.
2. Type `thisisunsafe` [^thisisunsafe]

[^thisisunsafe]: https://gist.github.com/RobertKeyser/e1dd0d6ff814c120c0b84575d266d9f7 "GitHub gist: Bypass Cert Errors in Chromium-based Browsers"

### Build production version

1. Run `npm run build` in the repository root.

### Backlog

#### Prioritized


#### To be prioritized

- fix: position and bounding box for items that lie (because of rotation)
- docs: create store image without smoke & spectre
- fix: only move tokens on character layer (because that's what the description of the extension says)
- feat: context menu to start a one-way link
- feat: context menu to start a two-way link
- fix: show indicators for new links if indicators are enabled
- feat: move viewport
- feat: two-way links
- fix: update start/end of indicators for current links when origin/destination move
- fix: update color of indicators for current links when theme changes
- fix: update color of indicator for new link when theme changes
- feat: change link origin
- feat: change link destination
- feat: change link directions
- feat: i18n
- feat: cursor
- refactor: no `as ...` conversion
- feat: tool to place a portal token and then link to another portal
- feat: tool to place a portal token and then place another portal token that is automatically linked
- feat: select default asset for new portals
- fix: use bounding boxes for collision instead of point
- feat: mishaps (teleport somewhere else)

### Update dependencies

1. `ncu` checks the dependencies.
2. `ncu -u` actually updates the dependencies.
3. `npm install` installs the updated dependencies.

### Code style

Use [.editorconfig](.editorconfig) for pre-formatting the source code in your
IDE. Enable git hooks to automatically format the code according
to [.prettierrc](.prettierrc) while commiting changes.

## License

### For this software

> Copyright (c) 2024 Sven Uhlig <git@resident-uhlig.de>
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> The Software shall be used for Good and must NOT be used for Evil.
>
> The Software must NOT be used to operate nuclear facilities, weapons, things
> owned by a state or its contractors, life support or mission-critical
> applications where human life or property may be at stake.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.

[Impressum](https://resident-uhlig.de/impressum.html)

### For 3rd parties

- [Font Awesome Free License](static/font-awesome/LICENSE.txt)
- [Owlbear Rodeo SDK License](https://github.com/owlbear-rodeo/sdk/blob/main/LICENSE)
