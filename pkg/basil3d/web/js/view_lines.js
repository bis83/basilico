
const $__viewLines = (view, desc) => {
  if (desc.lines) {
    for (const line of desc.lines) {
      view.lines.push({
        pos: line.from,
        color: line.color,
      });
      view.lines.push({
        pos: line.to,
        color: line.color,
      });
    }
  }
};
