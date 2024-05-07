// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** addUser POST /api/userFace/add */
export async function addUserUsingPost1(
  body: API.UserFaceAddRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseLong_>('/api/userFace/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** addUser POST /api/userFace/addUser */
export async function addUserUsingPost2(
  body: API.UserFaceRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString_>('/api/userFace/addUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listBasicDelete POST /api/userFace/basic/lisDelete */
export async function listBasicDeleteUsingPost(body: number[], options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/userFace/basic/lisDelete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listBasicAdd POST /api/userFace/basic/listAdd */
export async function listBasicAddUsingPost(
  body: API.UserFaceVo[],
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseString_>('/api/userFace/basic/listAdd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** genUserBasic POST /api/userFace/basic/user */
export async function genUserBasicUsingPost(
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''));
        } else {
          formData.append(ele, JSON.stringify(item));
        }
      } else {
        formData.append(ele, item);
      }
    }
  });

  return request<API.BaseResponseListUserFaceVo_>('/api/userFace/basic/user', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

/** deleteUser POST /api/userFace/delete */
export async function deleteUserUsingPost1(
  body: API.DeleteRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/userFace/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** getImage POST /api/userFace/getImage */
export async function getImageUsingPost(body: string, options?: { [key: string]: any }) {
  return request<API.BaseResponseString_>('/api/userFace/getImage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** listUserVOByPage POST /api/userFace/list/page/vo */
export async function listUserVoByPageUsingPost1(
  body: API.UserfaceQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageUserFaceVoL_>('/api/userFace/list/page/vo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** updateUser POST /api/userFace/update */
export async function updateUserUsingPost1(
  body: API.UserFaceVoL,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean_>('/api/userFace/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
