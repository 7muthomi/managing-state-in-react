import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import { validateText } from "../.server/validation";
import { createTodoItem, getTodoItems } from "../models/todo";
import { useEffect, useRef } from "react";
// import { client } from "../mongoClient.server";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader() {
  // getting todo items using utility functions
  let result = await getTodoItems();
  let todoItems = Array.from(result).map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));
  return todoItems;
}

export async function action({ request }) {
  let formData = await request.formData();

  let action = formData.get("_action");
  console.log({ action });

  switch (action) {
    case "create": {
      let todo = formData.get("todo");

      let fieldErrors = {
        todo: validateText(todo),
      };

      // return errors if any
      if (Object.values(fieldErrors).some(Boolean)) {
        return { fieldErrors };
      }

      // save the todo items to the db
      let result = await createTodoItem(todo);
      console.log({ result });
      break;
    }
    case "update": {
      console.log("is updating...");
      // update mongodb

      break;
    }
  }
  return null;
}

export default function Index() {
  let todoItems = useLoaderData();
  console.log({ todoItems });

  let actionData = useActionData();
  let navigation = useNavigation();
  console.log({ navigation });

  let isSubmitting = navigation.state === "submitting";
  console.log({ isSubmitting });

  let formRef = useRef(null);

  // clear form input after submission
  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
    }
  }, [isSubmitting]);

  // let todoItems = [
  //   {\
  //     id: 1,
  //     item: "Jog around",
  //     isComplete: false,
  //   },
  //   {
  //     id: 2,
  //     item: "10minute meditation",
  //     isComplete: false,
  //   },
  //   {
  //     id: 3,
  //     item: "Read for one hour",
  //     isComplete: false,
  //   },
  // ];
  return (
    <main>
      <div className="w-full mt-32 max-w-2xl mx-auto border border-green-500">
        <h1>Todo</h1>
        <Form
          method="post"
          className="bg-slate-500 p-4 rounded-md"
          ref={formRef}
        >
          <input type="hidden" name="_action" value="create" />
          <div className=" flex items-center gap-4">
            <input
              type="checkbox"
              name="complete"
              aria-label="complete"
              disabled
              className=""
            />
            <input
              type="text"
              name="todo"
              aria-label="new-todo"
              className="border border-gray-500 w-full px-4 py-2"
            />
          </div>
          {actionData?.fieldErrors ? (
            <p className="text-red-500 mt-2">{actionData.fieldErrors.todo}</p>
          ) : (
            <>&nbsp;</>
          )}
        </Form>

        {/* todo items from db */}
        {/* <TodoItem key={item.id} item={item.item}/> */}
        <div className="bg-slate-500 p-4 rounded-md mt-8 divide-y divide-slate-600">
          {todoItems.map((todoItem) => (
            <TodoItem key={todoItem._id} item={todoItem} />
          ))}
          <div className="flex gap-2 py-2">
            <input type="checkbox" name="complete" id="complete" />
            <label htmlFor="complete">Jog around</label>
          </div>
        </div>
      </div>
    </main>
  );
}

function TodoItem({ item }) {
  let submit = useSubmit();
  return (
    <div className="flex gap-2 py-2">
      <Form method="post">
        <input type="hidden" name="id" value={item._id} />
        <input type="hidden" name="_action" value="update" />
        <input
          type="checkbox"
          name="complete"
          id={item._id}
          onChange={(event) => submit(event.target.form)}
        />
      </Form>
      <label htmlFor="complete">{item.item}</label>
    </div>
  );
}
