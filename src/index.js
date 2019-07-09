import config from './config';
import os from 'os';
import openzwave from 'openzwave-shared';
import mqtt from 'mqtt';
import chalk from 'chalk';
import moment from 'moment';
const zwave = new openzwave({
  Logging: true,
  ConsoleOutput: true,
  SaveConfiguration: true,
});
const client = mqtt.connect(config.brokerUrl, config.brokerOptions);

const getCOM = () => {
  return `COM_${os.platform().toUpperCase()}`
}

const setupWallPlug = () => {
  // In my case the fibaro wall plug
  zwave.setConfigParam(2, 1, 1, 1);   // Set 'Always On' to Active (1), default is Inactive (0)
  zwave.setConfigParam(2, 14, 5, 2);  // Set 'Periodic power and enery report' to 5 seconds, default is 3600.

  // Try if 'Always On' works
  zwave.setValue({ node_id: 2, class_id: 37, instance: 1, index: 0 }, false);
};

const init = async () => {
  await zwave.connect(config[getCOM()])
}

init();

zwave.on('node ready', (nodeId, nodeInfo) => {
  console.log(chalk.green(`LOG: Node ${nodeId} is ready!`));
  console.log(chalk.yellow(`INFO: -----------------------------------------------------
  \tmanufacturer: \t\t${nodeInfo.manufacturer | ">"};
  \tmanufacturerid: \t${nodeInfo.manufacturerid};
  \tproduct: \t\t${nodeInfo.product};
  \tproducttype: \t\t${nodeInfo.producttype};
  \tproductid: \t\t${nodeInfo.productid};
  \ttype: \t\t\t${nodeInfo.type};
  \tname: \t\t\t${nodeInfo.name};
  \tloc: \t\t\t${nodeInfo.loc};
  ---------------------------------------------------------
  `));

  switch (nodeId) {
    // Yes it starts with one, not developer friendly 😉
    case 1: {
      // Controller
      break;
    }
    case 2: {
      setupWallPlug();
      break;
    }
  };

});
zwave.on('value changed', function (nodeid, comclass, value) {
  // Logs report & send over mqtt
  console.log('node%d class %d set to %s', nodeid, comclass, value.value);
  if (nodeid != 2) return;
  const timestamp = moment().toISOString(true);
  const data = {
    timestamp,
    nodeid,
    comclass,
    value
  }
  client.publish(config.zwaveTopic, JSON.stringify(data));
});

