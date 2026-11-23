import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

test("forms and sessions handle validation, concurrent refresh, account changes and network failure", async (t) => {
  const require = createRequire(import.meta.url);
  const axios = require("axios") as typeof import("axios").default;
  const root = fileURLToPath(new URL("../../", import.meta.url));
  const data = new Map<string, string>();
  const previousStorage = Object.getOwnPropertyDescriptor(
    globalThis,
    "localStorage",
  );
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, value),
      removeItem: (key: string) => data.delete(key),
    },
  });
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { addEventListener() {} },
  });
  t.after(() => {
    if (previousStorage)
      Object.defineProperty(globalThis, "localStorage", previousStorage);
    else Reflect.deleteProperty(globalThis, "localStorage");
    if (previousWindow)
      Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  });
  let clears = 0;
  const cache = new Map<string, { exports: Record<string, unknown> }>();
  function load<T>(file: string): T {
    file = path.resolve(file);
    const cached = cache.get(file);
    if (cached) return cached.exports as T;
    const module = { exports: {} as Record<string, unknown> };
    cache.set(file, module);
    const source = fs
      .readFileSync(file, "utf8")
      .replace("import.meta.env.VITE_API_URL", '"https://test.invalid/api"');
    const code = ts.transpileModule(source, {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText;
    const localRequire = (id: string): unknown =>
      id === "axios"
        ? axios
        : id.endsWith("/queryClient")
          ? {
              queryClient: {
                clear() {
                  clears++;
                },
                cancelQueries() {
                  return Promise.resolve();
                },
              },
            }
          : id.startsWith(".")
            ? load(path.resolve(path.dirname(file), id + (fs.existsSync(path.resolve(path.dirname(file), id + ".ts")) ? ".ts" : ".tsx")))
            : require(id);
    new Function("require", "module", "exports", code)(
      localRequire,
      module,
      module.exports,
    );
    return module.exports as T;
  }
  const session = load<typeof import("../lib/session")>(
    root + "src/lib/session.ts",
  );
  const api = load<typeof import("../api/axios")>(
    root + "src/api/axios.ts",
  ).default;
  const schema = load<typeof import("../validations/transaction.schema")>(
    root + "src/validations/transaction.schema.ts",
  ).transactionSchema;
  const input = {
    title: " Rent ",
    category: " Home ",
    amount: "12.5001",
    type: "expense",
    occurredAt: "2026-09-01",
  };
  assert.equal(schema.parse(input).amount, 12.5001);
  assert.equal(schema.parse(input).title, "Rent");
  for (const amount of [
    "",
    "0",
    "-1",
    "1.12345",
    "1000000000000000",
    "Infinity",
  ])
    assert.equal(schema.safeParse({ ...input, amount }).success, false, amount);
  assert.equal(schema.safeParse({ ...input, title: " " }).success, false);
  assert.equal(
    schema.safeParse({ ...input, occurredAt: "2026-02-30" }).success,
    false,
  );
  const user = { id: "a", email: "a@test.invalid", currency: "NGN" };
  const response = (
    config: InternalAxiosRequestConfig,
    payload: unknown,
    status = 200,
  ): AxiosResponse => ({
    config,
    data: payload,
    status,
    statusText: "test",
    headers: {},
  });
  const unauthorized = (config: InternalAxiosRequestConfig): Promise<never> =>
    Promise.reject(
      new axios.AxiosError(
        "Unauthorized",
        "ERR_BAD_REQUEST",
        config,
        {},
        response(config, {}, 401),
      ),
    );
  const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 10));
  const jwtToken = (expiresAt: number, id = "a") =>
    "header." + Buffer.from(JSON.stringify({ exp: expiresAt, id })).toString("base64url") + ".signature";
  const freshToken = jwtToken(Math.floor(Date.now() / 1000) + 900);
  assert.equal(session.isAccessTokenFresh(freshToken), true);
  assert.equal(session.isAccessTokenFresh(jwtToken(Math.floor(Date.now() / 1000) - 1)), false);
  assert.equal(session.isAccessTokenFresh("malformed"), false);
  assert.equal(session.isAccessTokenFresh("header." + Buffer.from("{}").toString("base64url") + ".signature"), false);
  session.setSession({ token: "old", user });
  let refreshes = 0;
  api.defaults.adapter = async (config) => {
    if (config.url === "/auth/refresh") {
      refreshes++;
      await delay();
      return response(config, { token: freshToken });
    }
    if (config.headers.Authorization === "Bearer old")
      return unauthorized(config);
    return response(config, { ok: true });
  };
  await Promise.all([
    api.get("/transactions"),
    api.get("/analytics/summary"),
    api.get("/analytics/monthly"),
  ]);
  assert.equal(refreshes, 1);
  assert.equal(session.getSession()?.token, freshToken);
  let changes = 0;
  const unsubscribe = session.subscribeSession(() => changes++);
  api.defaults.adapter = (config) => unauthorized(config);
  await assert.rejects(api.get("/transactions"));
  assert.equal(session.getSession(), null);
  assert.equal(data.get("token"), undefined);
  assert.ok(changes > 0);
  unsubscribe();
  session.setSession({ token: "old", user });
  let release = () => {};
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  api.defaults.adapter = async (config) => {
    if (config.url === "/auth/refresh") {
      await waiting;
      return response(config, { token: "late" });
    }
    return unauthorized(config);
  };
  const pending = api.get("/transactions");
  await delay();
  session.setSession(null);
  session.setSession({ token: "b-token", user: { ...user, id: "b" } });
  release();
  await assert.rejects(pending);
  assert.equal(session.getSession()?.token, "b-token");
  assert.ok(clears >= 4);
  api.defaults.adapter = (config) =>
    config.url === "/auth/refresh"
      ? Promise.reject(
          new axios.AxiosError("Network Error", "ERR_NETWORK", config),
        )
      : unauthorized(config);
  await assert.rejects(api.get("/transactions"));
  assert.equal(session.getSession()?.token, "b-token");
  // Expired saved tokens are renewed before any dashboard request leaves the app.
  const expiredToken = jwtToken(Math.floor(Date.now() / 1000) - 60);
  session.setSession({ token: expiredToken, user });
  refreshes = 0;
  let protectedCalls = 0;
  assert.equal(api.defaults.timeout, 20000);
  api.defaults.adapter = async config => {
    if (config.url === "/auth/refresh") {
      assert.equal(config.timeout, 12000);
      refreshes++;
      await delay();
      return response(config, { token: freshToken, user });
    }
    protectedCalls++;
    assert.equal(config.headers.Authorization, "Bearer " + freshToken);
    return response(config, { ok: true });
  };
  await Promise.all([api.get("/transactions"), api.get("/analytics/summary")]);
  assert.equal(refreshes, 1);
  assert.equal(protectedCalls, 2);

  // No trusted-device cookie: clear the expired session without loading the dashboard.
  session.setSession({ token: expiredToken, user });
  protectedCalls = 0;
  api.defaults.adapter = async config => {
    if (config.url === "/auth/refresh") return unauthorized(config);
    protectedCalls++;
    return response(config, {});
  };
  await assert.rejects(api.get("/transactions"));
  assert.equal(protectedCalls, 0);
  assert.equal(session.getSession(), null);

  // A network timeout keeps the saved account available for an explicit retry.
  session.setSession({ token: expiredToken, user });
  api.defaults.adapter = async config => { throw new axios.AxiosError("timeout", "ECONNABORTED", config); };
  await assert.rejects(api.get("/transactions"));
  assert.equal(session.getSession()?.token, expiredToken);

  // A refresh response belonging to another account must never be adopted.
  api.defaults.adapter = async config => response(config, { token: freshToken, user: { ...user, id: "other" } });
  await assert.rejects(api.get("/transactions"));
  assert.equal(session.getSession(), null);

  // A late rejected refresh cannot sign out a newer login to the same account.
  session.setSession({ token: "old", user });
  let releaseSameAccount = () => {};
  const sameAccountWait = new Promise<void>(resolve => { releaseSameAccount = resolve; });
  api.defaults.adapter = async config => {
    if (config.url === "/auth/refresh") await sameAccountWait;
    return unauthorized(config);
  };
  const staleRequest = api.get("/transactions");
  await delay();
  const newerToken = jwtToken(Math.floor(Date.now() / 1000) + 1200);
  session.setSession({ token: newerToken, user });
  releaseSameAccount();
  await assert.rejects(staleRequest);
  assert.equal(session.getSession()?.token, newerToken);

  // A rejected renewed token is final; do not enter another refresh/retry loop.
  session.setSession({ token: expiredToken, user });
  refreshes = 0;
  api.defaults.adapter = async config => {
    if (config.url === "/auth/refresh") { refreshes++; return response(config, { token: freshToken }); }
    return unauthorized(config);
  };
  await assert.rejects(api.get("/transactions"));
  assert.equal(refreshes, 1);
  assert.equal(session.getSession(), null);

  const queryClient = load<typeof import("../lib/queryClient")>(root + "src/lib/queryClient.ts").queryClient;
  const retry = queryClient.getDefaultOptions().queries?.retry;
  assert.equal(typeof retry, "function");
  if (typeof retry === "function") {
    const config = { headers: new axios.AxiosHeaders() } as InternalAxiosRequestConfig;
    assert.equal(retry(0, new axios.AxiosError("unauthorized", "ERR_BAD_REQUEST", config, {}, response(config, {}, 401))), false);
    assert.equal(retry(0, new axios.CanceledError("session changed")), false);
    assert.equal(retry(0, new axios.AxiosError("offline", "ERR_NETWORK", config)), true);
    assert.equal(retry(1, new axios.AxiosError("offline", "ERR_NETWORK", config)), false);
  }

  // The reported homepage -> blank dashboard -> late login sequence must stay gated.
  const React = require("react") as typeof import("react");
  const { renderToStaticMarkup } = require("react-dom/server") as typeof import("react-dom/server");
  const { MemoryRouter } = require("react-router-dom") as typeof import("react-router-dom");
  const Auth = load<typeof import("../context/AuthContext")>(root + "src/context/AuthContext.tsx").default;
  const Protected = load<typeof import("../components/Protectedroute")>(root + "src/components/Protectedroute.tsx").default;
  const Home = load<typeof import("../pages/Homepage")>(root + "src/pages/Homepage.tsx").default;
  function renderAuth(loading: boolean, error: string | null, signedIn: boolean, home: boolean) {
    const value = {
      user: signedIn ? user : null, token: signedIn ? freshToken : expiredToken,
      isAuthenticated: signedIn, loading, sessionError: error,
      retrySession() {}, login() {}, logout: async () => {}, updateUser() {},
    };
    const child = home ? React.createElement(Home) : React.createElement(Protected, { children: React.createElement("p", null, "Private account data") });
    return renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Auth.Provider, { value }, child)));
  }
  const checking = renderAuth(true, null, false, true);
  assert.ok(checking.includes("Checking session"));
  assert.ok(!checking.includes('href="/dashboard"'));
  assert.ok(!checking.includes("Get started"));
  assert.ok(!renderAuth(true, null, false, false).includes("Private account data"));
  const unavailable = renderAuth(false, "Connection unavailable", false, false);
  assert.ok(unavailable.includes("Try again"));
  assert.ok(!unavailable.includes("Private account data"));
  assert.ok(renderAuth(false, null, true, true).includes('href="/dashboard"'));
  assert.ok(renderAuth(false, null, true, false).includes("Private account data"));
  assert.ok(renderAuth(false, null, false, true).includes("Get started"));

});
