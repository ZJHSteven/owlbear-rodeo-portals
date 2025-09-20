# 传送门商店文案（简体中文）

> 本页面用于源码内记录，实际商店展示内容请参见 `static/store/index.md`。

## 核心简介
- 在 Owlbear Rodeo 中通过传送链接瞬移角色令牌。
- 支持单向、双向、自动或确认式传送模式。
- 适用于陷阱、魔法阵、快捷移动等玩法场景。

## 功能亮点
1. **传送门管理**：一键创建、删除、显示或隐藏传送链接。
2. **多角色支持**：可选择保持相对位置，避免多名角色堆叠。
3. **安全控制**：按需禁用传送门或要求确认后再传送。
4. **自检工具**：内置完整性校验，快速定位缺失或异常配置。

## 安装步骤
1. 打开 Owlbear Rodeo，进入扩展设置页面。
2. 选择 “Install Your Extension”。
3. 填写 `https://localhost:8080/owlbear-rodeo-portals/manifest.json`（开发环境）或部署后的正式地址。
4. 如遇自签名证书提示，请在 Chromium 浏览器地址栏输入 `thisisunsafe`。

## 操作要点
- `GM` 角色负责创建、删除、显示链接以及维护上下文菜单。
- 拥有移动权限的玩家可直接触发传送门。
- 所有配置以元数据形式保存，可随房间同步。

## 支持
- 汉化疑问：<https://github.com/ZJHSteven/owlbear-rodeo-portals/issues>
- 功能反馈：<https://gitlab.com/resident-uhlig/owlbear-rodeo-portals/-/issues/new>
- 实时交流：Owlbear Rodeo Discord 的 `#extension-support` 频道。
