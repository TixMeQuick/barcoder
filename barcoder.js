const {remote, ipcRenderer} = require('electron');
const {Menu, MenuItem} = remote;

var imageDataURL;

function encodeBarcodeInput(input) {
  ipcRenderer.send('barcode-input', input);
}

document.getElementById('encode-input').onclick = function() {
  encodeBarcodeInput(document.getElementById('text-input').value);
}

document.getElementById('print').onclick = () => {print()};

ipcRenderer.on('barcode-complete', (event, arg) => {
  console.log('barcode-complete');
  imageDataURL = "data:image/png;base64," + arg;
  document.getElementById('barcode').src = imageDataURL;
});

const menu = new Menu();
menu.append(new MenuItem({label: 'Copy Image', click() {
    ipcRenderer.send('clipboard-copy', imageDataURL);
  }
}));

document.getElementById('barcode').addEventListener('contextmenu', (e) => {
  menu.popup(remote.getCurrentWindow());
}, false);
