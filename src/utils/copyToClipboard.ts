import { showToast } from "./toastHelper";

function copyToClipboard(id) {
  navigator.clipboard.writeText(id).then(() => {
    showToast.success(`ID скопирован: ${id}`);
  });
}
export default copyToClipboard;
