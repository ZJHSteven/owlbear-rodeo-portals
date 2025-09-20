# 传送门（Owlbear Rodeo 插件汉化版）

> 基于上游项目 [resident-uhlig/owlbear-rodeo-portals](https://gitlab.com/resident-uhlig/owlbear-rodeo-portals) 的二次开发，仅提供界面与文档的简体中文翻译。
>
> 汉化维护者：[@ZJHSteven](https://github.com/ZJHSteven)

## 项目概览

- 通过可配置的传送门在 Owlbear Rodeo 地图上瞬移角色令牌，可模拟陷阱、魔法阵或任意传送机制。
- 汉化范围覆盖插件 UI、上下文菜单、通知提示以及开发/商店文档。
- 当前仍复用上游的 GitLab Pages 静态资源，待自有部署完成后会更新为新的链接。

## 安装

推荐使用“从 URL 安装”的方式添加本汉化扩展：

- 复制清单链接：`https://owlbear-rodeo-portals.pages.dev/manifest.json`
- 在 OBR 中打开 Extensions → Install from URL，粘贴上述链接并确认。

提示：如你已从上游商店安装了英文版，请先卸载后再按以上步骤安装本汉化版本，以避免混淆。

## 快速体验

1. 将此仓库克隆到本地：`git clone https://github.com/ZJHSteven/owlbear-rodeo-portals.git`。
2. 在项目根目录执行 `npm install` 安装依赖。
3. 运行 `npm start` 启动开发服务器，默认地址为 <https://localhost:8080/owlbear-rodeo-portals/>。
4. 在 Owlbear Rodeo 中选择“Install Your Extension”，并填写 `https://localhost:8080/owlbear-rodeo-portals/manifest.json`。
5. 如果浏览器因自签名证书拒绝访问，可在地址栏直接输入 `thisisunsafe`（Chromium 内核浏览器）跳过警告。

## 功能特性

- 一键创建单向或双向传送门。
- 为角色移动提供自动或确认式传送模式。
- 支持按角色相对位置进行群体传送，避免令牌重叠。
- 在画布上高亮现有传送链接，便于调试与复查。
- 内置完整的上下文菜单操作，可启用/禁用/验证传送门状态。

## 安装与使用说明

### Owlbear Rodeo 商店

- 访问（暂时使用上游页面）<https://resident-uhlig.gitlab.io/owlbear-rodeo-portals/store/index.html> 了解图文教程。
- 商店将展示汉化后的名称、描述与截图；部署完成后会迁移至自有页面。

### 权限与范围

- 仅 GM 角色可以创建、删除或切换传送设置。
- 拥有移动权限的玩家可以触发传送。
- 所有设置都保存在工具或令牌的元数据中，随存档同步。

### 常用操作

- **创建传送门**：选择“附加传送到令牌”或“在场景中放置传送令牌”，按提示选择起点与终点。
- **显示/隐藏链接**：使用工具操作面板中的“显示/隐藏链接”按钮。
- **管理上下文菜单**：根据需要添加或隐藏插件提供的右键菜单条目。
- **校验完整性**：通过“检查传送门完整性”快速定位遗失或配置错误的令牌。

## 开发工作流

1. `npm start`：启用带热更新的开发服务器。
2. `npm run build`：编译生产版本并生成 `public/` 目录资源。
3. 建议启用 `.husky` 钩子以获得统一的 Prettier/TypeScript 格式化体验。

## 依赖清单

- 运行期：[@owlbear-rodeo/sdk](https://github.com/owlbear-rodeo/sdk)、[React](https://react.dev/)、[Font Awesome](https://fontawesome.com/)。
- 构建期：TypeScript、Webpack、Babel、Prettier 等（详见 `package.json`）。

## 贡献与反馈

- 若发现汉化错漏或希望补充中文文档，请在 GitHub 仓库创建 Issue：<https://github.com/ZJHSteven/owlbear-rodeo-portals/issues>。
- 若需核心功能改进或报告原始 Bug，请尊重上游作者劳动并在其仓库提交 Issue：<https://gitlab.com/resident-uhlig/owlbear-rodeo-portals/-/issues/new>。
- 提交代码前建议先沟通需求，避免与后续汉化更新冲突。

## 后续计划

- [ ] 完成自有静态资源部署，替换 `config.GITLAB_PAGES` 与商店链接。
- [ ] 研究 GitHub 提供的 changelog 接口，替换当前基于 GitLab API 的更新日志实现。
- [ ] 汇总常见 GM 工作流程，补充中文示例图。

## 许可证

本项目继承上游的 MIT 授权条款，以下为中文翻译，仅供理解：

> 版权 (c) 2024 Sven Uhlig。
>
> 任何获得本软件及其文档副本的人，可在遵守以下条件的前提下免费使用：可以自由使用、复制、修改、合并、出版、分发、再许可或销售软件副本，并允许软件提供者这样做。
>
> 条件：必须在所有副本或主要部分中包含上述版权声明和本许可声明。
>
> 限制：只能用于“善”，不得用于“恶”；不得用于核设施、武器、政府或承包商拥有的资产、生命维持或其他攸关生命财产安全的关键任务。
>
> 软件按“现状”提供，不提供任何明示或默示的担保，包括但不限于适销性或特定用途适用性。作者或版权持有人不对因软件或软件使用或其他交易而产生的任何索赔、损害或其他责任负责。

如需查看英文原文，请参阅 `LICENSE` 文件或上游仓库说明。

## 致谢

- 感谢 Sven Uhlig 提供完整的传送门功能实现。
- 感谢 Owlbear Rodeo 团队提供开放的扩展接口。
