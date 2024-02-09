const functions=require ('firebase-functions')

const admin=require('firebase-admin')


admin.initializeApp()


exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

exports.create=functions.https.onRequest(async(request,response)=>{
  try {
    const data = request.body;
    const result = await admin.firestore().collection("blogs").add(data) //in the collections add a new collection called "blogs" and add data to the collection
    return response.status(200).json({id:result.id})
  } catch (error) {
    return response.status(500).json({error: error})
  }
});

exports.update=functions.https.onRequest((request, response) => {
  try {
    const {id,...data}=request.body;
    const result = admin.firestore().collection("blogs").doc(id).update(data); //doc is to find the id inorder to update  
    return response.status(200).json({message:"data updated successfully",result});
  } catch (error) {
    return response.status(500).json({error: error})
    
  }
})


exports.getAll = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await admin.firestore().collection("blogs").get();
    const blogs = [];
    snapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    return response.status(200).json(blogs);
  } catch (error) {
    return response.status(500).json({ error: error });
  }
});


exports.getOne=functions.https.onRequest(async(request,response)=>{
  try {
    const {id}=request.query
    if(!id){
      return response.status(400).json({error:"id is required"})
    }
    const bData = await admin.firestore().collection("blogs").doc(id).get();
    if(!bData.exists){
      return response.status(400).json({error:"data not found"})
    }

    const singledata={id:bData,...bData.data()}
    return response.status(200).json(singledata)

  } catch (error) {
    return response.status(500).json({ error: error });
    
  }
})



exports.deleteData= functions.https.onRequest(async (request, response) => {
  try {
    const { id } = request.body; // Assuming the request body contains the ID of the document to delete
    if (!id) {
      return response.status(400).json({ error: "Missing  ID" });
    }

    await admin.firestore().collection("blogs").doc(id).delete();

    return response.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    return response.status(500).json({ error: error});
  }
});
