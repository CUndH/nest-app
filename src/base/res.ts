export interface IResProps {
  code?: number;
  message?: string;
  data?: any;
}

class IRes {
  success(data, msg?) {
    return {
      code: 200,
      data: data || null,
      message: msg || '成功'
    }
  }

  fail(props?: IResProps) {
    return {
      code: props.code || 500,
      data: props.data || null,
      message: props.message || '失败'
    }
  }
}

export const IResponse = new IRes()