import request from '@/utils/request'

export function getAttrSpec() {
  return request({
    url: 'getAttributesAndSpecification',
    method: 'get'
  })
}
export function addAttributes(data) {
  return request({
    url: 'addAttributes',
    method: 'post',
    data
  })
}
export function addSpecification(data) {
  return request({
    url: 'addSpecification',
    method: 'post',
    data
  })
}
