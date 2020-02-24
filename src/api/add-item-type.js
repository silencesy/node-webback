import request from '@/utils/request'

export function addItemType(data) {
  return request({
    url: 'addItemType',
    method: 'post',
    data
  })
}
export function getSeriesItemTypes(data) {
  return request({
    url: 'getSeriesItemTypes',
    method: 'get',
    params: data
  })
}

export function getOneItemTypes(data) {
  return request({
    url: 'getOneItemTypes',
    method: 'get',
    params: data
  })
}

export function addItem(data) {
  return request({
    url: 'addItem',
    method: 'post',
    data
  })
}
