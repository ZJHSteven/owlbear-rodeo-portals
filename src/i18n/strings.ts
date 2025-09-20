export const labels = {
  toolName: "传送门",
  attachMode: "将传送附加到令牌",
  createMode: "在场景中放置传送令牌",
  toggleLinkVisibilityShow: "显示传送链接",
  toggleLinkVisibilityHide: "隐藏传送链接",
  toggleContextMenuShow: "显示上下文菜单项",
  toggleContextMenuHide: "隐藏上下文菜单项",
  toggleDirectionToTwoWay: "启用双向模式",
  toggleDirectionToOneWay: "启用单向模式",
  setImageOrigin: "设置起点图像",
  setImageDestination: "设置终点图像",
  checkIntegrity: "检查传送门完整性",
  openHelp: "打开帮助（弹窗）",
  showInfo: "显示扩展信息",
  showChangelog: "查看更新日志",
};

export const contextMenuLabels = {
  removeDestination: "移除终点",
  addOneWayTeleport: "添加单向传送",
  addTwoWayTeleport: "添加双向传送",
  spreadRelative: "分散到达位置",
  spreadNone: "重叠到达位置",
  enableTeleport: "启用传送",
  disableTeleport: "禁用传送",
  automagicTeleport: "自动传送",
  confirmTeleport: "需要确认后传送",
};

export const notifications = {
  linkCreated: "传送链接已创建。",
  integrityOk: "未发现异常配置。",
  extensionInfo: (name: string, version: string, formattedDate: string) =>
    `${name} ${version}（构建时间：${formattedDate}）`,
  helpOpenFailed: (error: unknown) => `无法打开帮助：${error}`,
};

export const confirmMessages = {
  useTeleport: "是否确认使用该传送门？",
};

export const errors = {
  clickToSetOrigin: "请点击令牌以设置传送起点。",
  clickToSetFirstSide: "请点击令牌以指定传送门的第一端。",
  unsupportedToken: "当前令牌类型不受支持。",
  tokenAlreadyHasDestination: "该令牌已经绑定了传送终点。",
  indicatorAlreadySet: "已经存在活动传送指示器。",
  originNotSet: "尚未设置传送起点。",
  sameOriginAndDestination: "起点与终点不能是同一个令牌。",
  samePortalSides: "传送门的两端不能使用同一个令牌。",
  originHasDestination: "起点已经绑定了其他终点。",
  firstSideHasDestination: "传送门的第一端已经绑定终点。",
  secondSideHasDestination: "传送门的第二端已经绑定终点。",
  setOriginImage: "请先为传送起点选择图像。",
  popupBlocked: "浏览器拦截了弹出窗口。",
  setDestinationImage: "请先为传送终点选择图像。",
  originTypeUnsupported: "起点令牌类型不受支持。",
  originLayerInaccessible: (id: string) => `起点令牌 ${id} 位于不可访问的图层。`,
  destinationMissing: (id: string) => `终点令牌 ${id} 不存在。`,
  destinationTypeUnsupported: "终点令牌类型不受支持。",
  destinationLayerInaccessible: (id: string) => `终点令牌 ${id} 位于不可访问的图层。`,
  orphanDestination: (id: string) => `令牌 ${id} 疑似终点但未绑定任何起点。`,
};

export const changelogText = {
  loading: "加载中……",
  title: "更新日志",
  updateAvailablePrefix: "可用更新：",
  newEntryPrefix: "新条目：",
  moreEntriesNotice: "存在更早的更新记录，此处未显示。",
};
