import {
  applyDecorators,
  HttpStatus,
  RequestMethod,
  Type,
} from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ResOp } from '../model/response.model';

type ApiResultParams<T> = {
  type?: T | T[];
  // 是否需要分页
  isPage?: boolean;
  status?: HttpStatus;
};

const baseTypeNames = ['String', 'Number', 'Boolean'];

function genBaseProp(type: Type<any>) {
  if (baseTypeNames.includes(type.name)) {
    return { type: type.name.toLocaleLowerCase() };
  } else {
    return { $ref: getSchemaPath(type) };
  }
}

/**
 * @description: 生成返回结果装饰器
 */
export function ApiResult<TModal extends Type<any>>({
  type,
  isPage,
  status,
}: ApiResultParams<TModal>) {
  let prop = null;

  if (Array.isArray(type)) {
    const items = {
      type: 'array',
      items: { $ref: getSchemaPath(type[0]) },
    };
    if (isPage) {
      // 如果需要分页，定义分页的属性
      prop = {
        type: 'object',
        properties: {
          // 数据
          items,
          // 总数
          totalItems: { type: 'number', default: 0 },
          // 总页数
          totalPages: { type: 'number', default: 0 },
          // 当前页
          currentPage: { type: 'number', default: 0 },
        },
      };
    } else {
      // 如果不需要分页，直接定义为数组
      prop = {
        type: 'array',
        items: genBaseProp(type[0]),
      };
    }
  } else if (type) {
    // 如果 type 是单个类型，直接使用该类型
    prop = genBaseProp(type);
  } else {
    // 如果没有指定 type，默认为 null 类型
    prop = { type: 'null', default: null };
  }

  const model = Array.isArray(type) ? type[0] : type;

  return applyDecorators(
    ApiExtraModels(model),
    (
      target: object,
      key: string | symbol,
      descriptor: TypedPropertyDescriptor<any>,
    ) => {
      queueMicrotask(() => {
        const isPost =
          Reflect.getMetadata('method', descriptor.value) ===
          RequestMethod.POST;

        return ApiResponse({
          status: status ?? (isPost ? HttpStatus.CREATED : HttpStatus.OK),
          schema: {
            allOf: [
              { $ref: getSchemaPath(ResOp) },
              {
                properties: {
                  data: prop,
                },
              },
            ],
          },
        })(target, key, descriptor);
      });
    },
  );
}
