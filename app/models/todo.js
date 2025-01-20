import { client } from "../mongoClient.server";
let db = client.db("todos");
let collection = db.collection("todos");

export async function createTodoItem(todo) {
  let todoObj = {
    item: todo,
    isComplete: false,
  };

  let result = await collection.insertOne(todoObj);
  return result;
}
export async function getTodoItems() {
  let result = collection.find().toArray();
  return result;
}
