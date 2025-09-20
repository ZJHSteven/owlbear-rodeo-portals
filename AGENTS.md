# AGENTS 记录

## 2025-09-20

- 调整 package.json 与 package-lock.json 的名称、描述、作者与仓库信息为汉化版本，并同步更新 sonar-project.properties。
- 临时保留 config.GITLAB_PAGES，待自有部署完成后替换，需在未来更新。

## 2025-09-20 （文档汉化）

- 重写 README.md 与 static/store/index.md，为商店与项目提供完整中文说明，并新增 docs/store.md 作为内部记录。
- 将 store.js 的主题切换标签翻译为中文；后续部署完成后需同步更新 learn-more 与静态资源链接。

## 2025-09-20 （代码汉化）

- 新增 src/i18n/strings.ts 集中维护界面标签、错误提示与确认文案，所有 UI/通知字符串改为简体中文。
- 更新工具、动作、上下文菜单与提示消息的翻译，实现与文档一致的术语；扩展 ID 调整为 com.github.zjhsteven.portals。
- 自检、帮助弹窗与更新日志等流程的提示语同步汉化，新增弹窗拦截提示。
- TODO：后续需将 changelog API 从 GitLab 迁移至 GitHub，避免新仓库缺少提交信息。

## 2025-09-20 （构建流程）

- 解决 `npm run build` 在 node20 下的 ESM 冲突，将 store 页面生成脚本改写为 `scripts/store-page-to-html.mjs`。
- build 脚本改为使用原生 node 执行，并恢复 TypeScript 脚本配置。
- 验证 `npm run build` 成功通过，保留 webpack 对资源体积的警告提示。

## 2025-09-20 （用户文档重排）

- 重写 README.md，新增“安装指南（面向新手 DM）”与“使用教学”模块，将安装步骤置于文首。
- 更新清单链接与静态资源域名为 `https://owlbear-rodeo-portals.pages.dev/`，提示卸载上游英文版后再安装汉化版。
- 精炼常见操作说明，补充高级选项与故障排查要点，方便初学者快速上手。
