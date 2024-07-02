---
title: $NAME$
description: $DESCRIPTION$
author: $AUTHOR$
image: $GITLAB_PAGES$store/teleport.gif
icon: $GITLAB_PAGES$font-awesome/svgs/dungeon-solid.svg
tags:
  - tool
manifest: $GITLAB_PAGES$manifest.json
learn-more: $HOMEPAGE$
---

# $NAME$

## About

This extension lets you create portals between any kind of tokens in order to move character tokens on the map.

You can use the portals as traps, regular portals or teleportation circles.

## Features

- Create one-way portals (from origin to destination)
- Teleport character token when moving center of character token into bounding box of origin token

## Usage

### Permissions

Only players with the [role] `GM` may:

- Create portals
- Delete portals
- Show existing links between origins and destinations

[role]: https://docs.owlbear.rodeo/extensions/apis/player#getrole

All players with permission to move a character token may enter a portal.

### Scope

All settings are stored as [metadata] of either tool or token.

[metadata]: https://docs.owlbear.rodeo/extensions/reference/metadata
