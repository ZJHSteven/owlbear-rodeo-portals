---
title: $NAME$
description: $DESCRIPTION$
author: $AUTHOR$
image: $GITLAB_PAGES$store/enter-portal.gif
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

- [Create portals](#create-portals)
- [Delete portals](#delete-portals)
- [Show existing links](#show-existing-links) between origins and destinations

[role]: https://docs.owlbear.rodeo/extensions/apis/player#getrole

All players with permission to move a character token may [enter a portal](#enter-a-portal).

### Scope

All settings are stored as [metadata] of either tool or token.

[metadata]: https://docs.owlbear.rodeo/extensions/reference/metadata

### Create portals

1. Activate the *Portals* tool.
2. Activate the *Add One-Way Teleport* mode.
3. Click on the token that should be the origin.
4. Click on the token that should be the destination.
5. A notification is shown, that the link has been created.

![Animation: A one-way portal is created.]($GITLAB_PAGES$store/create-portal-link.gif)

### Delete portals

1. Right-click on an origin token.
2. Click the *Remove Destination* context menu.
3. The link is removed (without notification.)

![Animation: The destination is removed from a portal token.]($GITLAB_PAGES$store/delete-portal-link.gif)

### Show existing links

The links are only shown for yourself and not for any other player or GM.

1. Activate the *Portals* tool.
2. Click the *Show Links* action.
3. The existing links.
4. Click the *Hide Links* action.
5. The existing links.

![Animation: The display of portal links is activated and deactivated.]($GITLAB_PAGES$store/show-portal-links.gif)

### Enter a portal

1. Select a character token.
2. Move it the center of the token into the bounding box of a portal origin.
3. The character token is automagically moved to the portal's destination.

![Animation: A character token is teleported after entering a portal.]($GITLAB_PAGES$store/enter-portal.gif)
