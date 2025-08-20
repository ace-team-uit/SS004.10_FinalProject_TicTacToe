export const renderHeader = function renderHeader(target = document.body, title = "Tic Tac Toe") {
  const header = document.createElement("header");
  header.className = "ttt-header container";
  header.innerHTML = `<h1>${title}</h1>`;
  target.prepend(header);
};
