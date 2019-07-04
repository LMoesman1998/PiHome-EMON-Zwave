import config from './config';
import os from 'os';
import openzwave from 'openzwave-shared';
import chalk from 'chalk';

const zwave = new openzwave({
  Logging: true,
  ConsoleOutput: true,
  SaveConfiguration: true,
});

const getCOM = () => {
  return `COM_${os.platform().toUpperCase()}`
}

const setupWallPlug = () => {

};

const init = async () => {
  await zwave.connect(config[getCOM()])
}

init();

zwave.on('node ready', (nodeId, nodeInfo) => {
  console.log(chalk.green(`LOG: Node ${nodeId} is ready!`));
  console.log(chalk.blue(`INFO: -----------------------------------------------------
  \tmanufacturer: \t\t${nodeInfo.manufacturer | ">"};
  \tmanufacturerid: \t${nodeInfo.manufacturerid};
  \tproduct: \t\t\t${nodeInfo.product};
  \tproducttype: \t\t${nodeInfo.producttype};
  \tproductid: \t\t${nodeInfo.productid};
  \ttype: \t\t\t${nodeInfo.type};
  \tname: \t\t\t${nodeInfo.name};
  \tloc: \t\t\t${nodeInfo.loc};
  ---------------------------------------------------------
  `));

  zwave.setConfigParam(2, 1, 0, 1);
  zwave.setConfigParam(2, 14, 5, 2);
  //zwave.requestConfigParam(2, 1);
  //zwave.setValue({ node_id:2, class_id: 112, instance:1, index:1}, 1);
  zwave.setValue({ node_id:2, class_id: 37, instance:1, index:0}, true);
});
zwave.on('value changed', function(nodeid, comclass, value) {
  console.log("yo");
  console.log('node%d event %d set to %s', nodeid, comclass, value.value);
});

