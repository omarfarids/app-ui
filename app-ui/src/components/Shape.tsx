import createEngine, {
  DiagramModel,
  DefaultNodeModel
} from "@projectstorm/react-diagrams";
import { CanvasWidget } from "@projectstorm/react-canvas-core";
import { useState } from "react";

  //1) setup the diagram engine
  var engine = createEngine();

  //2) setup the diagram model
  var model = new DiagramModel();

  //3-A) create a default node
  var node1 = new DefaultNodeModel({
    name: "node 1",
    color: "rgb(0,192,255)"
  });
  node1.setPosition(100, 100);
  let port1 = node1.addOutPort("Out");
  console.log(node1.getOptions().name)

  //3-B) create another default node
  var node2 = new DefaultNodeModel("node 2", "rgb(192,255,0)");
  let port2 = node2.addInPort("In");
  node2.setPosition(400, 100);

  // link the ports
  let link1 = port1.link(port2);

  //4) add the models to the root graph
  model.addAll(node1, node2, link1);

  //5) load model into engine
  engine.setModel(model);



function Shapes () {
  const [ connection , setConnection ] = useState<object>({
    "components": [
      {
          "id": node1.getID(),
          "name": node1.getOptions().name, 
      },
      {
          "id": node1.getID(),
          "name": node2.getOptions().name
      }
  ],
  "links": []
  })


  // sending post request to the moch server
  const sendRequest = () =>{
    fetch('http://localhost:3000/api/state/cache', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(connection)
    });
  }

  model.registerListener({
    linksUpdated: (event:any) => {
       event.link.registerListener({
           targetPortChanged: (event:any) => {
              console.log('New Connection')
               setConnection({...connection,links:[{
                "src":`${node1.getID()}`,
                "dest":`${node2.getID()}`
               }]});
               sendRequest()
           }
       })
    }
});

  //6) render the diagram!
  return (
    <div className='shapes'>
      <CanvasWidget engine={engine} />
    </div>
  );
};

export default Shapes