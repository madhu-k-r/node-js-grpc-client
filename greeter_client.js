var PROTO_PATH = __dirname + '/../../protos/helloworld.proto';

var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
  var argv = parseArgs(process.argv.slice(2), {
    string: 'target'
  });
  var target;
  if (argv.target) {
    target = argv.target;
  } else {
    target = '172.30.169.138:50051';
  }
  var client = new hello_proto.Greeter(target,
                                       grpc.credentials.createInsecure());
  var user;
  if (argv._.length > 0) {
    user = argv._[0];
  } else {
    user = 'world';
  }

  // Function to print response message
  function printResponse(err, response) {
    console.log('Greeting:', response.message);
  }

  // Function to call sayHello RPC
  function callSayHello() {
    client.sayHello({ name: user }, printResponse);
  }

  // Call sayHello three times with a 10-second delay between each call
  for (var i = 0; i < 3; i++) {
    setTimeout(callSayHello, i * 10000);
  }
}

main();
