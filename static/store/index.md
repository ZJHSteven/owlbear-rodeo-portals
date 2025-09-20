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

> 本页面由 ZJHSteven 维护，仅对上游文档进行简体中文翻译与本地化说明；功能实现仍源自原项目。

## 关于

此扩展允许你在地图上为[受支持的令牌](#supported-tokens)创建传送门，通过传送链接在房间中即时移动角色令牌。你可以把它当作陷阱、常规传送门或魔法传送阵使用。

## 功能

- 创建单向传送门（仅从起点到终点）。
- 创建双向传送门（两个端点互为起点和终点）。
- 当角色令牌移动到起点令牌包围盒中心时自动触发传送。

## 安装

请参考 Owlbear Rodeo 文档中的“Install Your Extension”，使用网址 [$GITLAB_PAGES$manifest.json](../manifest.json) 进行安装。当前链接仍指向上游静态资源，待自有部署完成后会更新。

## 使用

### 权限

只有拥有 `GM` 身份的玩家可以：

- [创建传送门](#create-portals)
- [删除传送门](#delete-portals)
- [展示现有链接](#show-existing-links)
- [启用或禁用传送门](#disableenable-portals)
- [切换传送确认方式](#toggle-confirmation-for-teleportation)

拥有角色令牌移动权限的玩家可以[进入传送门](#enter-a-portal)。

### 数据范围

所有设置会作为工具或令牌的[元数据](https://docs.owlbear.rodeo/extensions/reference/metadata)保存并跟随房间同步。

<a id="supported-tokens"></a>
### 支持的令牌

以下类型的令牌可以用作传送门：

- [Drawing](https://docs.owlbear.rodeo/docs/drawing/)
  - Curve
  - Line
  - Shape
    - Circle
    - Hexagon
    - Rectangle
    - Triangle
- [Image](https://docs.owlbear.rodeo/docs/images/)

<a id="create-portals"></a>
### 创建传送门

有两种方式可以在地图上添加传送门：

1. 在现有令牌之间建立传送链接。
   1. 启用“传送门”工具。
   2. 选择“将传送附加到令牌”模式。
   3. 点击作为起点的令牌。
   4. 点击作为终点的令牌。
   5. 会弹出通知提示链接已创建。

   ![动图：在两个现有令牌之间建立链接。]($GITLAB_PAGES$store/attach-teleport.gif)

2. 放置两个新的令牌并自动建立链接。
   1. 启用“传送门”工具。
   2. 点击“设置起点图像”动作，选择一个令牌作为起点（只需设置一次）。
   3. 点击“设置终点图像”动作，选择一个令牌作为终点（只需设置一次）。
   4. 切换到“在场景中放置传送令牌”模式。
   5. 在地图上点击起点位置。
   6. 在地图上点击终点位置。
   7. 会弹出通知提示链接已创建。

   > ℹ️ 新创建的令牌默认位于“PROPS”图层，可像普通令牌一样调整图层。

   ![动图：定义图像后自动放置一对传送门。]($GITLAB_PAGES$store/add-teleport-tokens.gif)

<a id="enter-a-portal"></a>
### 进入传送门

1. 选中一个角色令牌。
2. 将其中心移动到传送门起点令牌的包围盒内。
3. 角色会自动传送到终点位置。
4. 移动该令牌的玩家视角会自动跟随传送后的位置。

![动图：角色进入传送门后被传送。]($GITLAB_PAGES$store/enter-portal.gif)

### 保持相对位置

你可以为终点配置“保持相对位置”，适合多名角色同时通过传送门的场景：

1. 右键点击终点令牌。
2. 选择“分散到达位置”。
3. 之后传送的令牌会保持相对间距。

若需恢复默认行为，可选择“重叠到达位置”。

### 创建双向传送门

新建的传送门默认仅支持单向。如果希望双向传送，可以手动为终点建立反向链接，或在工具动作中切换到“双向模式”，之后创建的链接会自动双向互通。

![动图：切换传送方向模式。]($GITLAB_PAGES$store/toggle-direction.gif)

<a id="delete-portals"></a>
### 删除传送门

1. 右键点击起点令牌。
2. 选择“移除终点”。
3. 链接会被删除（不再出现通知）。

![动图：删除传送链接。]($GITLAB_PAGES$store/delete-portal-link.gif)

<a id="show-existing-links"></a>
### 显示传送链接

传送链接只对当前玩家可见：

1. 启用“传送门”工具。
2. 点击“显示传送链接”动作。
3. 现有链接会以指示器呈现。
4. 点击“隐藏传送链接”动作以关闭可视化。

![动图：显示与隐藏传送链接。]($GITLAB_PAGES$store/show-portal-links.gif)

<a id="disableenable-portals"></a>
### 启用或禁用传送门

- 右键起点令牌并选择“禁用传送”即可暂停该传送门。
- 通过“启用传送”可以重新激活。

<a id="toggle-confirmation-for-teleportation"></a>
### 切换传送确认方式

默认情况下，角色令牌放置到传送门上会自动传送。若希望先确认：

1. 右键起点令牌。
2. 选择“需要确认后传送”。
3. 下次触发传送时会弹出确认提示。

要恢复自动传送，可选择“自动传送”。

### 显示或隐藏上下文菜单项

在游戏过程中，你可以临时隐藏插件提供的上下文菜单项以减少干扰：

1. 启用“传送门”工具。
2. 点击“隐藏上下文菜单项”。
3. 菜单项会被移除。
4. 点击“显示上下文菜单项”即可重新创建。

![动图：切换上下文菜单项显示状态。]($GITLAB_PAGES$store/remove-context-menu.gif)

## 故障排查

### 验证传送门完整性

1. 启用“传送门”工具。
2. 点击“检查传送门完整性”。
3. 系统会在通知中显示检测结果，并选中存在问题的令牌。
4. 若仍有错误，可打开浏览器开发者工具（Ctrl+Shift+J 或 F12）查看详情。

## 支持与反馈

- 若遇到插件问题，可加入 [Owlbear Rodeo Discord](https://discord.gg/u5RYMkV98s)，在 [#extension-support](https://discord.com/channels/795808973743194152/1108276291960045578) 频道@`resident_uhlig` 获取上游支持。
- 若只涉及汉化或翻译文本，请前往 GitHub 仓库提交 Issue。
- 讨论帖：[Portals chat](https://discord.com/channels/795808973743194152/1257966858800332861)。
