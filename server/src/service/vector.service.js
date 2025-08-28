const  { Pinecone } = require('@pinecone-database/pinecone');

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

const cohortGptIndex = pc.index("cohrot-gpt")
//create a memory database with pincone yaha vectors , id and metadata mangega tumse upsert(create ya update krne ke liye)

const createMemory = async function({vectors,messageId,metadata}){
  await cohortGptIndex.upsert([{
    id:messageId.toString(),
    values:vectors,
    metadata
  }])
}

//rag(long-term-memory)
const searchMemory = async function({queryvector,limit=5,metadata}){
    const data = await cohortGptIndex.query({
        vector:queryvector,
        topK:limit,
        filter:metadata || undefined,
        includeMetadata:true
    })
    return data.matches
} 

module.exports = {
    createMemory,searchMemory
}