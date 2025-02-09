import { Client, Account } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    // You need to provide your actual Appwrite project ID here
    .setProject('67a87d5700135201052f'); 

const account = new Account(client);

export { client, account };