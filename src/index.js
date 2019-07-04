const config = import('./config');
const os = import('os');
const openzwave = import('openzwave-shared');


var zwave = new OZW({
  Logging: true,
  ConsoleOutput: true,
  SaveConfiguration: true,
});

const getCOM = () => {
  return `COM_${String.prototype.toUpperCase(os.platform())}`
}

const setupWallPlug = () => {

};

const init = async () => {
  await zwave.conect(getCOM)
  .then(result => {
    console.log(`Connection established!\n${result}`);
  })
  .catch(error => {
    console.log(`Something went wrong!\n${error}`);
  });
}

