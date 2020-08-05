export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  column: [
    {
      label: '权益名称',
      search: true,
      prop: 'rightsName'
    },
    {
      label: '权益图标',
      prop: 'icon',
      type: 'upload',
      slot: true,
      listType: 'picture-img'
    },
    {
      label: '权益简介',
      prop: 'description'
    },
    {
      label: '状态',
      prop: 'serviceType',
      search: true,
      type: 'select',
      slot: true,
      dicData: [
        {
          label: '系统权益',
          value: 0
        }, {
          label: '自定义权益',
          value: 1
        }
      ]
    },
    {
      label: '顺序',
      prop: 'seq'
    }
  ]
}
