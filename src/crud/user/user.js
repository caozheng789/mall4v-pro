export const tableOption = {
  border: true,
  index: false,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menuWidth: 350,
  align: 'center',
  refreshBtn: true,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: false,
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '用户昵称',
    prop: 'nickName',
    search: true
  },
  {
    label: '用户头像',
    prop: 'pic',
    slot: true
  },
  {
    label: '用户名称',
    prop: 'realName',
    search: true
  },
  {
    label: '手机号码',
    prop: 'userMobile',
    search: true
  },
  {
    label: '会员等级',
    prop: 'levelName'
  },
  {
    label: '会员类型',
    prop: 'levelType',
    search: true,
    type: 'select',
    slot: true,
    dicData: [
      {
        label: '普通会员',
        value: 0
      }, {
        label: '付费会员',
        value: 1
      }
    ]
  },
  {
    label: '用户积分',
    prop: 'score'
  },
  {
    label: '状态',
    prop: 'status',
    search: true,
    type: 'select',
    slot: true,
    dicData: [
      {
        label: '禁用',
        value: 0
      }, {
        label: '正常',
        value: 1
      }
    ]

  }]
}
