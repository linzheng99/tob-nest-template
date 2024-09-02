import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm'; // 导入typeorm库中的类型和类

// 定义分页选项接口
export interface IPaginationOptions {
  page: number; // 当前页码
  pageSize: number; // 每页显示的条数
  paginationType?: PaginationTypeEnum; // 分页类型
}

// 定义分页元数据接口
export interface IPaginationMeta extends ObjectLiteral {
  itemCount: number; // 当前页的项目数
  totalItems?: number; // 总项目数（可选）
  totalPages?: number; // 总页数（可选）
  currentPage: number; // 当前页码
}

// 定义分页类
export class Pagination<PaginationObject> {
  constructor(
    public readonly items: PaginationObject[], // 当前页的项目
    public readonly totalItems: number, // 总项目数
    public readonly totalPages: number, // 总页数
    public readonly currentPages: number, // 当前页码
  ) {}
}

export enum PaginationTypeEnum {
  LIMIT_AND_OFFSET = 'limit',
  TAKE_AND_SKIP = 'take',
}

const DEFAULT_LIMIT = 10; // 默认每页显示的条数
const DEFAULT_PAGE = 1; // 默认页码

// 解析分页选项，返回页码和每页条数
function resolveOptions(
  options: IPaginationOptions,
): [number, number, PaginationTypeEnum] {
  const { page, pageSize, paginationType } = options;

  return [
    page || DEFAULT_PAGE,
    pageSize || DEFAULT_LIMIT,
    paginationType || PaginationTypeEnum.TAKE_AND_SKIP,
  ];
}

// 创建分页对象
export function createPaginationObject<T>({
  items,
  totalItems,
  limit,
  currentPage,
}: {
  items: T[];
  totalItems?: number;
  limit: number;
  currentPage: number;
}): Pagination<T> {
  const totalPages =
    totalItems !== undefined ? Math.ceil(totalItems / limit) : undefined;

  return new Pagination<T>(items, items.length, totalPages, currentPage);
}

// 使用仓库进行分页(应对简单查询)
async function paginateRepository<T>(
  repository: Repository<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
): Promise<Pagination<T>> {
  const [page, limit] = resolveOptions(options);

  const promises: [Promise<T[]>, Promise<number> | undefined] = [
    repository.find({
      skip: limit * (page - 1), // 跳过前面的项目
      take: limit, // 获取指定数量的项目
      ...searchOptions, // 其他搜索选项
    }),
    undefined,
  ];

  const [items, total] = await Promise.all(promises);

  return createPaginationObject<T>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
  });
}

// 使用查询构建器进行分页(应对复杂查询)
async function paginateQueryBuilder<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: IPaginationOptions,
): Promise<Pagination<T>> {
  const [page, limit, paginationType] = resolveOptions(options);

  if (paginationType === PaginationTypeEnum.TAKE_AND_SKIP) {
    queryBuilder.take(limit).skip((page - 1) * limit);
  } else {
    queryBuilder.limit(limit).offset((page - 1) * limit);
  }

  const [items, total] = await queryBuilder.getManyAndCount();

  return createPaginationObject<T>({
    items,
    totalItems: total,
    currentPage: page,
    limit,
  });
}

// 根据传入的类型（仓库或查询构建器）进行分页
export async function paginate<T extends ObjectLiteral>(
  repositoryOrQueryBuilder: Repository<T> | SelectQueryBuilder<T>,
  options: IPaginationOptions,
  searchOptions?: FindOptionsWhere<T> | FindManyOptions<T>,
) {
  return repositoryOrQueryBuilder instanceof Repository
    ? paginateRepository<T>(repositoryOrQueryBuilder, options, searchOptions)
    : paginateQueryBuilder<T>(repositoryOrQueryBuilder, options);
}
