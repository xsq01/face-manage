// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** DataFaceType POST /api/DataFace/analysis */
export async function dataFaceTypeUsingPost(body: API.DataF, options?: { [key: string]: any }) {
  return request<API.BaseResponseListDataFc_>('/api/DataFace/analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
