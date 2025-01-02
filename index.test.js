import { addTodo, getTodos } from "./index.js";
import { before, after, test } from 'node:test';
import { Agent, MockAgent, setGlobalDispatcher } from 'undici';
import assert from 'node:assert/strict';
import { randomInt } from "node:crypto";

const mockAgent = new MockAgent();

before(() => {
  setGlobalDispatcher(mockAgent);
  mockAgent.disableNetConnect();
});

after(async () => {
  await mockAgent.close();
  setGlobalDispatcher(new Agent());
});

test('getTodo by id', async () => {
  const id = 1;

  const mockTodo = {
    id,
    userId: 1,
    title: "delectus aut autem",
    completed: false,
  };

  mockAgent
    .get(process.env.TODOS_API)
    .intercept({ path: `/todos/${id}` })
    .reply(200, mockTodo);

  const data = await getTodos(id);

  assert.deepEqual(data, mockTodo);
  mockAgent.assertNoPendingInterceptors();
});

test('post todo', async () => {
  const todo = {
    title: 'foo',
    body: 'bar',
    userId: 1,
  };

  const mockResponse = {
    ...todo,
    id: randomInt(1000),
  };

  mockAgent
    .get(process.env.TODOS_API)
    .intercept({
      method: 'POST',
      path: '/todos',
    })
    .reply(201, mockResponse);

  const response = await addTodo(todo);

  assert.deepEqual(response, mockResponse);
});