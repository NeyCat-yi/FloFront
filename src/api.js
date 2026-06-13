const BASE = '/api';

async function request(path, options = {}) {
  const { method = 'GET', body } = options;
  const config = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) config.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, config);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.msg || '请求失败');
  return data;
}

export const api = {
  // 基础信息
  getBasicLatest: () => request('/floBasic/latest/'),
  getBasicAll: () => request('/floBasic/all/'),

  // 加药调整
  addRegent: (data) => request('/floRegent/add/', { method: 'POST', body: { data } }),
  getRegentLatest: () => request('/floRegent/latest/'),
  getRegentAll: () => request('/floRegent/all/'),

  // 视频
  getVideoStreamUrl: (videoName) => `${BASE}/floVideo/stream/?video_name=${encodeURIComponent(videoName)}`,

  // 图像特征
  getImageFeatures: (videoName) =>
    request('/floImageFeat/image_feature/', { method: 'POST', body: { video_name: videoName } }),

  // 算法
  executeAlgo: (algorithmName, videoName) =>
    request('/floAlgo/execute/', { method: 'POST', body: { algorithm_name: algorithmName, video_name: videoName } }),
  listAlgorithms: () => request('/floAlgo/list_algorithms/'),
  getInputFrame: () => request('/floAlgo/get_input_frame/'),

  // 用户
  createUser: (data) => request('/floUser/custom_create/', { method: 'POST', body: data }),
  queryUsers: (params) => request('/floUser/custom_query/', { method: 'POST', body: params }),
  deleteUser: (userid) => request('/floUser/custom_delete/', { method: 'POST', body: { userid } }),
  updateUser: (data) => request('/floUser/custom_update/', { method: 'POST', body: data }),
};
