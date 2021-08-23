const {MongoClient } = require('mongodb');
const consoleString = "\u001b[1;32m [Database] \u001b[0m ";

export default async function searchDatabase(hashVal) {

    const uri = process.env.MONGODB_URI;

    const client = new MongoClient(uri);

    try {
        await client.connect();

        const res = await verifyUser(client,{
            name: hashVal,
        })

        return res

    } catch (e) {
        console.error(e);
    } finally {
        await client.close()
    }

}



async function verifyUser(client, potentialUser) {
    const alreadyExists = await findOneListingByName(client, potentialUser.name );
    if (alreadyExists) {
        console.log(`${consoleString} User already exists`)
        return false
    } else {
        console.log(`${consoleString} User not in system, adding them now...`)
        await createListing(client, potentialUser)
        console.log(`${consoleString} Added user`)
        return true
    }

}

async function findOneListingByName(client, nameOfUser) {
    const result = await client.db("id_verification").collection("verified_users").findOne({name: nameOfUser});
    console.log(`${consoleString} Checking if user is already in system...`)
    if(result) {
        return true;
    } else {
        return false;
    }
}

async function createListing(client, new_user) {
   const result = await client.db("id_verification").collection("verified_users").insertOne(new_user);
}

