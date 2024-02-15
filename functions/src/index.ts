import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
//These lines import the firebase-functions and firebase-admin modules and initialize the Firebase Admin SDK.

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.create = functions.https.onRequest(async (request, response) => {
  try {
    const data = request.body;
    const result = await admin.firestore().collection("Blogs").add(data); //in the collections add a new collection called "blogs" and add data to the collection
    response.status(200).json({ id: result.id,message:"Account created successfully" });
  } catch (error) {
    response.status(500).json({ error: error });
  }
}); 


//in the collections add a new collection called "blogs" and add data to the collection

exports.update = functions.https.onRequest((request, response) => {
  try {
    const { id, ...data } = request.body;
    const result = admin.firestore().collection("Blogs").doc(id).update(data); //doc is to find the id inorder to update
    return response
      .status(200)
      .json({ message: "Account details updated successfully", result });
  } catch (error) {
    return response.status(500).json({ error: error });
  }
});

exports.getAll = functions.https.onRequest(async (request, response) => {
  try {
    const snapshot = await admin.firestore().collection("Blogs").get();
    const accounts= [];
    snapshot.forEach((doc) => {
      accounts.push({ id: doc.id, ...doc.data() });
    });
    return response.status(200).json({mesage:"All accounts",accounts});
  } catch (error) {
    return response.status(500).json({ error: error });
  }
});


//get individual account using firebase id on params
exports.getOne = functions.https.onRequest(async (request, response) => {
  try {
    const { id } = request.query;
    if (!id) {
      return response.status(400).json({ error: "id is required" });
    }
    const bData = await admin.firestore().collection("Blogs").doc(id).get();
    if (!bData.exists) {
      return response.status(400).json({ error: "data not found" });
    }

    const singledata = { id: bData, ...bData.data() };
    return response.status(200).json(singledata);
  } catch (error) {
    return response.status(500).json({ error: error });
  }
});


//delete individual account using firebase id on body
exports.deleteData = functions.https.onRequest(async (request, response) => {
  try {
    const { id } = request.body; // Assuming the request body contains the ID of the document to delete
    if (!id) {
      return response.status(400).json({ error: "Missing  ID" });
    }

    await admin.firestore().collection("Blogs").doc(id).delete();

    return response
      .status(200)
      .json({ message: "Data deleted successfully" });
  } catch (error) {
    return response.status(500).json({ error: error });
  }
});

//to add data to existing user by creating new collection with help of id passed onto body
exports.addToSubCollection = functions.https.onRequest(async (request, response) => {
  try {
    const { id, subCollectionData } = request.body; // enter the ID once the first data is created and data to add to the sub-collection
    if (!id) {
      return response.status(400).json({ error: "Missing ID" });
    }

    const subCollectionRef = admin.firestore().collection("Blogs").doc(id).collection("User Blogs");
    await subCollectionRef.add(subCollectionData);

    return response.status(200).json({ message: "Data added to sub-collection successfully" });
  } catch (error) {
    return response.status(500).json({ error: error });
  }
});



//give the original user id on params to get the sub-collection data (User blogs) of that particular user
exports.getSubCollectionData = functions.https.onRequest(async (request, response) => {
  try {
    const { id } = request.query; // Assuming the request query contains the ID of the document
    if (!id) {
      return response.status(400).json({ error: "Missing ID" });
    }

    const subCollectionRef = admin.firestore().collection("Blogs").doc(id).collection("User Blogs");
    const snapshot = await subCollectionRef.get();
    const subCollectionData = [];

    snapshot.forEach((doc) => {
      subCollectionData.push({ id: doc.id, ...doc.data() });
    });

    return response.status(200).json(subCollectionData);
  } catch (error) {
    return response.status(500).json({ error: error });
  }
});