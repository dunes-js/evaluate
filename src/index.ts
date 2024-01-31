import { type Context, createContext, runInContext } from "vm";

export function common<T>(result = null as T)
{
  return {
    result,
    console: console,
  } as ContextEntry<T>;
}

type ContextEntry<T = unknown> = {
  result: T
} & Context

type FunctionResult<T = unknown> = 
{
  ok: true
  result: T
}
|
{
  ok: false
  error: unknown
}

/** You can use return in script */
export function evaluate<T>(fnBody: string, ctx: ContextEntry<T> = common()) 
: FunctionResult<T>
{
  const script = `
    result = (() => {
      ${fnBody}
    })();
  `;

  const context = createContext(ctx);
  try 
  {
    runInContext(script, context);
    return {ok: true, result: context.result};
  } 
  catch (error) 
  {
    return {ok: false, error};
  }
}

/** You can use return in script */
export async function evaluateAsync<T>(fnBody: string, ctx: ContextEntry<T> = common()) 
: Promise<FunctionResult<T>>
{
  const script = `
    (async () => {
      result = await (async () => {
        ${fnBody}
      })();
    })();
  `;

  const context = createContext(ctx);

  try 
  {
    await runInContext(script, context);
    return {ok: true, result: context.result};
  } 
  catch (error) 
  {
    return {ok: false, error};
  }
}