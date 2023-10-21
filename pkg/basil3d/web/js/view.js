
const $viewLines = (view, lines) => {
  view.lines = [];
  for (const line of lines) {
    view.lines.push({
      pos: line.from,
      color: line.color,
    });
    view.lines.push({
      pos: line.to,
      color: line.color,
    });
  }
};
