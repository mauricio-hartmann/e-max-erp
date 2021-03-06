import { Request, Response } from "express";
import IRequestData from "../../../boundaries/interfaces/i-request-data";
import { AppError } from "../../../domain/shared/error/app-error";
import Result from "../../../domain/shared/use-cases/result";

export default class ExpressAdapter {

  /**
   * Retorna um middleware que recebe a função do controller a ser executada e um callback que executa após o controller realizar o processamento.
   * O middleware faz o parse da request vinda do express para a request esperada no controller, evitando o acoplamento;
   *
   * @param controllerFn Função do controller a ser executada
   * @param callback Callback
   */
  public static adaptMiddleware(controllerFn: (requestData: IRequestData) => Promise<Result<any, AppError>>, callback: (req: Request, res: Response, result: Result<any, AppError>) => any) {
    return async function (req: Request, res: Response) {
      const result = await controllerFn(ExpressAdapter._mapRequestToRequestData(req));
      callback(req, res, result);
    };
  }

  public static async adapt(controllerFn: (requestData: IRequestData) => Promise<Result<any, AppError>>, req: Request) {
    return await controllerFn(ExpressAdapter._mapRequestToRequestData(req));
  }

  private static _mapRequestToRequestData(req: Request): IRequestData {
    return { ...req };
  }

}
