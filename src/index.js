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

  switch(nodeId) {
    // Yes it starts with one, not developer friendly 😉
    case 1: {
      // Controller
      break;
    }
    case 2: {
      // In my case the fibaro wall plug
      zwave.setConfigParam(2, 1, 0, 1);   // Set 'Always On' to Active (0), default is Inactive (1)
      zwave.setConfigParam(2, 14, 5, 2);  // Set 'Periodic power and enery report' to 5 seconds, default is 3600.

      // Try if 'Always On' works
      zwave.setValue({ node_id:2, class_id: 37, instance:1, index:0}, false);
      break;
    }
  };

});
zwave.on('value changed', function(nodeid, comclass, value) {
  console.log("yo");
  // Logs report
  console.log('node%d event %d set to %s', nodeid, comclass, value.value);
});

