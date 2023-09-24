
const basil3d_view_lines = (view, desc) => {
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
