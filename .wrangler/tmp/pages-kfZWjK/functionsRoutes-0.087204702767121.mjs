import { onRequest as __bigmodel___path___js_onRequest } from "C:\\Users\\User\\.gemini\\antigravity\\scratch\\app bói toán\\functions\\bigmodel\\[[path]].js"
import { onRequest as __deepseek___path___js_onRequest } from "C:\\Users\\User\\.gemini\\antigravity\\scratch\\app bói toán\\functions\\deepseek\\[[path]].js"
import { onRequest as __openai___path___js_onRequest } from "C:\\Users\\User\\.gemini\\antigravity\\scratch\\app bói toán\\functions\\openai\\[[path]].js"
import { onRequest as __zai___path___js_onRequest } from "C:\\Users\\User\\.gemini\\antigravity\\scratch\\app bói toán\\functions\\zai\\[[path]].js"

export const routes = [
    {
      routePath: "/bigmodel/:path*",
      mountPath: "/bigmodel",
      method: "",
      middlewares: [],
      modules: [__bigmodel___path___js_onRequest],
    },
  {
      routePath: "/deepseek/:path*",
      mountPath: "/deepseek",
      method: "",
      middlewares: [],
      modules: [__deepseek___path___js_onRequest],
    },
  {
      routePath: "/openai/:path*",
      mountPath: "/openai",
      method: "",
      middlewares: [],
      modules: [__openai___path___js_onRequest],
    },
  {
      routePath: "/zai/:path*",
      mountPath: "/zai",
      method: "",
      middlewares: [],
      modules: [__zai___path___js_onRequest],
    },
  ]