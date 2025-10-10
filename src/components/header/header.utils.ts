const getActiveLabel = (menu, pathname) => {
  for (const item of menu) {
    if (item.path === pathname) {
      return item.label;
    }
    if (item.children) {
      for (const child of item.children) {
        if (child.path === pathname) {
          return child.label;
        }
      }
    }
  }
  return "";
};

export { getActiveLabel };
