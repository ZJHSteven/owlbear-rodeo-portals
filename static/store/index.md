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
- Create two-way portals (both ends are origin and destination)
- Teleport character token when moving center of character token into bounding box of origin token

## Installation

[Install Your Extension] using the URL [$MANIFEST_URL$](../manifest.json).

[Install Your Extension]: https://docs.owlbear.rodeo/extensions/tutorial-hello-world/install-your-extension/

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

#### Create one-way portals

1. Activate the _Portals_ tool.
2. Activate the _Add One-Way Teleport_ mode.
3. Click on the token that should be the origin.
4. Click on the token that should be the destination.
5. A notification is shown, that the link has been created.

![Animation: A one-way portal is created.]($GITLAB_PAGES$store/create-portal-link.gif)

#### Create two-way portals

1. Activate the _Portals_ tool.
2. Activate the _Add Two-Way Teleport_ mode.
3. Click on the token that should be one side of the portal.
4. Click on the token that should be the other side of the portal.
5. A notification is shown, that the link has been created.

### Delete portals

1. Right-click on an origin token.
2. Click the _Remove Destination_ context menu.
3. The link is removed (without notification.)

![Animation: The destination is removed from a portal token.]($GITLAB_PAGES$store/delete-portal-link.gif)

### Show existing links

The links are only shown for yourself and not for any other player or GM.

1. Activate the _Portals_ tool.
2. Click the _Show Links_ action.
3. The existing links are shown.
4. Click the _Hide Links_ action.
5. The existing links are no longer shown.

![Animation: The display of portal links is activated and deactivated.]($GITLAB_PAGES$store/show-portal-links.gif)

### Enter a portal

1. Select a character token.
2. Move it the center of the token into the bounding box of a portal origin.
3. The character token is automagically moved to the portal's destination.
4. The viewport of the player (all connections) that moved the token is centered on that token.

![Animation: A character token is teleported after entering a portal.]($GITLAB_PAGES$store/enter-portal.gif)

### Show/hide context menu

During a game session you might want to remove clutter from the context menu. For this, you can hide the context menu entries of this extension.

1. Activate the _Portals_ tool.
2. Click the _Hide Context Menu Entries_ action.
3. The context menu entries are removed.
4. Click the _Show Context Menu Entries_ action.
5. The context menu entries are created again.

![Animation: The context menu entries are remove and created.]($GITLAB_PAGES$store/remove-context-menu.gif)

## Support

If there are any issues with the extension, join the [Owlbear Rodeo Discord], create a new post and mention `@resident_uhlig` in the [#extension-support] channel.

For general comments, please use the thread [Portals chat].

[Owlbear Rodeo Discord]: https://discord.gg/UY8AXjhzhe
[#extension-support]: https://discord.com/channels/795808973743194152/1108276291960045578
[Portals chat]: https://discord.com/channels/795808973743194152/1257966858800332861
