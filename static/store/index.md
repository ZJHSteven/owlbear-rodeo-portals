---
title: $NAME$
description: $DESCRIPTION$
author: $AUTHOR$
image: $GITLAB_PAGES$store/enter-portal.gif
icon: $GITLAB_PAGES$font-awesome/svgs/dungeon-solid.svg
tags:
  - automation
manifest: $GITLAB_PAGES$manifest.json
learn-more: $HOMEPAGE$
---

# $NAME$

## About

This extension lets you create portals between [supported tokens](#supported-tokens) in order to teleport character tokens on the map.

You can use the portals as traps, regular portals or teleportation circles.

## Features

- Create one-way portals (from origin to destination)
- Create two-way portals (both ends are origin and destination)
- Teleport character token when moving center of character token into bounding box of origin token

## Installation

[Install Your Extension] using the URL [$GITLAB_PAGES$manifest.json](../manifest.json).

[Install Your Extension]: https://docs.owlbear.rodeo/extensions/tutorial-hello-world/install-your-extension/

## Usage

### Permissions

Only players with the [role] `GM` may:

- [Create portals](#create-portals)
- [Delete portals](#delete-portals)
- [Show existing links](#show-existing-links) between origins and destinations
- [Disable/enable portals](#disableenable-portals)

[role]: https://docs.owlbear.rodeo/extensions/apis/player#getrole

All players with permission to move a character token may [enter a portal](#enter-a-portal).

### Scope

All settings are stored as [metadata] of either tool or token.

[metadata]: https://docs.owlbear.rodeo/extensions/reference/metadata

### Supported tokens

The following type of tokens are supported:

- [Drawing](https://docs.owlbear.rodeo/docs/drawing/)
  - Curve
  - Line
  - Shape
    - Circle
    - Hexagon
    - Rectangle
    - Triangle
- [Image](https://docs.owlbear.rodeo/docs/images/)

### Create portals

There are two ways to add portals on your map.

1. Add a link between two existing tokens.

   1. Activate the _Portals_ tool.
   2. Activate the _Attach Teleport to Token_ mode.
   3. Click on the token that should be the origin.
   4. Click on the token that should be the destination.
   5. A notification is shown, that the link has been created.

   ![Animation: A link is added between two existing tokens.]($GITLAB_PAGES$store/attach-teleport.gif)

2. Place two new tokens and automatically link them.

   1. Activate the _Portals_ tool.
   2. Click the _Set Image (Origin)_ action to pick a token as the origin. (You only have to do this once.)
   3. Click the _Set Image (Destination)_ action to pick a token as the destination. (You only have to do this once.)
   4. Activate the _Add Teleport Token to Map_ mode.
   5. Click on the map where the origin should be placed.
   6. Click on the map where the destination should be placed.
   7. A notification is shown, that the link has been created.

   > ℹ️ The tokens are added to the "PROPS" layer by default. You can change the layer for them like every normal token.

   ![Animation: After defining the respective images, two tokens are added as origin and destinations.]($GITLAB_PAGES$store/add-teleport-tokens.gif)

### Enter a portal

1. Select a character token.
2. Move it to the center of the token into the bounding box of a portal origin.
3. The character token is automagically teleported to the portal's destination.
4. The viewport of the player (all connections) that moved the token is centered on that token.

![Animation: A character token is teleported after entering a portal.]($GITLAB_PAGES$store/enter-portal.gif)

### Keep relative position

You can configure a destination to keep teleported tokens in the same relative position they had before teleporting. This can be useful if you intend to use the portal for multiple tokens at once, e.g. for actual portals instead of simple traps.

1. Right-click on a destination token.
2. Click the _Spread Incoming Teleports_ context menu.
3. From now on the destination will spread the teleported tokens accordingly.

You can change this setting back by using the _Center Incoming Teleports_ context menu.

### Create two-way portals

Usually new portals only work in one direction, from origin to destination. To create two-way portals,
you can either create a one-way portal and then link the destination back to the origin manually.

Or you can toggle the direction for new portals. If the two-way direction is enabled, new links automatically are created in both directions.

![Animation: The direction is changed from one-way to two-way.]($GITLAB_PAGES$store/toggle-direction.gif)

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

### Disable/enable portals

You can disable or enable individual portals.

1. Right-click on the origin token.
2. Click the _Disable Teleportation_ context menu.
3. The portal is disabled.

You can enable the portal again by using the _Enable Teleportation_ context menu.

### Show/hide context menu

During a game session you might want to remove clutter from the context menu. For this, you can hide the context menu entries of this extension.

1. Activate the _Portals_ tool.
2. Click the _Hide Context Menu Entries_ action.
3. The context menu entries are removed.
4. Click the _Show Context Menu Entries_ action.
5. The context menu entries are created again.

![Animation: The context menu entries are remove and created.]($GITLAB_PAGES$store/remove-context-menu.gif)

## Troubleshooting

### Verify portals integrity

1. Activate the _Portals_ tool.
2. Click the _Verify Portals Integrity_ action.
3. A notification is shown, that indicates the integrity. Also, all offending items are selected.

   Furthermore, if there are any errors, you can open the browser's JavaScript console (<kbd>Ctrl + Shift + J</kbd> or <kbd>F12</kbd>) for details.

## Support

If there are any issues with the extension, join the [Owlbear Rodeo Discord], create a new post and mention `@resident_uhlig` in the [#extension-support] channel.

For general comments, please use the thread [Portals chat].

[Owlbear Rodeo Discord]: https://discord.gg/u5RYMkV98s
[#extension-support]: https://discord.com/channels/795808973743194152/1108276291960045578
[Portals chat]: https://discord.com/channels/795808973743194152/1257966858800332861
