export const getTodos = async (id) => {
  const response = await fetch(`${process.env.TODOS_API}/todos/${id}`);
  return response.json();
}

export const addTodo = async (body) => {
  const response = await fetch(`${process.env.TODOS_API}/todos`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  return response.json();
}